import uuid
from datetime import datetime

from sqlalchemy import Column, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Revenue(Base):
    """Revenue data per property, per state, per year, broken down by source."""
    __tablename__ = "revenues"
    __table_args__ = (
        UniqueConstraint("property_id", "state_code", "year", name="uq_revenue_property_state_year"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    state_code = Column(String(2), nullable=False, index=True)
    year = Column(Integer, nullable=False)  # e.g., 2024

    # Revenue by source
    advertising_mediavine = Column(Float, nullable=False, default=0.0)
    advertising_raptive = Column(Float, nullable=False, default=0.0)
    advertising_adsense = Column(Float, nullable=False, default=0.0)
    advertising_other = Column(Float, nullable=False, default=0.0)
    syndication_msn = Column(Float, nullable=False, default=0.0)
    syndication_newsbreak = Column(Float, nullable=False, default=0.0)
    syndication_other = Column(Float, nullable=False, default=0.0)
    newsletter_revenue = Column(Float, nullable=False, default=0.0)
    affiliate_revenue = Column(Float, nullable=False, default=0.0)
    sponsored_content = Column(Float, nullable=False, default=0.0)
    direct_sales = Column(Float, nullable=False, default=0.0)
    other_revenue = Column(Float, nullable=False, default=0.0)

    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", backref="revenues")
    prop = relationship("Property", back_populates="revenues")

    @property
    def total_advertising(self):
        return (
            self.advertising_mediavine + self.advertising_raptive +
            self.advertising_adsense + self.advertising_other
        )

    @property
    def total_syndication(self):
        return self.syndication_msn + self.syndication_newsbreak + self.syndication_other

    @property
    def total_revenue(self):
        return (
            self.total_advertising + self.total_syndication +
            self.newsletter_revenue + self.affiliate_revenue +
            self.sponsored_content + self.direct_sales + self.other_revenue
        )
