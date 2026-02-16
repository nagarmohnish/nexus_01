from typing import Optional

from pydantic import BaseModel, Field


class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    state: str = Field(..., min_length=2, max_length=2)
    role: Optional[str] = None
    employment_type: str  # "full_time" or "part_time"
    start_date: Optional[str] = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    role: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: str
    entity_id: str
    name: str
    state: str
    role: Optional[str] = None
    employment_type: str
    start_date: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
