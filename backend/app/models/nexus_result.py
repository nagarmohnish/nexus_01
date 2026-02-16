import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Enum as SAEnum, ForeignKey, String, Text, UniqueConstraint

from app.database import Base


class NexusStatus(str, enum.Enum):
    DEFINITE = "definite"
    PROBABLE = "probable"
    POSSIBLE = "possible"
    NO_NEXUS = "no_nexus"


class NexusResult(Base):
    __tablename__ = "nexus_results"
    __table_args__ = (
        UniqueConstraint("entity_id", "state_code", name="uq_entity_state"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    state_code = Column(String(2), nullable=False, index=True)
    status = Column(SAEnum(NexusStatus), nullable=False)
    reason_codes = Column(Text, nullable=False)  # JSON array
    details = Column(Text, nullable=True)  # JSON object
    computed_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
