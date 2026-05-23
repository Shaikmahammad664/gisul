# How to Run the Gisul Platform (FastAPI + React Version)

## Quick Start Guide

This project has been converted from Node.js/Express to Python/FastAPI with React frontend.

### New Directory Structure
```
gisul-platform/
├── backend-fastapi/    ← NEW: Python FastAPI backend
├── frontend/           ← React frontend (unchanged)
└── FASTAPI_README.md   ← Detailed documentation
```

## Setup Instructions

### 1. Backend Setup (Python FastAPI)

```bash
# Navigate to backend directory
cd backend-fastapi

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend will run on `http://localhost:5000`

**API Documentation:** Visit `http://localhost:5000/docs` for interactive Swagger UI

### 2. Frontend Setup (React)

```bash
# In another terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## What Changed?

### Backend Migration (Express → FastAPI)
- **Database:** SQLite (sql.js → SQLite with SQLAlchemy)
- **Framework:** Express.js → FastAPI
- **ORM:** Direct SQL → SQLAlchemy
- **Authentication:** JWT tokens (same as before)
- **API Endpoints:** Same routes, FastAPI style

### API Compatibility
The React frontend communicates with the same API structure:
- `/api/auth/register` - Register
- `/api/auth/login` - Login  
- `/api/auth/me` - Get current user
- `/api/courses/*` - Course operations
- `/api/enrollments/*` - Enrollment operations

## Test Credentials

After the database seeds on first run:

**Admin:**
- Email: `admin@gisul.com`
- Password: `admin123`

**Student:**
- Email: `student@gisul.com`
- Password: `student123`

## Architecture

```
React Frontend (localhost:3000)
         ↓ (HTTP/CORS)
FastAPI Backend (localhost:5000)
         ↓
SQLite Database (gisul.db)
```

## Development

### Making Changes

**Backend Changes:**
1. Edit files in `backend-fastapi/app/`
2. Server auto-restarts with changes (if running with `uvicorn --reload`)
3. Test endpoints at `http://localhost:5000/docs`

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. React dev server auto-reloads
3. Check browser for changes

### Common Tasks

**Reset Database:**
```bash
# Stop the backend server
# Delete the database file
rm backend-fastapi/gisul.db

# Restart the server
cd backend-fastapi
python main.py
```

**Change Backend Port:**
Edit `backend-fastapi/.env`:
```
PORT=8000
```

**Change Frontend API URL:**
Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"
- Ensure you're in the virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate`)
- Install dependencies: `pip install -r requirements.txt`

### "Cannot GET /api/courses"
- Make sure backend is running on port 5000
- Check that React is pointing to the right API URL

### CORS Errors
- Backend has CORS enabled for all origins (*)
- For production, restrict to specific domains in `main.py`

### Port Already in Use
- Change PORT in `.env` file and update frontend API URL accordingly

## File Locations

| Component | Location | Purpose |
|-----------|----------|---------|
| FastAPI App | `backend-fastapi/main.py` | Server entry point |
| API Routes | `backend-fastapi/app/routes/` | Endpoint handlers |
| Database Models | `backend-fastapi/app/models.py` | SQLAlchemy ORM models |
| React App | `frontend/src/App.js` | Frontend entry point |
| API Client | `frontend/src/utils/api.js` | Axios configuration |
| Auth Context | `frontend/src/context/AuthContext.js` | JWT token management |

## Next Steps

1. ✅ Install dependencies
2. ✅ Start backend server
3. ✅ Start frontend server
4. 🔗 Access `http://localhost:3000`
5. 🔐 Login with test credentials
6. ✨ Start developing!

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [React Documentation](https://react.dev/)
- [Detailed Project Documentation](./FASTAPI_README.md)

---

**Questions?** Check the detailed README.md or FastAPI_README.md for more information.
