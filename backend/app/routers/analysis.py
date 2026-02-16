from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.analysis import NexusAnalysisResponse, NexusSummaryResponse
from app.services.nexus_engine import NexusEngine

router = APIRouter()


@router.post("/{entity_id}/analyze", response_model=NexusAnalysisResponse)
def run_nexus_analysis(entity_id: str, db: Session = Depends(get_db)):
    engine = NexusEngine(db)
    return engine.analyze_entity(entity_id)


@router.get("/{entity_id}/nexus-results", response_model=NexusAnalysisResponse)
def get_nexus_results(entity_id: str, db: Session = Depends(get_db)):
    engine = NexusEngine(db)
    return engine.get_stored_results(entity_id)


@router.get("/{entity_id}/nexus-summary", response_model=NexusSummaryResponse)
def get_nexus_summary(entity_id: str, db: Session = Depends(get_db)):
    engine = NexusEngine(db)
    return engine.get_summary(entity_id)
