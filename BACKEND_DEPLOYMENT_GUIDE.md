# Backend Deployment Guide

## 🚀 Deploy Backend to Railway (Recommended)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select `JohnGabriel1998/ExpensesTrackWebSystem`
5. Choose "Deploy from a folder" → Select `backend`

### Step 2: Add Environment Variables
In Railway dashboard, go to Variables tab and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=mySecretKey123!@#ExpenseTracker2024
PORT=5000
```

### Step 3: Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://your-app-name.railway.app`

### Step 4: Update Frontend
Update your Vercel environment variable:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Update `REACT_APP_API_URL` to: `https://your-app-name.railway.app/api`
- Redeploy your frontend

## 🎯 Alternative: Render.com

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repo: `JohnGabriel1998/ExpensesTrackWebSystem`
5. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add the same environment variables

## 📊 Database Setup (MongoDB Atlas)

If you don't have MongoDB Atlas setup:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Replace `username`, `password`, and `cluster` in MONGODB_URI

## ✅ Testing

After deployment:
1. Test API health: `https://your-backend-url/health`
2. Update frontend API URL
3. Test login functionality

Your backend will be live and your login should work! 🎉
