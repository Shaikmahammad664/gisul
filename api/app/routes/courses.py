from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.database import get_db
from app.models import User, Course, Lesson, Enrollment
from app.schemas import CourseCreate, CourseUpdate, CourseResponse, CourseDetailResponse, LessonResponse
from app.auth import get_current_user, admin_only

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=dict)
def get_courses(
    search: str = Query(None),
    category: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(
        Course.id,
        Course.title,
        Course.description,
        Course.category,
        Course.thumbnail,
        Course.instructor_id,
        Course.created_at,
        Course.updated_at,
        User.name.label("instructor_name"),
        func.count(Enrollment.id).label("enrollment_count"),
        func.count(Lesson.id).label("lesson_count")
    ).outerjoin(User, Course.instructor_id == User.id)\
     .outerjoin(Enrollment, Course.id == Enrollment.course_id)\
     .outerjoin(Lesson, Course.id == Lesson.course_id)\
     .group_by(Course.id)
    
    if search:
        query = query.filter(or_(
            Course.title.ilike(f"%{search}%"),
            Course.description.ilike(f"%{search}%")
        ))
    
    if category and category != "all":
        query = query.filter(Course.category == category)
    
    query = query.order_by(Course.created_at.desc())
    
    results = query.all()
    
    courses = [
        CourseResponse(
            id=r.id,
            title=r.title,
            description=r.description,
            category=r.category,
            thumbnail=r.thumbnail,
            instructor_id=r.instructor_id,
            instructor_name=r.instructor_name,
            enrollment_count=r.enrollment_count,
            lesson_count=r.lesson_count,
            created_at=r.created_at,
            updated_at=r.updated_at
        ) for r in results
    ]
    
    return {"courses": courses}

@router.get("/{course_id}", response_model=dict)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(
        Course.id,
        Course.title,
        Course.description,
        Course.category,
        Course.thumbnail,
        Course.instructor_id,
        Course.created_at,
        Course.updated_at,
        User.name.label("instructor_name"),
        func.count(Enrollment.id).label("enrollment_count")
    ).outerjoin(User, Course.instructor_id == User.id)\
     .outerjoin(Enrollment, Course.id == Enrollment.course_id)\
     .filter(Course.id == course_id)\
     .group_by(Course.id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_idx).all()
    
    return {
        "course": CourseDetailResponse(
            id=course.id,
            title=course.title,
            description=course.description,
            category=course.category,
            thumbnail=course.thumbnail,
            instructor_id=course.instructor_id,
            instructor_name=course.instructor_name,
            enrollment_count=course.enrollment_count,
            lesson_count=len(lessons),
            created_at=course.created_at,
            updated_at=course.updated_at,
            lessons=[LessonResponse.model_validate(l) for l in lessons]
        )
    }

@router.post("/", response_model=dict)
def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(admin_only),
    db: Session = Depends(get_db)
):
    db_course = Course(
        title=course_data.title,
        description=course_data.description,
        category=course_data.category,
        thumbnail=course_data.thumbnail,
        instructor_id=current_user.id
    )
    db.add(db_course)
    db.flush()
    
    if course_data.lessons:
        for idx, lesson_data in enumerate(course_data.lessons):
            db_lesson = Lesson(
                course_id=db_course.id,
                title=lesson_data.title,
                content=lesson_data.content,
                order_idx=idx
            )
            db.add(db_lesson)
    
    db.commit()
    db.refresh(db_course)
    
    return {
        "course": CourseResponse(
            id=db_course.id,
            title=db_course.title,
            description=db_course.description,
            category=db_course.category,
            thumbnail=db_course.thumbnail,
            instructor_id=db_course.instructor_id,
            instructor_name=current_user.name,
            enrollment_count=0,
            lesson_count=len(course_data.lessons or []),
            created_at=db_course.created_at,
            updated_at=db_course.updated_at
        )
    }

@router.put("/{course_id}", response_model=dict)
def update_course(
    course_id: str,
    course_data: CourseUpdate,
    current_user: User = Depends(admin_only),
    db: Session = Depends(get_db)
):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if db_course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if course_data.title:
        db_course.title = course_data.title
    if course_data.description:
        db_course.description = course_data.description
    if course_data.category:
        db_course.category = course_data.category
    if course_data.thumbnail is not None:
        db_course.thumbnail = course_data.thumbnail
    
    db.commit()
    db.refresh(db_course)
    
    return {"course": CourseResponse.model_validate(db_course)}

@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    current_user: User = Depends(admin_only),
    db: Session = Depends(get_db)
):
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if db_course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(db_course)
    db.commit()
    
    return {"message": "Course deleted"}
