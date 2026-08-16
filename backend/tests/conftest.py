import pytest
import pytest_asyncio
from alembic import command
from alembic.config import Config
from app.core.config import settings
from app.main import app
from httpx import ASGITransport, AsyncClient


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    assert settings.MODE == "TEST"

    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

    yield

    command.downgrade(alembic_cfg, "base")


@pytest_asyncio.fixture
async def test_client():
    """Асинхронный клиент для тестирования роутов FastAPI."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client
