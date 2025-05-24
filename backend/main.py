from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth.base_config import auth_backend, fastapi_users
from backend.models.user import User
from backend.routes.predict_routes import router as predict_router

app = FastAPI()

origins = ["http://localhost:3000"]  # Adjust to your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes
app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_register_router(User, requires_verification=False), prefix="/auth", tags=["auth"])

# Prediction route
app.include_router(predict_router)
