from typing import Optional

from pydantic import BaseModel, Field


class RegisteredAgentCreate(BaseModel):
    state: str = Field(..., min_length=2, max_length=2)
    agent_name: Optional[str] = None


class RegisteredAgentResponse(BaseModel):
    id: str
    entity_id: str
    state: str
    agent_name: Optional[str] = None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
