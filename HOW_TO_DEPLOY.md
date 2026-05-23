# 🚀 DEPLOYMENT - STEP BY STEP

## Overview
- **Backend** → Render.com (Python/FastAPI)
- **Frontend** → Vercel.com (React)

Total time: **~20 minutes**

---

# PART 1: DEPLOY BACKEND ON RENDER (10 minutes)

## Step 1.1: Go to Render
1. Open: **https://render.com**
2. Click **Sign Up** (top right)
3. Click **Continue with GitHub**
4. Authorize Render to access your GitHub

## Step 1.2: Create Web Service
1. Click **New +** button (top right)
2. Click **Web Service**
3. Find your repo: **gisul** or **gisul-platform**
4. Click **Connect**

## Step 1.3: Configure Service
When you see the configuration form:

```
Name:                 gisul-backend
Root Directory:       backend-fastapi
Runtime:              Python 3
Build Command:        pip install -r requirements.txt
Start Command:        gunicorn -w 4 -b 0.0.0.0:8000 main:app
Plan:                 Free
Auto-deploy:          ON (leave checked)
```

Click **Create Web Service**

⏳ **Wait 2-3 minutes for build...**

## Step 1.4: Add Environment Variables
1. Look for **Environment** section (left sidebar)
2. Click **Add Environment Variable** for each:

```
Variable 1:
Name:  SQLALCHEMY_DATABASE_URL
Value: sqlite:///./gisul.db

Variable 2:
Name:  SECRET_KEY
Value: generate-super-secret-key-12345
(Use: https://generate-random.org/)

Variable 3:
Name:  ALGORITHM
Value: HS256

Variable 4:
Name:  ACCESS_TOKEN_EXPIRE_MINUTES
Value: 10080

Variable 5:
Name:  PORT
Value: 8000
```

After adding all, you should see: ✅ Deployed (green)

## Step 1.5: Get Your Backend URL
1. On the Render dashboard
2. Look at top - you'll see something like:
   ```
   https://gisul-backend-xyz123.onrender.com
   ```
3. **Copy this URL** (you'll need it next)

## Step 1.6: Test Backend
Open in browser:
```
https://your-backend-url.onrender.com/docs
```
You should see **Swagger UI** with all API endpoints ✅

---

# PART 2: DEPLOY FRONTEND ON VERCEL (5 minutes)

## Step 2.1: Update Frontend with Backend URL

**Important: Do this BEFORE deploying to Vercel**

1. Open file: **frontend/.env.production**
2. Change this line:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```
   (Replace with URL from Step 1.5)

3. Save the file

## Step 2.2: Commit and Push to GitHub
In your terminal (Windows PowerShell):

```powershell
cd c:\Users\maham\Downloads\gisul-platform_1\gisul-platform

git add frontend/.env.production

git commit -m "Update backend URL for production"

git push origin main
```

Wait for command to finish ✅

## Step 2.3: Go to Vercel
1. Open: **https://vercel.com**
2. Click **Sign Up** (top right)
3. Click **Continue with GitHub**
4. Authorize Vercel to access your GitHub

## Step 2.4: Import Project
1. Click **Add New** → **Project**
2. Click **Continue with GitHub**
3. Find your repo: **gisul** or **gisul-platform**
4. Click **Import**

## Step 2.5: Configure Project
When you see the configuration screen, set:

```
Framework Preset:     Create React App
Root Directory:       frontend
Build Command:        (leave blank)
Output Directory:     (leave blank)
Install Command:      (leave blank)
```

Leave everything else default. Click **Continue**

## Step 2.6: Add Environment Variables
You should see "Environment Variables" section

Add this one variable:
```
Name:  REACT_APP_API_URL
Value: https://your-render-backend-url.onrender.com
```
(Same URL from Step 1.5)

Click **Deploy**

⏳ **Wait 2-3 minutes for build...**

## Step 2.7: Get Your Frontend URL
You'll see a "Congratulations!" screen with:
```
https://your-project-name.vercel.app
```

**Copy this URL** - that's your live app! ✅

---

# PART 3: TEST EVERYTHING (5 minutes)

## Step 3.1: Open Your App
Click the Vercel URL or open:
```
https://your-frontend.vercel.app
```

You should see the **Gisul login page** ✅

## Step 3.2: Login Test
1. Click **"Login with Demo Admin"** button
2. You should see the **course catalog** ✅

## Step 3.3: Test Features
1. Click **Admin Dashboard** in navbar
2. Try **Create Course** button
3. Fill in details and click **Create**
4. You should see success message ✅

## Step 3.4: Test Student Features
1. Click your name (top right) → **Logout**
2. Login as student:
   ```
   Email:    student@gisul.com
   Password: student123
   ```
3. Enroll in a course
4. Click **My Courses**
5. You should see your enrolled course ✅

---

# 🎉 YOU'RE DONE!

## Your Live URLs

```
Frontend (Vercel):
https://your-app.vercel.app

Backend (Render):
https://your-backend.onrender.com

API Documentation:
https://your-backend.onrender.com/docs
```

## Demo Accounts

```
ADMIN
Email:    admin@gisul.com
Password: admin123

STUDENT
Email:    student@gisul.com
Password: student123
```

---

## Future Updates

Whenever you make changes:

```powershell
git add .
git commit -m "your changes"
git push origin main
```

**Both Render and Vercel auto-deploy in 1-2 minutes!** ✅

---

## Troubleshooting

### "API not responding" error
- Check that Render backend is running (green status on Render dashboard)
- Check that frontend .env.production has correct backend URL
- Refresh the page

### "Build failed" on Vercel
- Go to Vercel dashboard → Deployments → click failed build
- Check error message at bottom
- Usually missing environment variable

### "Build failed" on Render
- Go to Render dashboard → select service
- Go to Logs tab
- See the error message
- Usually Python dependency missing or typo in code

### Backend is slow on first request
- This is normal for Render free tier (cold start)
- App sleeps after 15 minutes
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan to remove this

---

## Need Help?

- **Full Guide:** VERCEL_RENDER_DEPLOYMENT.md
- **Setup Summary:** SETUP_COMPLETE.md
- **Code Questions:** README.md
