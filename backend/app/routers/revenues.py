from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.entity import Entity
from app.models.property import Property
from app.models.revenue import Revenue
from app.schemas.revenue import RevenueCreate, RevenueResponse, RevenueUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


def _revenue_to_response(r: Revenue) -> RevenueResponse:
    return RevenueResponse(
        id=r.id,
        entity_id=r.entity_id,
        property_id=r.property_id,
        property_name=r.prop.name if r.prop else None,
        state_code=r.state_code,
        year=r.year,
        advertising_mediavine=r.advertising_mediavine,
        advertising_raptive=r.advertising_raptive,
        advertising_adsense=r.advertising_adsense,
        advertising_other=r.advertising_other,
        syndication_msn=r.syndication_msn,
        syndication_newsbreak=r.syndication_newsbreak,
        syndication_other=r.syndication_other,
        newsletter_revenue=r.newsletter_revenue,
        affiliate_revenue=r.affiliate_revenue,
        sponsored_content=r.sponsored_content,
        direct_sales=r.direct_sales,
        other_revenue=r.other_revenue,
        total_revenue=r.total_revenue,
        created_at=r.created_at,
        updated_at=r.updated_at,
    )


@router.get("/{entity_id}/revenues", response_model=list[RevenueResponse])
def list_revenues(entity_id: str, year: int | None = None, property_id: str | None = None, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    query = db.query(Revenue).options(joinedload(Revenue.prop)).filter(Revenue.entity_id == entity_id)
    if year:
        query = query.filter(Revenue.year == year)
    if property_id:
        query = query.filter(Revenue.property_id == property_id)
    revenues = query.order_by(Revenue.year.desc(), Revenue.state_code).all()
    return [_revenue_to_response(r) for r in revenues]


@router.post("/{entity_id}/revenues", response_model=RevenueResponse, status_code=201)
def create_revenue(entity_id: str, payload: RevenueCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    # Validate property belongs to entity
    prop = db.query(Property).filter(Property.id == payload.property_id, Property.entity_id == entity_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found for this entity")
    # Check for duplicate
    existing = (
        db.query(Revenue)
        .filter(Revenue.property_id == payload.property_id, Revenue.state_code == payload.state_code, Revenue.year == payload.year)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail=f"Revenue entry already exists for {prop.name} in {payload.state_code} for {payload.year}")
    now = datetime.utcnow().isoformat()
    revenue = Revenue(**payload.model_dump(), entity_id=entity_id, created_at=now, updated_at=now)
    db.add(revenue)
    db.commit()
    db.refresh(revenue)
    return _revenue_to_response(revenue)


@router.put("/{entity_id}/revenues/{revenue_id}", response_model=RevenueResponse)
def update_revenue(entity_id: str, revenue_id: str, payload: RevenueUpdate, db: Session = Depends(get_db)):
    revenue = db.query(Revenue).filter(Revenue.id == revenue_id, Revenue.entity_id == entity_id).first()
    if not revenue:
        raise HTTPException(status_code=404, detail="Revenue entry not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(revenue, field, value)
    revenue.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(revenue)
    return _revenue_to_response(revenue)


@router.delete("/{entity_id}/revenues/{revenue_id}", status_code=204)
def delete_revenue(entity_id: str, revenue_id: str, db: Session = Depends(get_db)):
    revenue = db.query(Revenue).filter(Revenue.id == revenue_id, Revenue.entity_id == entity_id).first()
    if not revenue:
        raise HTTPException(status_code=404, detail="Revenue entry not found")
    db.delete(revenue)
    db.commit()


@router.get("/{entity_id}/revenues/summary", response_model=dict)
def revenue_summary(entity_id: str, year: int | None = None, property_id: str | None = None, db: Session = Depends(get_db)):
    """Get total revenue by state for an entity, aggregated across all properties."""
    _get_entity_or_404(entity_id, db)
    query = db.query(Revenue).filter(Revenue.entity_id == entity_id)
    if year:
        query = query.filter(Revenue.year == year)
    if property_id:
        query = query.filter(Revenue.property_id == property_id)
    revenues = query.all()

    by_state = {}
    total_national = 0.0
    for r in revenues:
        total = r.total_revenue
        by_state[r.state_code] = by_state.get(r.state_code, 0.0) + total
        total_national += total

    return {
        "entity_id": entity_id,
        "year": year,
        "by_state": by_state,
        "total_national": total_national,
        "state_count": len(by_state),
    }
