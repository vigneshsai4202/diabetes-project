from beanie import Document
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HealthPrediction(Document):
    user_id: str
    age: float
    gender: int
    hypertension: int
    heart_disease: int
    smoking_history: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float
    prediction: str
    cvd_risk: int
    timestamp: datetime

    class Settings:
        name = "prediction_history"
