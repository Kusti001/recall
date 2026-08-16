import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health(test_client: AsyncClient):

    response = await test_client.get("/")
    assert response.status_code == 200
