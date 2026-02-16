from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.models import *  # noqa: F401, F403 — ensure all models are registered
from app.routers import (
    analysis,
    contractors,
    employees,
    entities,
    locations,
    nexus_rules,
    officers,
    registered_agents,
    revenues,
    traffic_data,
)
from app.seed import seed_nexus_rules


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_nexus_rules()
    yield


app = FastAPI(
    title="Nexus Determination Tool",
    description="US state tax nexus analysis for digital media companies",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entities.router, prefix="/api/entities", tags=["Entities"])
app.include_router(employees.router, prefix="/api/entities", tags=["Employees"])
app.include_router(contractors.router, prefix="/api/entities", tags=["Contractors"])
app.include_router(officers.router, prefix="/api/entities", tags=["Officers"])
app.include_router(locations.router, prefix="/api/entities", tags=["Locations"])
app.include_router(registered_agents.router, prefix="/api/entities", tags=["Registered Agents"])
app.include_router(revenues.router, prefix="/api/entities", tags=["Revenues"])
app.include_router(traffic_data.router, prefix="/api/entities", tags=["Traffic Data"])
app.include_router(nexus_rules.router, prefix="/api/nexus-rules", tags=["Nexus Rules"])
app.include_router(analysis.router, prefix="/api/entities", tags=["Nexus Analysis"])
