from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"
    STUDENT = "student"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.STUDENT
    department: Optional[str] = None
    year: Optional[str] = None
    mobile_no: Optional[str] = None
    parent_mobile_no: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str

class UserInDB(BaseModel):
    name: str
    email: EmailStr
    hashed_password: str
    role: Role = Role.STUDENT
    department: Optional[str] = None
    year: Optional[str] = None
    mobile_no: Optional[str] = None
    parent_mobile_no: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class StudentBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    attendance: float = Field(..., ge=0, le=100)
    marks: float = Field(..., ge=0, le=100)
    assignments: int = Field(..., ge=0, le=10)
    study_hours: float = Field(..., ge=0)
    risk_level: Optional[str] = None
    
class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    attendance: Optional[float] = None
    marks: Optional[float] = None
    assignments: Optional[int] = None
    study_hours: Optional[float] = None
    risk_level: Optional[str] = None

class StudentResponse(StudentBase):
    id: str
    created_at: datetime
    created_by: str

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class PredictionInput(BaseModel):
    attendance: float
    marks: float
    assignments: int
    study_hours: float

class PredictionResponse(BaseModel):
    risk: str

class Notification(BaseModel):
    id: str
    student_email: EmailStr
    message: str
    type: str = "info" # info, warning, alert
    created_at: datetime
    is_read: bool = False

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
