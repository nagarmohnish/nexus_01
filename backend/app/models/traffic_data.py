import uuid
from datetime import datetime

from sqlalchemy import Column, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class TrafficData(Base):
    """Audience/traffic data per property, per state, per year."""
    __tablename__ = "traffic_data"
    __table_args__ = (
        UniqueConstraint("property_id", "state_code", "year", name="uq_traffic_property_state_year"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    state_code = Column(String(2), nullable=False, index=True)
    year = Column(Integer, nullable=False)

    monthly_pageviews = Column(Integer, nullable=False, default=0)
    percentage_of_total = Column(Float, nullable=True)  # e.g., 15.5 for 15.5%
    newsletter_subscribers = Column(Integer, nullable=False, default=0)

    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", backref="traffic_data")
    prop = relationship("Property", back_populates="traffic_data")
