import json
from pathlib import Path

from app.database import SessionLocal
from app.models.state_nexus_rule import StateNexusRule

RULES_FILE = Path(__file__).resolve().parent / "data" / "state_nexus_rules.json"


def seed_nexus_rules():
    """Load state nexus rules from JSON into DB if table is empty."""
    db = SessionLocal()
    try:
        count = db.query(StateNexusRule).count()
        if count > 0:
            return

        with open(RULES_FILE, "r") as f:
            data = json.load(f)

        for rule_data in data["rules"]:
            rule = StateNexusRule(**rule_data)
            db.add(rule)

        db.commit()
        print(f"Seeded {len(data['rules'])} state nexus rules.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding nexus rules: {e}")
        raise
    finally:
        db.close()
