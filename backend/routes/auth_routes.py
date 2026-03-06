from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
from models import UserCreate, UserLogin, Token, UserInDB
from database import user_collection
from auth import get_password_hash, verify_password, create_access_token
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "role": user.role,
        "department": user.department,
        "year": user.year,
        "created_at": datetime.utcnow()
    }
    
    result = await user_collection.insert_one(new_user)
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "name": user.name}

from datetime import datetime

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if db_user.get("banned", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been banned. Please contact the administrator."
        )
    
    role = db_user.get("role", "student")
    access_token = create_access_token(data={"sub": user.email, "role": role})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": role, 
        "name": db_user["name"],
        "department": db_user.get("department"),
        "year": db_user.get("year")
    }

from auth import get_current_user
class UserUpdate(BaseModel):
    department: Optional[str] = None
    year: Optional[str] = None

@router.get("/users/me", response_model=dict)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "department": current_user.get("department"),
        "year": current_user.get("year")
    }

@router.put("/users/me")
async def update_user_me(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        await user_collection.update_one(
            {"email": current_user["email"]},
            {"$set": update_data}
        )
        
    # Return updated user details
    updated_user = await user_collection.find_one({"email": current_user["email"]})
    return {
        "message": "Profile updated successfully",
        "user": {
            "name": updated_user["name"],
            "email": updated_user["email"],
            "role": updated_user["role"],
            "department": updated_user.get("department"),
            "year": updated_user.get("year")
        }
    }
