import uuid
from datetime import datetime

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.database import Base


class Officer(Base):
    __tablename__ = "officers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    state_of_residence = Column(String(2), nullable=False, index=True)
    created_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())

    entity = relationship("Entity", back_populates="officers")
