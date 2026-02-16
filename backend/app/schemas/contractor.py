from typing import Optional

from pydantic import BaseModel, Field


class ContractorCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    state: str = Field(..., min_length=2, max_length=2)
    role: Optional[str] = None
    contractor_type: str  # "ongoing" or "project_based"


class ContractorUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    role: Optional[str] = None
    contractor_type: Optional[str] = None


class ContractorResponse(BaseModel):
    id: str
    entity_id: str
    name: str
    state: str
    role: Optional[str] = None
    contractor_type: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
