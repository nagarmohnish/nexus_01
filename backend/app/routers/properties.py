from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyResponse, PropertyUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/properties", response_model=list[PropertyResponse])
def list_properties(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    return (
        db.query(Property)
        .filter(Property.entity_id == entity_id)
        .order_by(Property.name)
        .all()
    )


@router.post("/{entity_id}/properties", response_model=PropertyResponse, status_code=201)
def create_property(entity_id: str, payload: PropertyCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    existing = (
        db.query(Property)
        .filter(Property.entity_id == entity_id, Property.name == payload.name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail=f"Property '{payload.name}' already exists for this entity")
    now = datetime.utcnow().isoformat()
    prop = Property(**payload.model_dump(), entity_id=entity_id, created_at=now, updated_at=now)
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@router.put("/{entity_id}/properties/{property_id}", response_model=PropertyResponse)
def update_property(entity_id: str, property_id: str, payload: PropertyUpdate, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id, Property.entity_id == entity_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)
    prop.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/{entity_id}/properties/{property_id}", status_code=204)
def delete_property(entity_id: str, property_id: str, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id, Property.entity_id == entity_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
