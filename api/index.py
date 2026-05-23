"""
Gisul Platform API - Vercel Serverless Backend
Main entry point for FastAPI application
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Import all components
from app.database import engine, Base, SessionLocal
from app.models import User, Course, Lesson, Enrollment
from app.seed import seed_database
from app.routes import auth, courses, enrollments

# Create all tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
try:
    db = SessionLocal()
    seed_database(db)
    db.close()
except Exception as e:
    print(f"Seed warning (ok if already seeded): {e}")

# Initialize FastAPI app
app = FastAPI(
    title="Gisul Platform API",
    version="1.0.0",
    description="A modern fullstack course management platform",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development/deployment flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route routers
app.include_router(auth.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(enrollments.router, prefix="/api")

# Health check endpoint
@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "gisul-api"}

# For Vercel serverless compatibility
try:
    # If running on Vercel, use the app directly
    pass
except:
    pass

