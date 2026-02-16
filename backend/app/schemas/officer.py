from typing import Optional

from pydantic import BaseModel, Field


class OfficerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    title: Optional[str] = None
    state_of_residence: str = Field(..., min_length=2, max_length=2)


class OfficerUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    state_of_residence: Optional[str] = None


class OfficerResponse(BaseModel):
    id: str
    entity_id: str
    name: str
    title: Optional[str] = None
    state_of_residence: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
