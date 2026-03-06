from fastapi import APIRouter, HTTPException, Depends
from models import PredictionInput, PredictionResponse
from auth import get_current_user
from ml_service import predict_risk

router = APIRouter()

@router.post("/predict-risk", response_model=PredictionResponse)
async def predict_risk_endpoint(input_data: PredictionInput, current_user: dict = Depends(get_current_user)):
    risk = predict_risk(
        input_data.attendance,
        input_data.marks,
        input_data.assignments,
        input_data.study_hours
    )
    
    if risk == "Model Error" or risk == "Error":
         raise HTTPException(status_code=500, detail="Prediction error")
         
    return {"risk": risk}
