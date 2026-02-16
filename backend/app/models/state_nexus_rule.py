import uuid

from sqlalchemy import Boolean, Column, Float, Integer, String, Text

from app.database import Base


class StateNexusRule(Base):
    __tablename__ = "state_nexus_rules"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    state_code = Column(String(2), nullable=False, unique=True, index=True)
    state_name = Column(String, nullable=False)

    has_corporate_income_tax = Column(Boolean, nullable=False, default=True)
    has_franchise_tax = Column(Boolean, nullable=False, default=False)
    has_gross_receipts_tax = Column(Boolean, nullable=False, default=False)
    no_income_tax = Column(Boolean, nullable=False, default=False)

    # Definite nexus triggers
    employee_creates_nexus = Column(Boolean, nullable=False, default=True)
    contractor_creates_nexus = Column(Boolean, nullable=False, default=False)
    officer_creates_nexus = Column(Boolean, nullable=False, default=False)
    office_creates_nexus = Column(Boolean, nullable=False, default=True)
    warehouse_creates_nexus = Column(Boolean, nullable=False, default=True)
    coworking_creates_nexus = Column(Boolean, nullable=False, default=False)
    registered_agent_creates_nexus = Column(Boolean, nullable=False, default=False)
    incorporation_creates_nexus = Column(Boolean, nullable=False, default=False)

    # Possible nexus triggers
    contractor_possible_nexus = Column(Boolean, nullable=False, default=True)
    officer_possible_nexus = Column(Boolean, nullable=False, default=True)
    coworking_possible_nexus = Column(Boolean, nullable=False, default=True)
    registered_agent_possible_nexus = Column(Boolean, nullable=False, default=False)

    # Economic nexus - income/franchise tax
    economic_nexus_revenue_threshold = Column(Integer, nullable=True)  # e.g., 500000 for $500K
    economic_nexus_applies_to_digital = Column(Boolean, nullable=False, default=True)
    economic_nexus_effective_date = Column(String, nullable=True)
    apportionment_method = Column(String, nullable=True)  # "single_sales_factor", "three_factor", etc.
    income_tax_rate = Column(String, nullable=True)  # e.g., "8.84%"
    filing_due_date = Column(String, nullable=True)

    # Economic nexus - sales tax
    has_sales_tax = Column(Boolean, nullable=False, default=True)
    sales_tax_economic_nexus_revenue = Column(Integer, nullable=True)  # e.g., 100000
    sales_tax_economic_nexus_transactions = Column(Integer, nullable=True)  # e.g., 200
    digital_advertising_taxable = Column(Boolean, nullable=False, default=False)
    digital_subscriptions_taxable = Column(Boolean, nullable=False, default=False)
    sales_tax_effective_date = Column(String, nullable=True)

    # Franchise/gross receipts tax details
    franchise_tax_threshold = Column(Integer, nullable=True)
    franchise_tax_rate = Column(String, nullable=True)
    gross_receipts_threshold = Column(Integer, nullable=True)
    gross_receipts_rate = Column(String, nullable=True)

    notes = Column(Text, nullable=True)
    minimum_days_for_nexus = Column(String, nullable=True)
