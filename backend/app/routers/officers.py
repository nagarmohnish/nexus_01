from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.models.officer import Officer
from app.schemas.officer import OfficerCreate, OfficerResponse, OfficerUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/officers", response_model=list[OfficerResponse])
def list_officers(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    return (
        db.query(Officer)
        .filter(Officer.entity_id == entity_id)
        .order_by(Officer.name)
        .all()
    )


@router.post("/{entity_id}/officers", response_model=OfficerResponse, status_code=201)
def create_officer(entity_id: str, payload: OfficerCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    now = datetime.utcnow().isoformat()
    officer = Officer(
        **payload.model_dump(),
        entity_id=entity_id,
        created_at=now,
        updated_at=now,
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer


@router.put("/{entity_id}/officers/{officer_id}", response_model=OfficerResponse)
def update_officer(entity_id: str, officer_id: str, payload: OfficerUpdate, db: Session = Depends(get_db)):
    officer = (
        db.query(Officer)
        .filter(Officer.id == officer_id, Officer.entity_id == entity_id)
        .first()
    )
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(officer, field, value)
    officer.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(officer)
    return officer


@router.delete("/{entity_id}/officers/{officer_id}", status_code=204)
def delete_officer(entity_id: str, officer_id: str, db: Session = Depends(get_db)):
    officer = (
        db.query(Officer)
        .filter(Officer.id == officer_id, Officer.entity_id == entity_id)
        .first()
    )
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    db.delete(officer)
    db.commit()
