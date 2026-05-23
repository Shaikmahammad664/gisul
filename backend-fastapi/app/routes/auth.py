from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, TokenResponse, LoginRequest
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    if user_create.role not in ["admin", "student"]:
        raise HTTPException(status_code=400, detail="Role must be admin or student")
    
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    hashed_password = hash_password(user_create.password)
    db_user = User(
        name=user_create.name,
        email=user_create.email,
        password=hashed_password,
        role=user_create.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    token = create_access_token({"sub": db_user.id})
    return {
        "token": token,
        "user": UserResponse.model_validate(db_user)
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.id})
    return {
        "token": token,
        "user": UserResponse.model_validate(user)
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
