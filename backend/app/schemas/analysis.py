from typing import Optional

from pydantic import BaseModel


class StateNexusResultSchema(BaseModel):
    state_code: str
    state_name: str
    status: str  # "definite", "probable", "possible", "no_nexus"
    reason_codes: list[str]
    details: dict
    has_income_tax: bool
    has_sales_tax: bool = True
    notes: Optional[str] = None


class NexusAnalysisResponse(BaseModel):
    entity_id: str
    entity_name: str
    computed_at: Optional[str] = None
    states: list[StateNexusResultSchema]
    summary: dict


class NexusSummaryResponse(BaseModel):
    entity_id: str
    definite_nexus_count: int
    probable_nexus_count: int
    possible_nexus_count: int
    no_nexus_count: int
    definite_states: list[str]
    probable_states: list[str]
    possible_states: list[str]
    last_analyzed: Optional[str] = None
