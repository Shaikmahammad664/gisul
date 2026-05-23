# Vercel Deployment - Quick Start

## Prerequisites
- GitHub account with the repo pushed
- Vercel account (free tier at vercel.com)
- Git installed locally

## 5-Minute Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo (gisul-platform)
4. Click "Import"

### 3. Configure Project
In the "Configure Project" screen:
- **Project Name**: Keep default or customize
- **Framework Preset**: Select "Other"
- **Root Directory**: Leave as `.`
- **Build Command**: Leave blank (Vercel will auto-detect)
- **Output Directory**: Leave blank
- **Install Command**: Leave blank

### 4. Environment Variables
Add these in the Environment Variables section:
```
SQLALCHEMY_DATABASE_URL = sqlite:////tmp/gisul.db
SECRET_KEY = your-super-secret-key-12345
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
REACT_APP_API_URL = /api
```

### 5. Deploy
Click "Deploy" and wait for build to complete (2-3 minutes)

## Your Live URLs
- **Frontend**: `https://your-project-name.vercel.app`
- **API Docs**: `https://your-project-name.vercel.app/api/docs`
- **API Health**: `https://your-project-name.vercel.app/api/health`

## Test After Deployment

### Login Credentials
- Admin: `admin@gisul.com` / `admin123`
- Student: `student@gisul.com` / `student123`

### Quick Test
1. Go to your Vercel URL
2. Click "Login with Demo Admin" button
3. Browse courses
4. Switch to student mode and enroll

## Troubleshooting

### "Module not found" errors
- Make sure `api/requirements.txt` exists with all dependencies
- Check that all Python files are in `api/app/`

### "Database connection failed"
- Database uses `/tmp/gisul.db` which is ephemeral
- This is normal - database resets on new deployments
- Demo data is re-seeded automatically

### "CORS errors" or "API not responding"
- Check that `vercel.json` routes `/api/*` to Python handler
- Verify frontend `.env.production` has `REACT_APP_API_URL=/api`

## After First Deploy

### Change Secret Key
In Vercel Project Settings → Environment Variables:
```bash
SECRET_KEY = generate-a-new-random-string-here
```

Redeploy to apply changes.

### Custom Domain (Optional)
1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions

## Redeploy on Changes
Just push to GitHub:
```bash
git push origin main
```
Vercel automatically rebuilds and deploys!

---

**Support Resources:**
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
