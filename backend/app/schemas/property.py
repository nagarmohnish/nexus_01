from typing import Optional

from pydantic import BaseModel, Field


class PropertyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    url: Optional[str] = None
    description: Optional[str] = None


class PropertyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    url: Optional[str] = None
    description: Optional[str] = None


class PropertyResponse(BaseModel):
    id: str
    entity_id: str
    name: str
    url: Optional[str] = None
    description: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
