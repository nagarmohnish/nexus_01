from typing import Optional

from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    state: str = Field(..., min_length=2, max_length=2)
    location_type: str  # headquarters, branch, coworking, warehouse, data_center, other
    description: Optional[str] = None


class LocationUpdate(BaseModel):
    state: Optional[str] = None
    location_type: Optional[str] = None
    description: Optional[str] = None


class LocationResponse(BaseModel):
    id: str
    entity_id: str
    state: str
    location_type: str
    description: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
