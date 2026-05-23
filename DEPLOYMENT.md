# Deployment Guide - Gisul Platform

This guide covers deploying the Gisul platform to production using Vercel (frontend) and Railway/Render (backend).

## Architecture

```
┌─────────────────────────────────┐
│   Vercel (Frontend - React)     │
│   https://gisul.vercel.app      │
└──────────────┬──────────────────┘
               │
        HTTP/CORS
               │
┌──────────────▼──────────────────┐
│  Railway/Render (Backend - API) │
│  https://gisul-api.railway.app  │
└──────────────┬──────────────────┘
               │
        SQLite/PostgreSQL
               │
        Database File/Service
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with the repository
- Vercel account (free tier available)

### Steps

1. **Push code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gisul-platform.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

3. **Set Environment Variables in Vercel Dashboard**
   - In Project Settings → Environment Variables:
   ```
   REACT_APP_API_URL = https://gisul-api.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at `https://YOUR_PROJECT.vercel.app`

---

## Backend Deployment (Railway / Render)

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Select the root directory

3. **Configure Environment Variables**
   - Go to Variables tab
   - Add:
   ```
   SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db
   SECRET_KEY=your-super-secret-key-min-32-chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   PORT=5000
   ```

4. **Deploy**
   - Railway auto-deploys on git push
   - Your API will be available at the provided Railway URL
   - Update Vercel `REACT_APP_API_URL` with this URL

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Enter name: `gisul-api`
   - Root directory: `/` (root of repo)
   - Runtime: `Python 3.11`

3. **Build Command**
   ```bash
   pip install -r backend-fastapi/requirements.txt
   ```

4. **Start Command**
   ```bash
   cd backend-fastapi && python main.py
   ```

5. **Set Environment Variables**
   - In Environment tab, add:
   ```
   SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db
   SECRET_KEY=your-super-secret-key-min-32-chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   PORT=5000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Your API will be available at the provided Render URL

---

## Post-Deployment

### 1. Test the Connection
```bash
# Frontend will load
# Try logging in with demo credentials
curl https://gisul-api.railway.app/api/health
```

### 2. Update CORS Settings (if needed)
If you get CORS errors, update `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://YOUR_PROJECT.vercel.app"],  # Your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Database Persistence (Important!)

For **Railway/Render**, SQLite files are ephemeral. For production:

**Option A: Use PostgreSQL**
- Create a PostgreSQL database on Railway/Render
- Update connection string:
```
SQLALCHEMY_DATABASE_URL=postgresql://user:password@host:port/dbname
```

**Option B: Use External Storage**
- Upload SQLite file to S3 or similar
- Configure backup mechanism

**Option C: Keep SQLite (Development)**
- Database resets on redeploy
- Only works for demos/testing

---

## Environment Variables Reference

### Frontend (.env.production)
```
REACT_APP_API_URL=https://gisul-api.railway.app
```

### Backend
```
SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db  # or PostgreSQL URL
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
PORT=5000
```

---

## Demo Credentials

```
Admin:
  Email: admin@gisul.com
  Password: admin123

Student:
  Email: student@gisul.com
  Password: student123
```

---

## Troubleshooting

### CORS Errors
- Check `REACT_APP_API_URL` is correct in Vercel environment
- Verify backend CORS middleware includes your Vercel domain

### 405 Method Not Allowed
- Ensure all routes are properly defined in backend
- Check route methods (GET/POST/PUT/DELETE)

### Database Issues
- For Railway/Render, SQLite persists during the session but resets on redeploy
- For production, use PostgreSQL instead

### Seed Data Missing
- Database seeds on first run
- Check Railway/Render logs for seed errors

---

## Monitoring

### Vercel
- Logs: Dashboard → Deployments → Real-time logs
- Errors: Integrations → Error Tracking

### Railway
- Logs: Dashboard → Your Project → Logs tab
- Monitor: Deployment history and metrics

### Render
- Logs: Dashboard → Service → Logs
- Metrics: Events and deployment history

---

## Rollback

**Vercel**: Click deployment → "Rollback to this"
**Railway/Render**: Redeploy previous commit from git history

---

## Cost Estimates (2024)

- **Vercel**: Free tier includes unlimited deployments
- **Railway**: Free tier ($5/month minimum, includes $5 credit)
- **Render**: Free tier available, paid tiers start at $7/month
- **Database**: PostgreSQL on Railway/Render from $9-15/month

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Railway/Render
3. ✅ Test end-to-end
4. ✅ Set up custom domain (optional)
5. ✅ Configure SSL/TLS (auto-enabled on Vercel/Railway/Render)
6. ✅ Monitor logs and errors
7. ✅ Set up auto-deployments on git push

---

## Support

For issues, check:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- GitHub Issues in your repository
