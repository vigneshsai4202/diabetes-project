from fastapi_users.authentication import JWTStrategy, AuthenticationBackend
from fastapi_users import FastAPIUsers
from fastapi_users.db import BeanieUserDatabase
from app.models.user import User, UserCreate, UserRead, UserUpdate

SECRET = "SUPERSECRET"

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=None,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager=lambda: BeanieUserDatabase(User),
    auth_backends=[auth_backend],
    user_model=User,
    user_create_model=UserCreate,
    user_update_model=UserUpdate,
    user_db_model=User,
)
