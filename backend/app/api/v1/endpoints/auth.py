from app.core.auth_backend import auth_backend
from app.core.fastapi_users import fastapi_users
from app.schemas import UserCreate, UserRead, UserUpdate
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["v1 / auth"])

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
)

router.include_router(fastapi_users.get_register_router(UserRead, UserCreate))

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
