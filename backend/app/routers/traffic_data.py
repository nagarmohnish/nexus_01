from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entity import Entity
from app.models.traffic_data import TrafficData
from app.schemas.traffic_data import TrafficDataCreate, TrafficDataResponse, TrafficDataUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/traffic", response_model=list[TrafficDataResponse])
def list_traffic_data(entity_id: str, year: int | None = None, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    query = db.query(TrafficData).filter(TrafficData.entity_id == entity_id)
    if year:
        query = query.filter(TrafficData.year == year)
    return query.order_by(TrafficData.year.desc(), TrafficData.state_code).all()


@router.post("/{entity_id}/traffic", response_model=TrafficDataResponse, status_code=201)
def create_traffic_data(entity_id: str, payload: TrafficDataCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    existing = (
        db.query(TrafficData)
        .filter(TrafficData.entity_id == entity_id, TrafficData.state_code == payload.state_code, TrafficData.year == payload.year)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail=f"Traffic data already exists for {payload.state_code} in {payload.year}")
    now = datetime.utcnow().isoformat()
    td = TrafficData(**payload.model_dump(), entity_id=entity_id, created_at=now, updated_at=now)
    db.add(td)
    db.commit()
    db.refresh(td)
    return td


@router.put("/{entity_id}/traffic/{traffic_id}", response_model=TrafficDataResponse)
def update_traffic_data(entity_id: str, traffic_id: str, payload: TrafficDataUpdate, db: Session = Depends(get_db)):
    td = db.query(TrafficData).filter(TrafficData.id == traffic_id, TrafficData.entity_id == entity_id).first()
    if not td:
        raise HTTPException(status_code=404, detail="Traffic data not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(td, field, value)
    td.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(td)
    return td


@router.delete("/{entity_id}/traffic/{traffic_id}", status_code=204)
def delete_traffic_data(entity_id: str, traffic_id: str, db: Session = Depends(get_db)):
    td = db.query(TrafficData).filter(TrafficData.id == traffic_id, TrafficData.entity_id == entity_id).first()
    if not td:
        raise HTTPException(status_code=404, detail="Traffic data not found")
    db.delete(td)
    db.commit()
