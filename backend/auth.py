from fastapi_users import FastAPIUsers, UUIDID
from fastapi_users.authentication import AuthenticationBackend, JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from .models import User
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_users.manager import UserManager

SECRET = "SECRET_KEY_CHANGE_ME"

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=... ,  # CookieTransport or BearerTransport
    get_strategy=get_jwt_strategy,
)

async def get_user_db(session: AsyncSession):
    yield SQLAlchemyUserDatabase(session, User)

class UserManager(UserManager[User, uuid.UUID]):
    user_db_model = User

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager=UserManager,
    auth_backends=[auth_backend],
)

current_user = fastapi_users.current_user()
