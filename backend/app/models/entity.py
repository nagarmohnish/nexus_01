import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Enum as SAEnum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class EntityType(str, enum.Enum):
    LLC = "LLC"
    S_CORP = "S-Corp"
    C_CORP = "C-Corp"
    SOLE_PROP = "Sole Proprietorship"
    PARTNERSHIP = "Partnership"


class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    legal_name = Column(String, nullable=False, index=True)
    dba_name = Column(String, nullable=True)
    entity_type = Column(SAEnum(EntityType), nullable=False)
    state_of_incorporation = Column(String(2), nullable=False)
    ein = Column(String(10), nullable=True)
    parent_entity_id = Column(String, ForeignKey("entities.id"), nullable=True)
    fiscal_year_end_month = Column(String, nullable=False, default="12")
    fiscal_year_end_day = Column(String, nullable=False, default="31")
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    parent_entity = relationship("Entity", remote_side=[id], backref="subsidiaries")
    employees = relationship("Employee", back_populates="entity", cascade="all, delete-orphan")
    contractors = relationship("Contractor", back_populates="entity", cascade="all, delete-orphan")
    officers = relationship("Officer", back_populates="entity", cascade="all, delete-orphan")
    locations = relationship("Location", back_populates="entity", cascade="all, delete-orphan")
    registered_agents = relationship("RegisteredAgent", back_populates="entity", cascade="all, delete-orphan")
