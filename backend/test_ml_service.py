from ml_service import load_model, predict_risk
import os

def test_ml_service():
    print("Testing ml_service...")
    
    # Check if model exists
    if not os.path.exists("model.pkl"):
        print("Model file not found. Skipping test.")
        return

    # Load model
    load_model()
    
    # Test prediction
    risk = predict_risk(50, 50, 5, 2)
    print(f"Prediction result: {risk}")
    
    if risk in ["Low", "Moderate", "High"]:
        print("SUCCESS: Prediction returned a valid risk level.")
    else:
        print(f"FAILURE: Prediction returned unexpected value: {risk}")

if __name__ == "__main__":
    test_ml_service()
