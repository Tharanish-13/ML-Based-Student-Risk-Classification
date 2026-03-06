from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from database import user_collection
from auth import get_current_user
from bson import ObjectId
from models import Role
import database

router = APIRouter()

class UserAdminResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: Optional[str] = None
    year: Optional[str] = None
    banned: bool = False

class UserAdminUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    banned: Optional[bool] = None

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "student"),
        "department": user.get("department"),
        "year": user.get("year"),
        "banned": user.get("banned", False)
    }

@router.get("/", response_model=List[UserAdminResponse])
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users = []
    async for user in user_collection.find():
        users.append(user_helper(user))
    return users

@router.put("/{id}", response_model=UserAdminResponse)
async def update_user(id: str, user_update: UserAdminUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        await user_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        
    updated_user = await user_collection.find_one({"_id": ObjectId(id)})
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user_helper(updated_user)

@router.get("/dashboard-stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get user role distribution
    user_pipeline = [
        {"$group": {"_id": {"$ifNull": ["$role", "student"]}, "count": {"$sum": 1}}}
    ]
    user_counts = {}
    async for doc in user_collection.aggregate(user_pipeline):
        user_counts[doc["_id"]] = doc["count"]
        
    # Get student risk distribution
    student_pipeline = [
        {"$group": {"_id": {"$ifNull": ["$risk_level", "Unknown"]}, "count": {"$sum": 1}}}
    ]
    risk_counts = {}
    async for doc in database.student_collection.aggregate(student_pipeline):
        risk_counts[doc["_id"]] = doc["count"]
        
    # Example format: 
    # { "roles": [{"name": "admin", "value": 2}, ...], "risk": [{"name": "High", "value": 5}, ...] }
    
    roles_data = [{"name": capitalize_first(k), "value": v} for k, v in user_counts.items()]
    risk_data = [{"name": capitalize_first(k), "value": v} for k, v in risk_counts.items()]
    
    # Calculate some quick summary scalar values
    total_users = sum(user_counts.values())
    total_students = sum(risk_counts.values())
    
    return {
        "summary": {
            "total_users": total_users,
            "total_students": total_students,
        },
        "charts": {
            "roles_distribution": roles_data,
            "risk_distribution": risk_data
        }
    }

def capitalize_first(s: str) -> str:
    if not s:
        return "Unknown"
    return s.capitalize()

@router.delete("/{id}")
async def delete_user(id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    # Prevent admin from deleting themselves
    user_to_delete = await user_collection.find_one({"_id": ObjectId(id)})
    if user_to_delete and user_to_delete.get("email") == current_user.get("email"):
         raise HTTPException(status_code=400, detail="Cannot delete your own admin account")

    delete_result = await user_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")
