from typing import Optional

from pydantic import BaseModel, Field


class TrafficDataCreate(BaseModel):
    property_id: str
    state_code: str = Field(..., min_length=2, max_length=2)
    year: int = Field(..., ge=2000, le=2100)
    monthly_pageviews: int = 0
    percentage_of_total: Optional[float] = None
    newsletter_subscribers: int = 0


class TrafficDataUpdate(BaseModel):
    monthly_pageviews: Optional[int] = None
    percentage_of_total: Optional[float] = None
    newsletter_subscribers: Optional[int] = None


class TrafficDataResponse(BaseModel):
    id: str
    entity_id: str
    property_id: str
    property_name: Optional[str] = None
    state_code: str
    year: int
    monthly_pageviews: int
    percentage_of_total: Optional[float] = None
    newsletter_subscribers: int
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
