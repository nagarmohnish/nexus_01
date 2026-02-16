import json
import uuid
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.contractor import Contractor
from app.models.employee import Employee
from app.models.entity import Entity
from app.models.location import Location
from app.models.nexus_result import NexusResult, NexusStatus
from app.models.officer import Officer
from app.models.registered_agent import RegisteredAgent
from app.models.revenue import Revenue
from app.models.state_nexus_rule import StateNexusRule
from app.models.traffic_data import TrafficData

# Physical nexus reason codes
REASON_EMPLOYEE = "EMPLOYEE_PRESENT"
REASON_CONTRACTOR = "CONTRACTOR_PRESENT"
REASON_OFFICER = "OFFICER_RESIDENT"
REASON_OFFICE = "OFFICE_LOCATION"
REASON_WAREHOUSE = "WAREHOUSE_LOCATION"
REASON_COWORKING = "COWORKING_LOCATION"
REASON_REGISTERED_AGENT = "REGISTERED_AGENT"
REASON_INCORPORATION = "STATE_OF_INCORPORATION"

# Economic nexus reason codes
REASON_ECONOMIC_INCOME = "ECONOMIC_NEXUS_INCOME_TAX"
REASON_ECONOMIC_SALES = "ECONOMIC_NEXUS_SALES_TAX"
REASON_ECONOMIC_FRANCHISE = "ECONOMIC_NEXUS_FRANCHISE_TAX"
REASON_ECONOMIC_GROSS_RECEIPTS = "ECONOMIC_NEXUS_GROSS_RECEIPTS"
REASON_ESTIMATED_REVENUE = "ESTIMATED_REVENUE_FROM_TRAFFIC"


class NexusEngine:
    def __init__(self, db: Session):
        self.db = db

    def analyze_entity(self, entity_id: str) -> dict:
        entity = self._load_entity(entity_id)
        presence = self._gather_presence(entity_id, entity.state_of_incorporation)
        revenue_by_state = self._gather_revenue(entity_id)
        traffic_by_state = self._gather_traffic(entity_id)
        total_national_revenue = sum(revenue_by_state.values())
        rules = self._load_rules()

        # If we have traffic data but missing revenue for some states,
        # estimate revenue attribution based on traffic percentages
        estimated_revenue = self._estimate_revenue_from_traffic(
            revenue_by_state, traffic_by_state, total_national_revenue
        )

        now = datetime.utcnow().isoformat()
        results = []

        for rule in rules:
            state = rule.state_code
            state_presence = presence.get(state, {})

            definite_reasons = []
            probable_reasons = []
            possible_reasons = []
            details = {}

            # ── PHYSICAL NEXUS CHECKS ──

            # 1. Employees
            employees_in_state = state_presence.get("employees", [])
            if employees_in_state:
                details["employees"] = employees_in_state
                if rule.employee_creates_nexus:
                    definite_reasons.append(REASON_EMPLOYEE)

            # 2. Contractors
            contractors_in_state = state_presence.get("contractors", [])
            if contractors_in_state:
                details["contractors"] = contractors_in_state
                if rule.contractor_creates_nexus:
                    definite_reasons.append(REASON_CONTRACTOR)
                elif rule.contractor_possible_nexus:
                    possible_reasons.append(REASON_CONTRACTOR)

            # 3. Officers / Directors
            officers_in_state = state_presence.get("officers", [])
            if officers_in_state:
                details["officers"] = officers_in_state
                if rule.officer_creates_nexus:
                    definite_reasons.append(REASON_OFFICER)
                elif rule.officer_possible_nexus:
                    possible_reasons.append(REASON_OFFICER)

            # 4. Office/HQ/Branch locations
            offices_in_state = state_presence.get("offices", [])
            if offices_in_state:
                details["offices"] = offices_in_state
                if rule.office_creates_nexus:
                    definite_reasons.append(REASON_OFFICE)

            # 5. Warehouses
            warehouses_in_state = state_presence.get("warehouses", [])
            if warehouses_in_state:
                details["warehouses"] = warehouses_in_state
                if rule.warehouse_creates_nexus:
                    definite_reasons.append(REASON_WAREHOUSE)

            # 6. Co-working spaces
            coworking_in_state = state_presence.get("coworking", [])
            if coworking_in_state:
                details["coworking"] = coworking_in_state
                if rule.coworking_creates_nexus:
                    definite_reasons.append(REASON_COWORKING)
                elif rule.coworking_possible_nexus:
                    possible_reasons.append(REASON_COWORKING)

            # 7. Registered Agent
            has_ra = state_presence.get("registered_agent", False)
            if has_ra:
                details["registered_agent"] = True
                if rule.registered_agent_creates_nexus:
                    definite_reasons.append(REASON_REGISTERED_AGENT)
                elif rule.registered_agent_possible_nexus:
                    possible_reasons.append(REASON_REGISTERED_AGENT)

            # 8. State of Incorporation
            is_incorp_state = state_presence.get("incorporation", False)
            if is_incorp_state:
                details["incorporation"] = True
                if rule.incorporation_creates_nexus:
                    definite_reasons.append(REASON_INCORPORATION)

            # ── ECONOMIC NEXUS CHECKS ──

            state_revenue = revenue_by_state.get(state, 0.0)
            state_estimated = estimated_revenue.get(state, 0.0)
            effective_revenue = state_revenue if state_revenue > 0 else state_estimated
            is_estimated = state_revenue == 0 and state_estimated > 0

            if effective_revenue > 0:
                details["revenue"] = {
                    "actual": round(state_revenue, 2),
                    "estimated": round(state_estimated, 2) if is_estimated else None,
                    "effective": round(effective_revenue, 2),
                    "is_estimated": is_estimated,
                }

            # Traffic data
            traffic = traffic_by_state.get(state)
            if traffic:
                details["traffic"] = traffic

            # Income/franchise tax economic nexus
            if rule.economic_nexus_revenue_threshold and effective_revenue > 0:
                if effective_revenue >= rule.economic_nexus_revenue_threshold:
                    if is_estimated:
                        probable_reasons.append(REASON_ESTIMATED_REVENUE)
                    else:
                        definite_reasons.append(REASON_ECONOMIC_INCOME)
                    details["income_tax_threshold"] = {
                        "threshold": rule.economic_nexus_revenue_threshold,
                        "revenue": round(effective_revenue, 2),
                        "exceeded": True,
                    }

            # Sales tax economic nexus
            if rule.has_sales_tax and rule.sales_tax_economic_nexus_revenue and effective_revenue > 0:
                if effective_revenue >= rule.sales_tax_economic_nexus_revenue:
                    if is_estimated:
                        probable_reasons.append(REASON_ECONOMIC_SALES)
                    else:
                        definite_reasons.append(REASON_ECONOMIC_SALES)
                    details["sales_tax_threshold"] = {
                        "threshold": rule.sales_tax_economic_nexus_revenue,
                        "revenue": round(effective_revenue, 2),
                        "exceeded": True,
                    }

            # Franchise tax (for states like TX with revenue-based franchise tax)
            if rule.has_franchise_tax and rule.franchise_tax_threshold and effective_revenue > 0:
                if effective_revenue >= rule.franchise_tax_threshold:
                    if is_estimated:
                        probable_reasons.append(REASON_ECONOMIC_FRANCHISE)
                    else:
                        definite_reasons.append(REASON_ECONOMIC_FRANCHISE)
                    details["franchise_tax_threshold"] = {
                        "threshold": rule.franchise_tax_threshold,
                        "revenue": round(effective_revenue, 2),
                        "exceeded": True,
                    }

            # Gross receipts tax
            if rule.has_gross_receipts_tax and rule.gross_receipts_threshold and effective_revenue > 0:
                if effective_revenue >= rule.gross_receipts_threshold:
                    if is_estimated:
                        probable_reasons.append(REASON_ECONOMIC_GROSS_RECEIPTS)
                    else:
                        definite_reasons.append(REASON_ECONOMIC_GROSS_RECEIPTS)
                    details["gross_receipts_threshold"] = {
                        "threshold": rule.gross_receipts_threshold,
                        "revenue": round(effective_revenue, 2),
                        "exceeded": True,
                    }

            # ── DETERMINE STATUS ──
            # Priority: definite > probable > possible > no_nexus
            if definite_reasons:
                status = NexusStatus.DEFINITE
                all_reasons = definite_reasons + probable_reasons + possible_reasons
            elif probable_reasons:
                status = NexusStatus.PROBABLE
                all_reasons = probable_reasons + possible_reasons
            elif possible_reasons:
                status = NexusStatus.POSSIBLE
                all_reasons = possible_reasons
            else:
                status = NexusStatus.NO_NEXUS
                all_reasons = []

            if all_reasons or details:
                results.append({
                    "state_code": state,
                    "state_name": rule.state_name,
                    "status": status.value,
                    "reason_codes": all_reasons,
                    "details": details,
                    "has_income_tax": not rule.no_income_tax,
                    "has_sales_tax": rule.has_sales_tax if rule.has_sales_tax is not None else True,
                    "notes": rule.notes,
                })

        self._store_results(entity_id, results, now)

        return self._build_response(entity_id, entity.legal_name, now, results)

    def _gather_presence(self, entity_id: str, incorp_state: str) -> dict:
        presence: dict[str, dict] = {}

        def ensure_state(state_code: str):
            if state_code not in presence:
                presence[state_code] = {}

        for emp in self.db.query(Employee).filter(Employee.entity_id == entity_id).all():
            ensure_state(emp.state)
            presence[emp.state].setdefault("employees", []).append({
                "name": emp.name,
                "role": emp.role,
                "type": emp.employment_type.value if emp.employment_type else None,
            })

        for con in self.db.query(Contractor).filter(Contractor.entity_id == entity_id).all():
            ensure_state(con.state)
            presence[con.state].setdefault("contractors", []).append({
                "name": con.name,
                "role": con.role,
                "type": con.contractor_type.value if con.contractor_type else None,
            })

        for off in self.db.query(Officer).filter(Officer.entity_id == entity_id).all():
            ensure_state(off.state_of_residence)
            presence[off.state_of_residence].setdefault("officers", []).append({
                "name": off.name,
                "title": off.title,
            })

        for loc in self.db.query(Location).filter(Location.entity_id == entity_id).all():
            ensure_state(loc.state)
            loc_type = loc.location_type.value if loc.location_type else "other"
            if loc_type in ("headquarters", "branch"):
                presence[loc.state].setdefault("offices", []).append({
                    "type": loc_type, "description": loc.description,
                })
            elif loc_type == "warehouse":
                presence[loc.state].setdefault("warehouses", []).append({
                    "type": loc_type, "description": loc.description,
                })
            elif loc_type == "coworking":
                presence[loc.state].setdefault("coworking", []).append({
                    "type": loc_type, "description": loc.description,
                })
            else:
                presence[loc.state].setdefault("offices", []).append({
                    "type": loc_type, "description": loc.description,
                })

        for ra in self.db.query(RegisteredAgent).filter(RegisteredAgent.entity_id == entity_id).all():
            ensure_state(ra.state)
            presence[ra.state]["registered_agent"] = True

        ensure_state(incorp_state)
        presence[incorp_state]["incorporation"] = True

        return presence

    def _gather_revenue(self, entity_id: str) -> dict[str, float]:
        """Aggregate actual revenue by state across all years."""
        revenues = self.db.query(Revenue).filter(Revenue.entity_id == entity_id).all()
        by_state: dict[str, float] = {}
        for r in revenues:
            by_state[r.state_code] = by_state.get(r.state_code, 0.0) + r.total_revenue
        return by_state

    def _gather_traffic(self, entity_id: str) -> dict[str, dict]:
        """Get traffic data by state."""
        traffic = self.db.query(TrafficData).filter(TrafficData.entity_id == entity_id).all()
        by_state: dict[str, dict] = {}
        for t in traffic:
            by_state[t.state_code] = {
                "monthly_pageviews": t.monthly_pageviews,
                "percentage_of_total": t.percentage_of_total,
                "newsletter_subscribers": t.newsletter_subscribers,
            }
        return by_state

    def _estimate_revenue_from_traffic(
        self,
        revenue_by_state: dict[str, float],
        traffic_by_state: dict[str, dict],
        total_national_revenue: float,
    ) -> dict[str, float]:
        """
        For states where we have traffic data but no direct revenue entry,
        estimate revenue attribution based on traffic percentage.
        """
        estimated: dict[str, float] = {}
        if total_national_revenue <= 0:
            return estimated

        for state, traffic in traffic_by_state.items():
            if state in revenue_by_state and revenue_by_state[state] > 0:
                continue  # Already have actual revenue
            pct = traffic.get("percentage_of_total")
            if pct and pct > 0:
                estimated[state] = total_national_revenue * (pct / 100.0)

        return estimated

    def _load_entity(self, entity_id: str) -> Entity:
        entity = self.db.query(Entity).filter(Entity.id == entity_id).first()
        if not entity:
            raise HTTPException(status_code=404, detail="Entity not found")
        return entity

    def _load_rules(self) -> list[StateNexusRule]:
        return self.db.query(StateNexusRule).order_by(StateNexusRule.state_code).all()

    def _store_results(self, entity_id: str, results: list[dict], now: str):
        self.db.query(NexusResult).filter(NexusResult.entity_id == entity_id).delete()
        for r in results:
            result = NexusResult(
                id=str(uuid.uuid4()),
                entity_id=entity_id,
                state_code=r["state_code"],
                status=r["status"],
                reason_codes=json.dumps(r["reason_codes"]),
                details=json.dumps(r["details"]),
                computed_at=now,
            )
            self.db.add(result)
        self.db.commit()

    def _build_response(self, entity_id: str, entity_name: str, computed_at: str, results: list[dict]) -> dict:
        return {
            "entity_id": entity_id,
            "entity_name": entity_name,
            "computed_at": computed_at,
            "states": results,
            "summary": {
                "definite": sum(1 for r in results if r["status"] == "definite"),
                "probable": sum(1 for r in results if r["status"] == "probable"),
                "possible": sum(1 for r in results if r["status"] == "possible"),
                "no_nexus": 51 - sum(1 for r in results if r["status"] in ("definite", "probable", "possible")),
            },
        }

    def get_stored_results(self, entity_id: str) -> dict:
        entity = self._load_entity(entity_id)
        results = self.db.query(NexusResult).filter(NexusResult.entity_id == entity_id).all()
        rules_map = {r.state_code: r for r in self._load_rules()}

        states = []
        for r in results:
            rule = rules_map.get(r.state_code)
            states.append({
                "state_code": r.state_code,
                "state_name": rule.state_name if rule else r.state_code,
                "status": r.status.value if hasattr(r.status, "value") else r.status,
                "reason_codes": json.loads(r.reason_codes),
                "details": json.loads(r.details) if r.details else {},
                "has_income_tax": not rule.no_income_tax if rule else True,
                "has_sales_tax": rule.has_sales_tax if rule and rule.has_sales_tax is not None else True,
                "notes": rule.notes if rule else None,
            })

        computed_at = results[0].computed_at if results else None
        return self._build_response(entity_id, entity.legal_name, computed_at, states)

    def get_summary(self, entity_id: str) -> dict:
        entity = self._load_entity(entity_id)
        results = self.db.query(NexusResult).filter(NexusResult.entity_id == entity_id).all()

        def status_of(r):
            return r.status.value if hasattr(r.status, "value") else r.status

        definite = [r.state_code for r in results if status_of(r) == "definite"]
        probable = [r.state_code for r in results if status_of(r) == "probable"]
        possible = [r.state_code for r in results if status_of(r) == "possible"]

        return {
            "entity_id": entity_id,
            "definite_nexus_count": len(definite),
            "probable_nexus_count": len(probable),
            "possible_nexus_count": len(possible),
            "no_nexus_count": 51 - len(definite) - len(probable) - len(possible),
            "definite_states": sorted(definite),
            "probable_states": sorted(probable),
            "possible_states": sorted(possible),
            "last_analyzed": results[0].computed_at if results else None,
        }
