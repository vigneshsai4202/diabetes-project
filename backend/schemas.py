from pydantic import BaseModel
from datetime import datetime

class PredictionOut(BaseModel):
    id: int
    gender: str
    age: int
    hypertension: int
    heart_disease: int
    smoking_history: str
    bmi: float
    hba1c_level: float
    blood_glucose_level: float
    cvd_risk: float
    prediction: str
    created_at: datetime

    class Config:
        orm_mode = True
