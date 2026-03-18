import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
import os
import numpy as np

def generate_dummy_data(n_samples=1000):
    np.random.seed(42)
    data = []
    
    for _ in range(n_samples):
        attendance = np.random.randint(40, 100)
        marks = np.random.randint(30, 100)
        assignments = np.random.randint(0, 11)
        study_hours = np.random.randint(0, 11)
        
        # Simple logic for risk
        score = (attendance * 0.4) + (marks * 0.4) + (assignments * 10 * 0.1) + (study_hours * 10 * 0.1)
        
        if score > 80:
            risk = "Low"
        elif score > 50:
            risk = "Medium"
        else:
            risk = "High"
            
        data.append([attendance, marks, assignments, study_hours, risk])
        
    return pd.DataFrame(data, columns=['attendance', 'marks', 'assignments', 'study_hours', 'risk_level'])

def train_model():
    print("Generating dummy data...")
    df = generate_dummy_data()
    
    X = df[['attendance', 'marks', 'assignments', 'study_hours']]
    y = df['risk_level']
    
    print("Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    
    # Save model
    joblib.dump(model, 'model.pkl')
    print("Model saved to model.pkl")
    
    # Test prediction
    test_input = [[85, 90, 10, 8]] # Should be Low
    prediction = model.predict(test_input)
    print(f"Test Prediction for {test_input}: {prediction[0]}")

if __name__ == "__main__":
    train_model()
