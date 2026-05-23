from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

# Import after loading env
from app.database import engine, Base, SessionLocal
from app.models import User, Course, Lesson, Enrollment
from app.seed import seed_database
from app.routes import auth, courses, enrollments

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database
db = SessionLocal()
seed_database(db)
db.close()

# Create FastAPI app
app = FastAPI(
    title="Gisul Platform API",
    version="1.0.0",
    description="A modern course management platform"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(enrollments.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
