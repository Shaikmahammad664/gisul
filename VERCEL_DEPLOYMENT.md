# Vercel Deployment Checklist

Quick reference for deploying Gisul to Vercel and Railway/Render.

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors in development
- [ ] No `console.log` statements left
- [ ] Environment variables configured
- [ ] `.env` files added to `.gitignore`
- [ ] All dependencies listed in `requirements.txt` and `package.json`

### Configuration
- [ ] `vercel.json` configured
- [ ] `railway.json` or `render.yaml` ready
- [ ] `.env.production` set with correct API URL
- [ ] Database migrations completed
- [ ] Seed data ready

### Security
- [ ] `SECRET_KEY` is strong and unique
- [ ] No API keys in source code
- [ ] CORS settings updated for production domain
- [ ] Environment variables not in git

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Repository

```bash
# 1. Ensure code is committed
git add .
git commit -m "Prepare for production deployment"

# 2. Create GitHub repo (if not exists)
git remote add origin https://github.com/YOUR_USERNAME/gisul-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

```bash
# 1. Go to https://vercel.com
# 2. Click "New Project"
# 3. Select "Import Git Repository"
# 4. Choose your GitHub repo
# 5. Configure settings:
#    - Root Directory: frontend
#    - Framework: Create React App
#    - Build Command: npm run build
#    - Output Directory: build
```

**Set Environment Variables in Vercel**:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   REACT_APP_API_URL=https://gisul-api.railway.app
   ```
3. Click Deploy

### Step 3: Deploy Backend to Railway

```bash
# 1. Go to https://railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Select your repository
# 5. Configure:
#    - Root Directory: /
#    - Select Python runtime
```

**Set Environment Variables**:
1. Go to Variables tab
2. Add all environment variables:
   ```
   SQLALCHEMY_DATABASE_URL=sqlite:///./gisul.db
   SECRET_KEY=your-secure-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   PORT=5000
   ```
3. Deploy

**Get your Railway URL**:
1. Go to Settings → Environment
2. Copy the Railway URL (e.g., `https://gisul-api-production.railway.app`)

### Step 4: Update Vercel Environment Variables

1. Go back to Vercel project settings
2. Update `REACT_APP_API_URL` with your Railway URL
3. Redeploy

### Step 5: Test Deployment

```bash
# Test API health
curl https://gisul-api-production.railway.app/api/health

# Try logging in from Vercel URL
# https://your-project.vercel.app/login
# Use: admin@gisul.com / admin123
```

---

## 📊 Deployment Options Comparison

| Service | Frontend | Backend | Database | Free Tier | Cost |
|---------|----------|---------|----------|-----------|------|
| **Vercel** | ✅ Excellent | ❌ No | N/A | Yes | Free for frontend |
| **Railway** | ✅ Yes | ✅ Excellent | ✅ PostgreSQL | Yes ($5/mo) | $5+ starter |
| **Render** | ✅ Yes | ✅ Good | ✅ PostgreSQL | Yes | Free/Paid tiers |
| **Heroku** | ✅ Yes | ✅ Good | ✅ PostgreSQL | ❌ No (discontinued) | 7$/mo+ |

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)

**Vercel**:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records

**Railway**:
1. Settings → Custom Domain
2. Point CNAME record to Railway

### SSL/TLS Certificate

- Vercel: Automatic
- Railway: Automatic
- Render: Automatic

### Monitoring & Logs

**Vercel**: 
- Dashboard → Deployments → Real-time logs

**Railway**:
- Dashboard → Project → Logs tab

---

## 🚨 Troubleshooting

### Frontend Won't Load
- Check Vercel build logs
- Verify `REACT_APP_API_URL` is set
- Clear browser cache and rebuild

### API Connection Fails
- Check CORS settings in backend
- Verify Railway URL in Vercel environment
- Test API directly: `curl https://your-api-url/api/health`

### 405 Method Not Allowed
- Check all API routes are defined
- Verify HTTP methods (GET/POST/PUT/DELETE)
- Review backend error logs

### Database Issues
- SQLite: Database resets on redeploy (use PostgreSQL for production)
- PostgreSQL: Ensure connection string is correct
- Run migrations if needed

---

## 📝 Important Notes

### SQLite vs PostgreSQL

**Development** (SQLite):
- Simple file-based database
- No setup required
- Resets on server restart

**Production** (PostgreSQL):
- Persistent data
- Better performance
- Recommended for production

To use PostgreSQL on Railway:
1. Add PostgreSQL plugin from Railway dashboard
2. Use Railway's auto-generated connection string
3. Update `SQLALCHEMY_DATABASE_URL`

### Demo Data

Database automatically seeds with demo courses on first run:
- Admin: `admin@gisul.com` / `admin123`
- Student: `student@gisul.com` / `student123`

### Auto-Deploy

Both Vercel and Railway auto-deploy on git push to main branch.

---

## 🔐 Sensitive Information

Never commit to git:
- `.env` files
- API keys
- Database credentials
- Secret keys

Store in:
- Vercel Environment Variables
- Railway Variables
- GitHub Secrets (for CI/CD)

---

## 📞 Support

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/concepts/)

---

## ✨ Success Indicators

After deployment, you should see:
- ✅ Frontend loads at `https://your-project.vercel.app`
- ✅ API responds at `https://your-api-url/api/health`
- ✅ Login works with demo credentials
- ✅ Can browse courses
- ✅ Can create courses (admin)
- ✅ Can enroll in courses (student)

---

**Happy Deploying! 🚀**
