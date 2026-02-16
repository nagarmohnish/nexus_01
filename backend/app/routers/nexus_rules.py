from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.state_nexus_rule import StateNexusRule
from app.schemas.state_nexus_rule import StateNexusRuleResponse

router = APIRouter()


@router.get("", response_model=list[StateNexusRuleResponse])
def list_nexus_rules(db: Session = Depends(get_db)):
    return db.query(StateNexusRule).order_by(StateNexusRule.state_code).all()


@router.get("/{state_code}", response_model=StateNexusRuleResponse)
def get_nexus_rule(state_code: str, db: Session = Depends(get_db)):
    rule = (
        db.query(StateNexusRule)
        .filter(StateNexusRule.state_code == state_code.upper())
        .first()
    )
    if not rule:
        raise HTTPException(status_code=404, detail=f"No rules found for state: {state_code}")
    return rule
