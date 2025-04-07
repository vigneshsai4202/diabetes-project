from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


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


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # this is key to fix the 405
    allow_headers=["*"],
)



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
