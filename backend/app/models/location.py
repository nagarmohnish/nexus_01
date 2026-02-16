import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Enum as SAEnum, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class LocationType(str, enum.Enum):
    HEADQUARTERS = "headquarters"
    BRANCH = "branch"
    COWORKING = "coworking"
    WAREHOUSE = "warehouse"
    DATA_CENTER = "data_center"
    OTHER = "other"


class Location(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    state = Column(String(2), nullable=False, index=True)
    location_type = Column(SAEnum(LocationType), nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="locations")
