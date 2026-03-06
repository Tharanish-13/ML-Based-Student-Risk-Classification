from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from auth import get_current_user
from email_service import send_email
import database
from datetime import datetime

router = APIRouter()

class EmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    content: str

@router.post("/email")
async def send_email_endpoint(request: EmailRequest, current_user: dict = Depends(get_current_user)):
    # Optional: Check if user has permission to send email (e.g., Staff/Admin only)
    # role = current_user.get("role")
    # if role not in ["staff", "admin"]:
    #     raise HTTPException(status_code=403, detail="Not authorized to send emails")
    
    success = send_email(request.to_email, request.subject, request.content)
    if success:
        # Create notification for the student
        notification = {
            "student_email": request.to_email,
            "message": f"{request.subject}: {request.content}",
            "type": "warning", # Default to warning for manual emails
            "created_at": datetime.utcnow(),
            "is_read": False
        }
        await database.notification_collection.insert_one(notification)
        return {"message": "Email sent and notification created"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    # Get notifications for the logged-in student
    notifications = []
    async for notif in database.notification_collection.find({"student_email": current_user["email"]}).sort("created_at", -1):
        notif["id"] = str(notif["_id"])
        del notif["_id"]
        notifications.append(notif)
    return notifications

@router.get("/all-notifications")
async def get_all_notifications(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    notifications = []
    # If staff, maybe only show notifications they sent? Implementation doesn't track sender right now, so show all.
    async for notif in database.notification_collection.find().sort("created_at", -1):
        notif["id"] = str(notif["_id"])
        del notif["_id"]
        notifications.append(notif)
    return notifications
