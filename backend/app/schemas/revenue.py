from typing import Optional

from pydantic import BaseModel, Field


class RevenueCreate(BaseModel):
    state_code: str = Field(..., min_length=2, max_length=2)
    year: int = Field(..., ge=2000, le=2100)
    advertising_mediavine: float = 0.0
    advertising_raptive: float = 0.0
    advertising_adsense: float = 0.0
    advertising_other: float = 0.0
    syndication_msn: float = 0.0
    syndication_newsbreak: float = 0.0
    syndication_other: float = 0.0
    newsletter_revenue: float = 0.0
    affiliate_revenue: float = 0.0
    sponsored_content: float = 0.0
    direct_sales: float = 0.0
    other_revenue: float = 0.0


class RevenueUpdate(BaseModel):
    advertising_mediavine: Optional[float] = None
    advertising_raptive: Optional[float] = None
    advertising_adsense: Optional[float] = None
    advertising_other: Optional[float] = None
    syndication_msn: Optional[float] = None
    syndication_newsbreak: Optional[float] = None
    syndication_other: Optional[float] = None
    newsletter_revenue: Optional[float] = None
    affiliate_revenue: Optional[float] = None
    sponsored_content: Optional[float] = None
    direct_sales: Optional[float] = None
    other_revenue: Optional[float] = None


class RevenueResponse(BaseModel):
    id: str
    entity_id: str
    state_code: str
    year: int
    advertising_mediavine: float
    advertising_raptive: float
    advertising_adsense: float
    advertising_other: float
    syndication_msn: float
    syndication_newsbreak: float
    syndication_other: float
    newsletter_revenue: float
    affiliate_revenue: float
    sponsored_content: float
    direct_sales: float
    other_revenue: float
    total_revenue: float = 0.0
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
