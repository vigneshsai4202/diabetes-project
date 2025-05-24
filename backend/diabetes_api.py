from fastapi import HTTPException
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
from io import StringIO
from typing import List
from fastapi import UploadFile, File
import numpy as np
import io


app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the diabetes model
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

@app.post("/predict")
def predict(input_data: DiabetesInput):
    features = np.array([[input_data.age, input_data.gender, input_data.hypertension,
                          input_data.heart_disease, input_data.smoking_history, input_data.bmi,
                          input_data.HbA1c_level, input_data.blood_glucose_level]])

    prediction = model.predict(features)[0]
    is_diabetic = prediction == 1

    # CVD Risk Estimation
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

    # Lifestyle Recommendations
    diet = []
    if is_diabetic:
        diet.extend([
            "Follow a low-carb, high-fiber diet.",
            "Eat vegetables, whole grains, and lean proteins.",
            "Avoid refined sugars and processed food."
        ])
    if cvd_risk >= 20:
        diet.extend([
            "Limit salt and saturated fat intake.",
            "Increase intake of omega-3 rich foods like flax seeds and fish."
        ])
    if not diet:
        diet.append("Maintain a balanced diet with fruits, veggies, and lean proteins.")

    exercise = []
    if input_data.bmi < 18.5:
        exercise.append("Include supervised strength training and calorie-dense healthy foods.")
    elif input_data.bmi < 25:
        exercise.append("Maintain moderate exercises like walking, cycling, or yoga.")
    else:
        exercise.append("Begin with low-impact exercises like swimming or walking.")

    habits = []
    if input_data.smoking_history in [1, 2, 3]:
        habits.extend([
            "Quit smoking. Use support groups or nicotine therapy.",
            "Avoid exposure to secondhand smoke."
        ])
    else:
        habits.append("Great job staying away from smoking. Keep it up!")

    return {
        "prediction": "Diabetic" if is_diabetic else "Not Diabetic",
        "cvd_risk_percent": f"{cvd_risk}%",
        "lifestyle_recommendations": {
            "diet": diet,
            "exercise": exercise,
            "habits": habits
        }
    }
class BulkRecord(BaseModel):
    age: float
    gender: int
    hypertension: int
    heart_disease: int
    smoking_history: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

FEATURE_COLUMNS = [ 'gender','age', 'hypertension', 'heart_disease',
                   'smoking_history', 'bmi', 'HbA1c_level', 'blood_glucose_level']
@app.post("/bulk-predict-csv")
async def bulk_predict_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read CSV: {e}")

    # Validate if required columns are present
    missing_cols = [col for col in FEATURE_COLUMNS if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400,
                            detail=f"Missing required columns: {missing_cols}")

    # Encode categorical columns
    if 'gender' in df.columns:
        df['gender'] = df['gender'].map({'Male': 0, 'Female': 1})
    
    if 'smoking_history' in df.columns:
        df['smoking_history'] = df['smoking_history'].map({
            'never': 0, 'former': 1, 'current': 2, 'ever': 3, 'not current': 4, 'No Info': 5
        })

    # Select and order the features columns exactly
    features_df = df[FEATURE_COLUMNS]

    # Predict using the model
    predictions = model.predict(features_df)

    # Append predictions as new column
    df['prediction'] = ["Diabetic" if p == 1 else "Not Diabetic" for p in predictions]

    return df.to_dict(orient='records')