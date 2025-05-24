from fastapi import APIRouter, Depends
from backend.models.user import User
from backend.auth.base_config import current_user
from pydantic import BaseModel
import numpy as np
import pickle
from backend.models.history import HealthPrediction
from datetime import datetime

router = APIRouter()

# Load model once at startup
with open("diabetes_model.pkl", "rb") as f:
    model = pickle.load(f)

class DiabetesInput(BaseModel):
    age: float
    gender: int
    hypertension: int
    heart_disease: int
    smoking_history: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

@router.post("/predict")
async def predict(input_data: DiabetesInput, user: User = Depends(current_user)):
    features = np.array([[input_data.age, input_data.gender, input_data.hypertension,
                          input_data.heart_disease, input_data.smoking_history,
                          input_data.bmi, input_data.HbA1c_level, input_data.blood_glucose_level]])
    
    prediction = model.predict(features)[0]
    is_diabetic = prediction == 1

    # Risk logic
    cvd_risk = 5
    if input_data.age > 50:
        cvd_risk += 10
    if input_data.hypertension == 1:
        cvd_risk += 15
    if input_data.heart_disease == 1:
        cvd_risk += 15
    if input_data.HbA1c_level > 6.5:
        cvd_risk += 10
    if input_data.smoking_history in [1, 2, 3]:
        cvd_risk += 10
    cvd_risk = min(cvd_risk, 100)

    # Save to MongoDB
    record = HealthPrediction(
        user_id=user.id,
        age=input_data.age,
        gender=input_data.gender,
        hypertension=input_data.hypertension,
        heart_disease=input_data.heart_disease,
        smoking_history=input_data.smoking_history,
        bmi=input_data.bmi,
        HbA1c_level=input_data.HbA1c_level,
        blood_glucose_level=input_data.blood_glucose_level,
        prediction="Diabetic" if is_diabetic else "Not Diabetic",
        cvd_risk=cvd_risk,
        timestamp=datetime.utcnow()
    )
    await record.create()

    return {
        "prediction": "Diabetic" if is_diabetic else "Not Diabetic",
        "cvd_risk_percent": f"{cvd_risk}%",
    }
