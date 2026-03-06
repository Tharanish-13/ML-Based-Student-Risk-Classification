import joblib
import pandas as pd
import os

MODEL_PATH = "model.pkl"
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print("Model file not found! Please run train_model.py")

def predict_risk(attendance, marks, assignments, study_hours):
    global model
    if not model:
        load_model()
    
    if not model:
        return "Model Error"
        
    # Input order: attendance, marks, assignments, study_hours
    data = [[
        attendance,
        marks,
        assignments,
        study_hours
    ]]
    
    try:
        prediction = model.predict(data)
        return prediction[0]
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return "Error"
