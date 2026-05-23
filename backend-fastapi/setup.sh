#!/bin/bash

# Gisul Platform - FastAPI Backend Setup Script

echo "🚀 Setting up Gisul Platform FastAPI Backend..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python 3.8+ is required but not installed."
    exit 1
fi

# Navigate to backend directory
cd backend-fastapi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  cd backend-fastapi"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "The API will be available at http://localhost:5000"
echo "API Docs: http://localhost:5000/docs"
