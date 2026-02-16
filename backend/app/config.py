from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: Optional[str] = None
    database_path: str = str(Path(__file__).resolve().parent.parent / "nexus_01.db")
    debug: bool = True
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = {"env_file": ".env"}


settings = Settings()
