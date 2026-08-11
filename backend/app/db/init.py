import app.models  # noqa: F401
from app.db.base import Base
from app.db.engine import engine


async def create_tables():
    """DEPRECATED for regular use — use alembic upgrade head."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def reset_tables():
    """DEV ONLY"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
