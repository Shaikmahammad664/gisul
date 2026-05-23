from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Enrollment, Course, Lesson
from app.schemas import EnrollmentCreate, EnrollmentResponse
from app.auth import get_current_user

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

@router.get("/my", response_model=dict)
def get_my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all enrolled courses for the current student"""
    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id
    ).all()
    
    courses = []
    for enrollment in enrollments:
        course = enrollment.course
        lessons = db.query(Lesson).filter(Lesson.course_id == course.id).all()
        courses.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "category": course.category,
            "thumbnail": course.thumbnail,
            "instructor_id": course.instructor_id,
            "instructor_name": course.instructor.name if course.instructor else "Unknown",
            "lesson_count": len(lessons),
            "completed_count": 0,  # TODO: Implement lesson completion tracking
            "created_at": course.created_at,
            "updated_at": course.updated_at
        })
    
    return {"courses": courses}

@router.get("/", response_model=dict)
def get_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id
    ).all()
    
    return {
        "enrollments": [EnrollmentResponse.model_validate(e) for e in enrollments]
    }

@router.post("/", response_model=dict)
def enroll_in_course(
    enrollment_data: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can enroll")
    
    course = db.query(Course).filter(Course.id == enrollment_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == enrollment_data.course_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=409, detail="Already enrolled in this course")
    
    db_enrollment = Enrollment(
        student_id=current_user.id,
        course_id=enrollment_data.course_id
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    
    return {"enrollment": EnrollmentResponse.model_validate(db_enrollment)}

@router.delete("/{enrollment_id}")
def unenroll(
    enrollment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    if enrollment.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(enrollment)
    db.commit()
    
    return {"message": "Unenrolled from course"}
