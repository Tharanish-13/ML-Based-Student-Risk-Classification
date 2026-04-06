from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, student_routes, predict_routes, action_routes, user_routes
from train_model import train_model
import os

app = FastAPI(title="ML Student Risk System")

# CORS
# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://ml-based-student-risk-classificatio.vercel.app",
    "https://mlbasedstudentriskclassificationsystem-6s03vg18w.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup: Train model if not exists
from ml_service import load_model

# ...

# Startup: Train model if not exists
@app.on_event("startup")
async def startup_event():
    if not os.path.exists("model.pkl"):
        print("Model not found. Training dummy model...")
        train_model()
    load_model()

# Routes
app.include_router(auth_routes.router, tags=["Authentication"])
app.include_router(student_routes.router, prefix="/students", tags=["Students"])
app.include_router(predict_routes.router, tags=["Prediction"])
app.include_router(action_routes.router, prefix="/actions", tags=["Actions"])
app.include_router(user_routes.router, prefix="/admin/users", tags=["Admin Users"])

@app.get("/")
async def root():
    return {"message": "Welcome to Student Risk Classification API"}
