from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/locations", response_model=list[LocationResponse])
def list_locations(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    return (
        db.query(Location)
        .filter(Location.entity_id == entity_id)
        .order_by(Location.state)
        .all()
    )


@router.post("/{entity_id}/locations", response_model=LocationResponse, status_code=201)
def create_location(entity_id: str, payload: LocationCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    now = datetime.utcnow().isoformat()
    location = Location(
        **payload.model_dump(),
        entity_id=entity_id,
        created_at=now,
        updated_at=now,
    )
    db.add(location)
    db.commit()
    db.refresh(location)
    return location


@router.put("/{entity_id}/locations/{location_id}", response_model=LocationResponse)
def update_location(entity_id: str, location_id: str, payload: LocationUpdate, db: Session = Depends(get_db)):
    location = (
        db.query(Location)
        .filter(Location.id == location_id, Location.entity_id == entity_id)
        .first()
    )
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(location, field, value)
    location.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(location)
    return location


@router.delete("/{entity_id}/locations/{location_id}", status_code=204)
def delete_location(entity_id: str, location_id: str, db: Session = Depends(get_db)):
    location = (
        db.query(Location)
        .filter(Location.id == location_id, Location.entity_id == entity_id)
        .first()
    )
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(location)
    db.commit()
