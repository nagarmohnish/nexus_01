from typing import Optional

from pydantic import BaseModel, Field


class EntityCreate(BaseModel):
    legal_name: str = Field(..., min_length=1, max_length=255)
    dba_name: Optional[str] = None
    entity_type: str
    state_of_incorporation: str = Field(..., min_length=2, max_length=2)
    ein: Optional[str] = Field(None, pattern=r"^\d{2}-?\d{7}$")
    parent_entity_id: Optional[str] = None
    fiscal_year_end_month: str = Field(default="12")
    fiscal_year_end_day: str = Field(default="31")


class EntityUpdate(BaseModel):
    legal_name: Optional[str] = None
    dba_name: Optional[str] = None
    entity_type: Optional[str] = None
    state_of_incorporation: Optional[str] = None
    ein: Optional[str] = None
    parent_entity_id: Optional[str] = None
    fiscal_year_end_month: Optional[str] = None
    fiscal_year_end_day: Optional[str] = None


class EntityResponse(BaseModel):
    id: str
    legal_name: str
    dba_name: Optional[str] = None
    entity_type: str
    state_of_incorporation: str
    ein: Optional[str] = None
    parent_entity_id: Optional[str] = None
    fiscal_year_end_month: str
    fiscal_year_end_day: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class EntityListResponse(BaseModel):
    id: str
    legal_name: str
    dba_name: Optional[str] = None
    entity_type: str
    state_of_incorporation: str
    ein: Optional[str] = None
    parent_entity_id: Optional[str] = None
    fiscal_year_end_month: str
    fiscal_year_end_day: str
    created_at: str
    updated_at: str
    employee_count: int = 0
    contractor_count: int = 0
    officer_count: int = 0
    location_count: int = 0

    model_config = {"from_attributes": True}
