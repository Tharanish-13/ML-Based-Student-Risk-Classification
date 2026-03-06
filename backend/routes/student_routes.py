from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models import StudentResponse, StudentCreate, StudentUpdate
from database import student_collection
from auth import get_current_user
from bson import ObjectId
from datetime import datetime
import re

router = APIRouter()

def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "name": student["name"],
        "email": student.get("email"),
        "attendance": student["attendance"],
        "marks": student["marks"],
        "assignments": student["assignments"],
        "study_hours": student["study_hours"],
        "risk_level": student.get("risk_level", "Unknown"),
        "created_at": student.get("created_at"),
        "created_by": student.get("created_by", "Unknown")
    }

from ml_service import predict_risk

# ...

@router.post("/", response_model=StudentResponse)
async def create_student(student: StudentCreate, current_user: dict = Depends(get_current_user)):
    student_dict = student.dict()
    student_dict["created_at"] = datetime.utcnow()
    student_dict["created_by"] = current_user["email"]
    
    # Calculate risk automatically
    risk = predict_risk(
        student_dict["attendance"],
        student_dict["marks"],
        student_dict["assignments"],
        student_dict["study_hours"]
    )
    student_dict["risk_level"] = risk

    new_student = await student_collection.insert_one(student_dict)
    created_student = await student_collection.find_one({"_id": new_student.inserted_id})
    return student_helper(created_student)

@router.post("/batch", response_model=dict)
async def create_students_batch(students: List[StudentCreate], current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to batch upload")
    
    new_students = []
    for student in students:
        student_dict = student.dict()
        student_dict["created_at"] = datetime.utcnow()
        student_dict["created_by"] = current_user["email"]
        
        risk = predict_risk(
            student_dict["attendance"],
            student_dict["marks"],
            student_dict["assignments"],
            student_dict["study_hours"]
        )
        student_dict["risk_level"] = risk
        new_students.append(student_dict)
        
    if new_students:
        await student_collection.insert_many(new_students)
        
    return {"message": f"Successfully uploaded {len(new_students)} students"}

@router.get("/", response_model=List[StudentResponse])
async def get_students(
    search: Optional[str] = "",
    risk: Optional[str] = "",
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    # Staff isolation: Only show students created by this staff member
    if current_user["role"] == "staff":
        query["created_by"] = current_user["email"]
        
    if risk and risk != "All":
        query["risk_level"] = risk
        
    students = []
    async for student in student_collection.find(query):
        students.append(student_helper(student))
        
    # Sort by risk if requested (High -> Moderate -> Low -> Pending)
    if risk == "High-First":
        risk_priority = {"High": 0, "Moderate": 1, "Low": 2, "Pending": 3, "Unknown": 4}
        students.sort(key=lambda s: risk_priority.get(s["risk_level"], 5))
        
    return students

@router.get("/me", response_model=StudentResponse)
async def get_my_student_profile(current_user: dict = Depends(get_current_user)):
    # Find student record associated with the current user's email
    student = await student_collection.find_one({"email": current_user["email"]})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student_helper(student)

@router.get("/{id}", response_model=StudentResponse)
async def get_student(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    student = await student_collection.find_one({"_id": ObjectId(id)})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student_helper(student)

@router.put("/{id}", response_model=StudentResponse)
async def update_student(id: str, student_update: StudentUpdate, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    student_dict = {k: v for k, v in student_update.dict().items() if v is not None}
    
    if len(student_dict) >= 1:
        # Check if risk-affecting fields are present, if so, recalculate risk
        # We need the current values for fields that are NOT in the update
        # tailored to be simpler: if ANY risk factor changes, we should probably re-fetch the full
        # record or merge with existing to predict.
        
        # Strategy: Fetch existing first to merge values
        existing_student = await student_collection.find_one({"_id": ObjectId(id)})
        if not existing_student:
             raise HTTPException(status_code=404, detail="Student not found")
             
        # Merge existing with updates
        merged_student = {**existing_student, **student_dict}
        
        # Calculate new risk
        if any(k in student_dict for k in ["attendance", "marks", "assignments", "study_hours"]):
             new_risk = predict_risk(
                merged_student.get("attendance", 0),
                merged_student.get("marks", 0),
                merged_student.get("assignments", 0),
                merged_student.get("study_hours", 0)
             )
             student_dict["risk_level"] = new_risk

        update_result = await student_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": student_dict}
        )
        if update_result.modified_count == 1 or len(student_dict) > 0:
             # Fetch updated
            updated_student = await student_collection.find_one({"_id": ObjectId(id)})
            return student_helper(updated_student)
            
    existing_student = await student_collection.find_one({"_id": ObjectId(id)})
    if existing_student:
        return student_helper(existing_student)
    raise HTTPException(status_code=404, detail="Student not found")

@router.delete("/{id}")
async def delete_student(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    delete_result = await student_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Student deleted"}
    raise HTTPException(status_code=404, detail="Student not found")
