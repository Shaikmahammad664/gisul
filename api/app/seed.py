from sqlalchemy.orm import Session
from app.models import User, Course, Lesson
from app.auth import hash_password
import uuid

SEED_DATA = {
    "users": [
        {
            "name": "Admin User",
            "email": "admin@gisul.com",
            "password": "admin123",
            "role": "admin"
        },
        {
            "name": "Jane Student",
            "email": "student@gisul.com",
            "password": "student123",
            "role": "student"
        }
    ],
    "courses": [
        {
            "title": "Introduction to Web Development",
            "description": "Learn the fundamentals of HTML, CSS, and JavaScript. Build your first website from scratch with hands-on projects and real-world examples.",
            "category": "Technology",
            "thumbnail": "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600",
            "lessons": [
                {"title": "Setting Up Your Environment", "content": "Install VS Code, Node.js, and essential browser dev tools."},
                {"title": "HTML Basics", "content": "Learn the structure of web pages with HTML tags, attributes, and semantic markup."},
                {"title": "CSS Fundamentals", "content": "Style your pages with CSS — selectors, properties, the box model."},
                {"title": "JavaScript Introduction", "content": "Learn variables, functions, DOM manipulation, and event handling."},
                {"title": "Your First Project", "content": "Build and deploy a complete personal portfolio website."},
            ]
        },
        {
            "title": "Data Science with Python",
            "description": "Master data analysis, visualization, and machine learning with Python.",
            "category": "Data Science",
            "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
            "lessons": [
                {"title": "Python for Data Analysis", "content": "NumPy arrays, pandas DataFrames — the backbone of data science."},
                {"title": "Data Visualization", "content": "Create compelling charts with Matplotlib and Seaborn."},
                {"title": "Statistical Foundations", "content": "Probability distributions, hypothesis testing, and statistical inference."},
                {"title": "Machine Learning Basics", "content": "Train and evaluate models with scikit-learn."},
            ]
        },
        {
            "title": "UX/UI Design Principles",
            "description": "Design beautiful and intuitive user interfaces.",
            "category": "Design",
            "thumbnail": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
            "lessons": [
                {"title": "Design Thinking", "content": "Empathize, define, ideate, prototype, and test."},
                {"title": "Figma Fundamentals", "content": "Frames, components, auto-layout, and prototyping in Figma."},
            ]
        }
    ]
}

def seed_database(db: Session):
    # Check if already seeded
    existing_admin = db.query(User).filter(User.email == "admin@gisul.com").first()
    if existing_admin:
        print("Database already seeded")
        return
    
    print("Seeding database...")
    
    # Create users
    admin_user = None
    student_user = None
    
    for user_data in SEED_DATA["users"]:
        user = User(
            id=str(uuid.uuid4()),
            name=user_data["name"],
            email=user_data["email"],
            password=hash_password(user_data["password"]),
            role=user_data["role"]
        )
        db.add(user)
        db.flush()
        
        if user.role == "admin":
            admin_user = user
        elif user.role == "student":
            student_user = user
    
    # Create courses and lessons
    for course_data in SEED_DATA["courses"]:
        course = Course(
            id=str(uuid.uuid4()),
            title=course_data["title"],
            description=course_data["description"],
            category=course_data["category"],
            thumbnail=course_data["thumbnail"],
            instructor_id=admin_user.id
        )
        db.add(course)
        db.flush()
        
        for idx, lesson_data in enumerate(course_data["lessons"]):
            lesson = Lesson(
                id=str(uuid.uuid4()),
                course_id=course.id,
                title=lesson_data["title"],
                content=lesson_data["content"],
                order_idx=idx
            )
            db.add(lesson)
    
    db.commit()
    
    print("✅ Seed complete:")
    print("  admin@gisul.com / admin123")
    print("  student@gisul.com / student123")
