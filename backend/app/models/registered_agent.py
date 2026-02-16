import uuid
from datetime import datetime

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class RegisteredAgent(Base):
    __tablename__ = "registered_agents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    state = Column(String(2), nullable=False, index=True)
    agent_name = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="registered_agents")
