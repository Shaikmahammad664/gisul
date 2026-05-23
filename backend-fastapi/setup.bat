@echo off
REM Gisul Platform - FastAPI Backend Setup Script for Windows

echo 🚀 Setting up Gisul Platform FastAPI Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3.8+ is required but not installed.
    exit /b 1
)

REM Navigate to backend directory
cd backend-fastapi

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating .env file...
    copy .env.example .env
)

echo.
echo ✅ Setup complete!
echo.
echo To start the server, run:
echo   cd backend-fastapi
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo The API will be available at http://localhost:5000
echo API Docs: http://localhost:5000/docs
