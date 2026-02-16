import uuid
from datetime import datetime

from sqlalchemy import Column, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Property(Base):
    """A sub-brand / website / holding within an entity."""
    __tablename__ = "properties"
    __table_args__ = (
        UniqueConstraint("entity_id", "name", name="uq_property_entity_name"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="properties")
    revenues = relationship("Revenue", back_populates="prop", cascade="all, delete-orphan")
    traffic_data = relationship("TrafficData", back_populates="prop", cascade="all, delete-orphan")
