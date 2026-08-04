from app.core.fastapi_users import fastapi_users

get_current_user = fastapi_users.current_user(active=True)

get_current_user_optional = fastapi_users.current_user(optional=True)

get_current_superuser = fastapi_users.current_user(active=True, superuser=True)
