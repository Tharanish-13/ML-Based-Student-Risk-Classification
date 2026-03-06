# ML-Based Student Risk Classification System

A full-stack web application to predict student academic risk using a Logistic Regression model.

## Features
- **Authentication**: JWT-based Login & Register.
- **Dashboard**: Overview of student risk statistics.
- **Student Management**: CRUD operations for student records.
- **Risk Prediction**: ML-based risk assessment (Low, Medium, High).
- **Technology Stack**:
  - **Frontend**: React, Vite, Tailwind CSS
  - **Backend**: FastAPI, MongoDB (Motor), scikit-learn
  - **Infrastructure**: Docker, Docker Compose

## Prerequisites
- Docker & Docker Compose
- Node.js (for local dev)
- Python 3.10+ (for local dev)

## Quick Start (Docker)

1. **Clone the repository**
2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
3. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Local Development Setup

### Backend
1. Navigate to `backend/`
2. Create virtual env: `python -m venv .venv`
3. Activate:
   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## ML Model
The system uses `model.pkl` to predict risk.
- A dummy model is automatically trained and saved by `train_model.py` on backend startup if not present.
- Inputs: Attendance, Marks, Assignments, Study Hours.

## Deployment
- **Frontend**: Ready for Vercel/Netlify deployment.
- **Backend**: Ready for Render/Railway deployment.
- **Docker**: Containerized for any cloud provider supporting Docker.
