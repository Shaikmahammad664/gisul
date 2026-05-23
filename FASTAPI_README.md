# Gisul Platform - FastAPI + React Edition

A modern course management platform with a Python FastAPI backend and React frontend.

## Project Structure

```
gisul-platform/
├── backend-fastapi/        # Python FastAPI backend
│   ├── app/
│   │   ├── routes/        # API route handlers
│   │   ├── models.py      # SQLAlchemy database models
│   │   ├── schemas.py     # Pydantic request/response schemas
│   │   ├── database.py    # Database configuration
│   │   ├── auth.py        # Authentication & authorization
│   │   ├── seed.py        # Database seeding
│   │   └── __init__.py
│   ├── main.py            # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── .env.example       # Example environment file
│
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (auth)
│   │   ├── utils/        # API client, helpers
│   │   └── App.js        # Main app component
│   ├── public/           # Static assets
│   └── package.json      # Node dependencies
│
└── README.md
```

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Python-Jose** - JWT token handling
- **Passlib + Bcrypt** - Password hashing

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-fastapi
```

2. Create a Python virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

6. Run the FastAPI server:
```bash
python main.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (if needed):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Running the Full Application

### Option 1: Run Both Servers Separately

**Terminal 1 (Backend):**
```bash
cd backend-fastapi
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### Option 2: Using npm scripts from root

```bash
# Install all dependencies
npm run install:all

# Start both servers (requires proper setup)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Courses
- `GET /api/courses` - Get all courses (with search & filter)
- `GET /api/courses/{id}` - Get course details with lessons
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/{id}` - Update course (admin only)
- `DELETE /api/courses/{id}` - Delete course (admin only)

### Enrollments
- `GET /api/enrollments` - Get student's enrollments
- `POST /api/enrollments` - Enroll in course
- `DELETE /api/enrollments/{id}` - Unenroll from course

### Health Check
- `GET /api/health` - Server health check

## Default Credentials

After seeding, the following test accounts are available:

**Admin Account:**
- Email: `admin@gisul.com`
- Password: `admin123`

**Student Account:**
- Email: `student@gisul.com`
- Password: `student123`

## Database

The application uses SQLite for data persistence. The database file (`gisul.db`) is created automatically in the `backend-fastapi/` directory on first run.

### Database Schema

- **users** - User accounts (admin/student roles)
- **courses** - Course information
- **lessons** - Course lessons/modules
- **enrollments** - Student course enrollments

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email/password
2. Server returns JWT token
3. Client stores token in localStorage
4. Token is sent with each API request in `Authorization: Bearer <token>` header
5. Server validates token and returns protected resources

## Development

### Adding a New Feature

1. **Backend:** Create models, routes, and schemas
2. **Database:** Run migrations (add to models.py)
3. **Frontend:** Create components and update API calls
4. **Testing:** Test endpoints with Postman or similar tool

### Common Tasks

**Reset Database:**
```bash
# Delete the gisul.db file
rm backend-fastapi/gisul.db

# Restart the server to reseed
python main.py
```

**View API Documentation:**
Visit `http://localhost:5000/docs` for interactive Swagger documentation

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, you can change it:

**Backend:**
Change `PORT` in `backend-fastapi/.env`

**Frontend:**
```bash
PORT=3001 npm start
```

### CORS Issues
The backend includes CORS middleware allowing all origins. For production, restrict origins in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    ...
)
```

### Database Errors
If you get database errors, try clearing the database:
```bash
rm backend-fastapi/gisul.db
```

## Production Deployment

1. Change `SECRET_KEY` in `.env` to a secure random string
2. Set `REACT_APP_API_URL` to your production backend URL
3. Build frontend: `npm run build`
4. Deploy using services like Heroku, Vercel, or AWS

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the repository.
