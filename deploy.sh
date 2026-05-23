#!/bin/bash
# Deployment script for Gisul Platform

echo "🚀 Gisul Platform Deployment Script"
echo "===================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Gisul Platform"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Deployment Options:"
echo "1. Frontend only (Vercel)"
echo "2. Backend only (Railway)"
echo "3. Both (requires setup)"
echo ""
echo "Frontend Deployment Steps:"
echo "  1. Push code to GitHub"
echo "  2. Go to vercel.com"
echo "  3. Import repository → Select 'frontend' directory"
echo "  4. Set REACT_APP_API_URL environment variable"
echo "  5. Deploy"
echo ""
echo "Backend Deployment Steps (Railway):"
echo "  1. Go to railway.app"
echo "  2. New Project → Deploy from GitHub"
echo "  3. Select this repository"
echo "  4. Set environment variables (see DEPLOYMENT.md)"
echo "  5. Deploy"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
