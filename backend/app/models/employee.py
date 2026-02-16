import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Enum as SAEnum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class EmploymentType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    state = Column(String(2), nullable=False, index=True)
    role = Column(String, nullable=True)
    employment_type = Column(SAEnum(EmploymentType), nullable=False)
    start_date = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="employees")
