from typing import Optional

from pydantic import BaseModel


class StateNexusRuleResponse(BaseModel):
    id: str
    state_code: str
    state_name: str
    has_corporate_income_tax: bool
    has_franchise_tax: bool
    has_gross_receipts_tax: bool
    no_income_tax: bool
    employee_creates_nexus: bool
    contractor_creates_nexus: bool
    officer_creates_nexus: bool
    office_creates_nexus: bool
    warehouse_creates_nexus: bool
    coworking_creates_nexus: bool
    registered_agent_creates_nexus: bool
    incorporation_creates_nexus: bool
    contractor_possible_nexus: bool
    officer_possible_nexus: bool
    coworking_possible_nexus: bool
    registered_agent_possible_nexus: bool

    # Economic nexus - income/franchise
    economic_nexus_revenue_threshold: Optional[int] = None
    economic_nexus_applies_to_digital: bool = True
    economic_nexus_effective_date: Optional[str] = None
    apportionment_method: Optional[str] = None
    income_tax_rate: Optional[str] = None
    filing_due_date: Optional[str] = None

    # Sales tax
    has_sales_tax: bool = True
    sales_tax_economic_nexus_revenue: Optional[int] = None
    sales_tax_economic_nexus_transactions: Optional[int] = None
    digital_advertising_taxable: bool = False
    digital_subscriptions_taxable: bool = False
    sales_tax_effective_date: Optional[str] = None

    # Franchise/gross receipts
    franchise_tax_threshold: Optional[int] = None
    franchise_tax_rate: Optional[str] = None
    gross_receipts_threshold: Optional[int] = None
    gross_receipts_rate: Optional[str] = None

    notes: Optional[str] = None
    minimum_days_for_nexus: Optional[str] = None

    model_config = {"from_attributes": True}
