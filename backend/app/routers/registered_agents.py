from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.models.registered_agent import RegisteredAgent
from app.schemas.registered_agent import RegisteredAgentCreate, RegisteredAgentResponse

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/registered-agents", response_model=list[RegisteredAgentResponse])
def list_registered_agents(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    return (
        db.query(RegisteredAgent)
        .filter(RegisteredAgent.entity_id == entity_id)
        .order_by(RegisteredAgent.state)
        .all()
    )


@router.post("/{entity_id}/registered-agents", response_model=RegisteredAgentResponse, status_code=201)
def create_registered_agent(entity_id: str, payload: RegisteredAgentCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    now = datetime.utcnow().isoformat()
    ra = RegisteredAgent(
        **payload.model_dump(),
        entity_id=entity_id,
        created_at=now,
        updated_at=now,
    )
    db.add(ra)
    db.commit()
    db.refresh(ra)
    return ra


@router.delete("/{entity_id}/registered-agents/{ra_id}", status_code=204)
def delete_registered_agent(entity_id: str, ra_id: str, db: Session = Depends(get_db)):
    ra = (
        db.query(RegisteredAgent)
        .filter(RegisteredAgent.id == ra_id, RegisteredAgent.entity_id == entity_id)
        .first()
    )
    if not ra:
        raise HTTPException(status_code=404, detail="Registered agent not found")
    db.delete(ra)
    db.commit()
