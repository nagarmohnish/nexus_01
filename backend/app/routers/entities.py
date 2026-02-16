from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.schemas.entity import EntityCreate, EntityListResponse, EntityResponse, EntityUpdate

router = APIRouter()


@router.get("", response_model=list[EntityListResponse])
def list_entities(parent_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Entity)
    if parent_id:
        query = query.filter(Entity.parent_entity_id == parent_id)
    entities = query.order_by(Entity.legal_name).all()

    results = []
    for e in entities:
        results.append(EntityListResponse(
            id=e.id,
            legal_name=e.legal_name,
            dba_name=e.dba_name,
            entity_type=e.entity_type.value if e.entity_type else e.entity_type,
            state_of_incorporation=e.state_of_incorporation,
            ein=e.ein,
            parent_entity_id=e.parent_entity_id,
            fiscal_year_end_month=e.fiscal_year_end_month,
            fiscal_year_end_day=e.fiscal_year_end_day,
            created_at=e.created_at,
            updated_at=e.updated_at,
            employee_count=len(e.employees),
            contractor_count=len(e.contractors),
            officer_count=len(e.officers),
            location_count=len(e.locations),
        ))
    return results


@router.post("", response_model=EntityResponse, status_code=201)
def create_entity(payload: EntityCreate, db: Session = Depends(get_db)):
    now = datetime.utcnow().isoformat()
    entity = Entity(
        **payload.model_dump(),
        created_at=now,
        updated_at=now,
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return _to_response(entity)


@router.get("/{entity_id}", response_model=EntityResponse)
def get_entity(entity_id: str, db: Session = Depends(get_db)):
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return _to_response(entity)


@router.put("/{entity_id}", response_model=EntityResponse)
def update_entity(entity_id: str, payload: EntityUpdate, db: Session = Depends(get_db)):
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entity, field, value)
    entity.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(entity)
    return _to_response(entity)


@router.delete("/{entity_id}", status_code=204)
def delete_entity(entity_id: str, db: Session = Depends(get_db)):
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    db.delete(entity)
    db.commit()


def _to_response(entity: Entity) -> EntityResponse:
    return EntityResponse(
        id=entity.id,
        legal_name=entity.legal_name,
        dba_name=entity.dba_name,
        entity_type=entity.entity_type.value if entity.entity_type else entity.entity_type,
        state_of_incorporation=entity.state_of_incorporation,
        ein=entity.ein,
        parent_entity_id=entity.parent_entity_id,
        fiscal_year_end_month=entity.fiscal_year_end_month,
        fiscal_year_end_day=entity.fiscal_year_end_day,
        created_at=entity.created_at,
        updated_at=entity.updated_at,
    )
