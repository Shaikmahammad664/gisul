# Gisul — Course Management Platform

A modern, full-stack course management platform where admins create and manage courses, and students can enroll, track progress, and complete lessons.

**Live Demo**: Coming soon (Deploy to Vercel + Railway)

---

## 🎯 Features

### Core Features
- ✅ **Authentication** — Secure register & login for Admin and Student roles with JWT tokens
- ✅ **Course Management (Admin)** — Create, edit, and delete courses with rich metadata
- ✅ **Course Catalog (Student)** — Browse, search, and filter courses by category
- ✅ **Enrollment** — One-click course enrollment with instant access
- ✅ **Student Dashboard** — Track enrolled courses and learning progress
- ✅ **Admin Dashboard** — Manage all courses and view enrollment stats

### Bonus Features
- 📊 **Progress Tracking** — Visual progress bars per course
- 🔍 **Search & Filter** — Server-side search and category filtering
- 🎨 **Dark Theme** — Modern dark UI with CSS variables
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Axios |
| **Backend** | Python FastAPI, SQLAlchemy ORM |
| **Database** | SQLite (development) / PostgreSQL (production) |
| **Auth** | JWT tokens + bcrypt hashing |
| **Styling** | Custom CSS with CSS Variables |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |

---

## 📦 Project Structure

```
gisul-platform/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Auth context
│   │   ├── utils/              # API client, helpers
│   │   ├── App.js             # Main app component
│   │   └── App.css            # Global styles
│   ├── package.json
│   ├── vercel.json            # Vercel configuration
│   └── .env.production        # Production env vars
│
├── backend-fastapi/            # Python FastAPI backend
│   ├── app/
│   │   ├── routes/            # API route handlers
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # Database config
│   │   ├── auth.py            # JWT & password handling
│   │   ├── seed.py            # Demo data seeding
│   │   └── __init__.py
│   ├── main.py                # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── Dockerfile                  # Docker image for backend
├── railway.json               # Railway deployment config
├── render.yaml                # Render deployment config
├── DEPLOYMENT.md              # Detailed deployment guide
└── README.md                  # This file
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+

### 1. Clone & Setup Backend

```bash
cd backend-fastapi
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on **http://localhost:5000**

### 2. Setup Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

### 3. Login with Demo Credentials

**Admin**:
- Email: `admin@gisul.com`
- Password: `admin123`

**Student**:
- Email: `student@gisul.com`
- Password: `student123`

---

## 🌐 API Documentation

Once backend is running, visit: **http://localhost:5000/docs**

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user |
| `/api/courses` | GET | List all courses |
| `/api/courses` | POST | Create course (admin only) |
| `/api/courses/{id}` | GET | Get course details |
| `/api/courses/{id}` | PUT | Update course (admin only) |
| `/api/courses/{id}` | DELETE | Delete course (admin only) |
| `/api/enrollments/my` | GET | Get student's enrolled courses |
| `/api/enrollments` | POST | Enroll in course |
| `/api/enrollments/{id}` | DELETE | Unenroll from course |

---

## 🌍 Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository → Select `frontend` directory
4. Set `REACT_APP_API_URL` environment variable
5. Deploy!

### Backend (Railway or Render)

**Railway** (Recommended):
- Go to [railway.app](https://railway.app)
- New Project → Deploy from GitHub
- Set environment variables
- Auto-deploys on git push

**Render**:
- Go to [render.com](https://render.com)
- New Web Service → Connect GitHub
- Configure environment variables
- Deploy!

### ⚙️ Environment Variables

**Frontend** (`.env.production`):
```
REACT_APP_API_URL=https://gisul-api.railway.app
```

**Backend**:
```
SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db  # or PostgreSQL
SECRET_KEY=your-secure-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
PORT=5000
```

For complete deployment guide, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📝 Environment Setup

### Local Development

Create `.env` files:

**backend-fastapi/.env**:
```
SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
PORT=5000
```

**frontend/.env.local**:
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🔐 Security Features

- ✅ JWT-based authentication with secure token handling
- ✅ Bcrypt password hashing (never storing plain passwords)
- ✅ CORS middleware for cross-origin requests
- ✅ Role-based access control (Admin vs Student)
- ✅ Protected routes and endpoints
- ✅ Secure session management

---

## 🧪 Testing

### Test Admin Features
1. Login as admin@gisul.com
2. Go to Admin Dashboard
3. Create/Edit/Delete courses

### Test Student Features
1. Login as student@gisul.com
2. Browse catalog
3. Enroll in courses
4. View My Learning dashboard

---

## 📚 Database Schema

### Users
```sql
users(id, name, email, password, role, created_at)
```

### Courses
```sql
courses(id, title, description, category, thumbnail, instructor_id, created_at, updated_at)
```

### Lessons
```sql
lessons(id, course_id, title, content, order_idx, created_at)
```

### Enrollments
```sql
enrollments(id, student_id, course_id, created_at)
```

---

## 🐛 Troubleshooting

### CORS Errors
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify backend is running and accessible

### 405 Method Not Allowed
- Ensure all API routes are defined
- Check HTTP method (GET/POST/PUT/DELETE)

### Database Errors
- Delete `gisul.db` and restart backend to reseed
- Check database file permissions

### Login Issues
- Clear browser cookies and cache
- Try demo credentials: `admin@gisul.com` / `admin123`

---

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Production deployment steps
- [API Docs](http://localhost:5000/docs) - Interactive Swagger UI
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Router Docs](https://reactrouter.com)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 Future Enhancements

- [ ] Real-time notifications
- [ ] Video lesson support
- [ ] Quiz and assessments
- [ ] Certificate generation
- [ ] Social features (comments, discussions)
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Two-factor authentication

---

## 📞 Support

For issues, questions, or suggestions:
- Open an GitHub Issue
- Check existing documentation
- Review [Deployment Guide](DEPLOYMENT.md)

---

**Made with ❤️ by the Gisul Team**
