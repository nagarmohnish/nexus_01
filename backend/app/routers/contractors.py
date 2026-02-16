from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contractor import Contractor
from app.models.entity import Entity
from app.schemas.contractor import ContractorCreate, ContractorResponse, ContractorUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/contractors", response_model=list[ContractorResponse])
def list_contractors(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    return (
        db.query(Contractor)
        .filter(Contractor.entity_id == entity_id)
        .order_by(Contractor.name)
        .all()
    )


@router.post("/{entity_id}/contractors", response_model=ContractorResponse, status_code=201)
def create_contractor(entity_id: str, payload: ContractorCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    now = datetime.utcnow().isoformat()
    contractor = Contractor(
        **payload.model_dump(),
        entity_id=entity_id,
        created_at=now,
        updated_at=now,
    )
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return contractor


@router.put("/{entity_id}/contractors/{contractor_id}", response_model=ContractorResponse)
def update_contractor(entity_id: str, contractor_id: str, payload: ContractorUpdate, db: Session = Depends(get_db)):
    contractor = (
        db.query(Contractor)
        .filter(Contractor.id == contractor_id, Contractor.entity_id == entity_id)
        .first()
    )
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(contractor, field, value)
    contractor.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(contractor)
    return contractor


@router.delete("/{entity_id}/contractors/{contractor_id}", status_code=204)
def delete_contractor(entity_id: str, contractor_id: str, db: Session = Depends(get_db)):
    contractor = (
        db.query(Contractor)
        .filter(Contractor.id == contractor_id, Contractor.entity_id == entity_id)
        .first()
    )
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    db.delete(contractor)
    db.commit()
