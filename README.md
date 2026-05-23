# Gisul — Course Management Platform

A fullstack course management platform where admins create and manage courses, and students can enroll, track progress, and complete lessons.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | SQLite via sql.js (file-based, zero config) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Custom CSS with CSS Variables (dark theme) |

---

## Features

### Core
- **Authentication** — Register & login for Admin and Student roles. JWT-based, protected routes redirect unauthenticated users.
- **Course Management (Admin)** — Create, edit, and delete courses with title, description, category, thumbnail URL, and lessons.
- **Course Catalog (Student)** — Browse all courses, view full course detail page with lesson list.
- **Enrollment** — Students enroll in courses with one click. Student dashboard shows all enrolled courses.

### Bonus
- **Progress Tracking** — Students mark lessons as complete/incomplete. Progress bar on dashboard per course.
- **Search & Filter** — Search by title and filter by category (server-side).

---

## Project Structure

```
gisul-platform/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── courses.js       # CRUD for courses, search/filter
│   │   └── enrollments.js   # Enroll, progress, lesson completions
│   ├── db.js                # SQLite database setup (sql.js)
│   ├── middleware.js        # JWT auth middleware
│   ├── seed.js              # Demo data seeder
│   ├── server.js            # Express app entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── CourseCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Catalog.js
│   │   │   ├── CourseDetail.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── CourseForm.js
│   │   ├── utils/
│   │   │   └── api.js       # Axios instance with interceptors
│   │   ├── App.js
│   │   └── App.css
│   └── .env.example
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js v16+ and npm

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gisul-platform.git
cd gisul-platform
```

### 2. Set up the Backend

```bash
cd backend
cp .env.example .env
# Edit .env if needed (default values work for local dev)
npm install
npm start
```

The backend runs on **http://localhost:5000**. The SQLite database is auto-created and seeded with demo data on first run.

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
cp .env.example .env
# Ensure REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

The frontend runs on **http://localhost:3000**.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `JWT_SECRET` | `gisul-jwt-secret-2024` | Secret for signing JWTs — **change in production** |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## Demo Credentials

The database is automatically seeded on first run with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@gisul.com | admin123 |
| **Student** | student@gisul.com | student123 |

Demo data includes **5 courses** across 5 categories (Technology, Data Science, Design, Business, Marketing), each with 4–5 lessons. The demo student is pre-enrolled in 2 courses.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | Public | List all courses (supports `?search=&category=`) |
| GET | `/api/courses/:id` | Public | Get course + lessons |
| POST | `/api/courses` | Admin | Create course |
| PUT | `/api/courses/:id` | Admin | Update course |
| DELETE | `/api/courses/:id` | Admin | Delete course |

### Enrollments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enrollments/my` | Student | Get enrolled courses with progress |
| POST | `/api/enrollments/:courseId` | Student | Enroll in course |
| GET | `/api/enrollments/:courseId/status` | Student | Check enrollment |
| GET | `/api/enrollments/:courseId/progress` | Student | Get completed lesson IDs |
| POST | `/api/enrollments/lessons/:lessonId/complete` | Student | Mark lesson done |
| DELETE | `/api/enrollments/lessons/:lessonId/complete` | Student | Unmark lesson |

---

## Deployment

### Backend (Render)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables: `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)

1. Create a new project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend/`
3. Add environment variable: `REACT_APP_API_URL` = your Render backend URL + `/api`
4. Deploy

---

## Known Limitations

- The SQLite database is file-based and stored on the server filesystem. On Render's free tier, the filesystem is ephemeral — the database resets on each redeploy. For persistent production use, switch to PostgreSQL (e.g. via Render's managed Postgres or Supabase).
- No image upload — course thumbnails are set via URL only.
- No email verification or password reset flow.
- Admin can see all courses; multi-instructor filtering is not implemented.
