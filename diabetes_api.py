from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

# Load the trained model
with open("diabetes_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI(title="Diabetes Prediction API")

# Define the input data schema
class DiabetesInput(BaseModel):
    age: float
    gender: int           # 0 or 1 (from LabelEncoder)
    hypertension: int     # 0 or 1
    heart_disease: int    # 0 or 1
    smoking_history: int  # Encoded value
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Diabetes Prediction API!"}

@app.post("/predict")
def predict_diabetes(data: DiabetesInput):
    input_array = np.array([[data.age, data.gender, data.hypertension, data.heart_disease,
                             data.smoking_history, data.bmi, data.HbA1c_level, data.blood_glucose_level]])
    prediction = model.predict(input_array)[0]
    result = "Diabetic" if prediction == 1 else "Not Diabetic"
    return {"prediction": result}
