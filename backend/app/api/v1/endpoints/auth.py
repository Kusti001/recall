from app.core.auth_backend import auth_backend
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.core.fastapi_users import fastapi_users
from app.core.oauth2 import google_oauth_client
from app.models.user import User
from app.schemas import UserCreate, UserRead
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/auth", tags=["v1 / auth"])

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
)

router.include_router(
    fastapi_users.get_oauth_router(
        google_oauth_client,
        auth_backend,
        settings.GOOGLE_CLIENT_SECRET,
        redirect_url=settings.GOOGLE_REDIRECT_URI,
        associate_by_email=True,
        csrf_token_cookie_secure=False,
    ),
    prefix="/google",
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
)


@router.get("/me")
async def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user
