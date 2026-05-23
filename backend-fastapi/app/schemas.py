from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# Lesson Schemas
class LessonBase(BaseModel):
    title: str
    content: Optional[str] = None
    order_idx: int = 0

class LessonCreate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: str
    course_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Course Schemas
class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    thumbnail: Optional[str] = None

class CourseCreate(CourseBase):
    lessons: Optional[List[LessonCreate]] = None

class CourseUpdate(CourseBase):
    pass

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    thumbnail: Optional[str] = None
    instructor_id: str
    instructor_name: Optional[str] = None
    enrollment_count: int = 0
    lesson_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CourseDetailResponse(CourseResponse):
    lessons: Optional[List[LessonResponse]] = None

# Enrollment Schemas
class EnrollmentCreate(BaseModel):
    course_id: str

class EnrollmentResponse(BaseModel):
    id: str
    student_id: str
    course_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
