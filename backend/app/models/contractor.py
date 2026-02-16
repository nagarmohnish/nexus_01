import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Enum as SAEnum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class ContractorType(str, enum.Enum):
    ONGOING = "ongoing"
    PROJECT_BASED = "project_based"


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    state = Column(String(2), nullable=False, index=True)
    role = Column(String, nullable=True)
    contractor_type = Column(SAEnum(ContractorType), nullable=False)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="contractors")
