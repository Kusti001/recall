import app.models  # noqa: F401
from app.db.base import Base
from app.db.engine import engine


async def create_tables():
    print(list(Base.metadata.tables.keys()))
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def reset_tables():
    """Only for dev"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
