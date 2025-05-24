from fastapi_users.db import BeanieBaseUser, BeanieUserDatabase
from fastapi_users import schemas
from beanie import Document

class User(BeanieBaseUser, Document):
    pass

class UserCreate(schemas.BaseUserCreate):
    pass

class UserRead(schemas.BaseUser):
    pass

class UserUpdate(schemas.BaseUserUpdate):
    pass
