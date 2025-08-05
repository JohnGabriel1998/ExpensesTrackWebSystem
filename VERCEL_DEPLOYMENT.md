# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will automatically detect the configuration

3. **Set Environment Variables:**
   In Vercel Dashboard > Settings > Environment Variables, add:
   ```
   REACT_APP_API_URL = https://your-app-name.vercel.app/api
   MONGODB_URI = your-mongodb-connection-string
   JWT_SECRET = your-jwt-secret-key
   NODE_ENV = production
   ```

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure for Vercel

```
ExpensesTrackWeb/
├── api/                    # Backend API (Serverless functions)
│   ├── index.js           # Main API entry point
│   ├── package.json       # API dependencies
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── middleware/        # API middleware
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.production
├── vercel.json           # Vercel configuration
└── .env.example          # Environment variables template
```

## 🔧 Configuration Files Added

- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `api/index.js` - Serverless API entry point
- ✅ `api/package.json` - API dependencies
- ✅ `frontend/.env.production` - Production environment variables
- ✅ Updated `frontend/package.json` - Removed GitHub Pages config
- ✅ Updated `frontend/src/App.tsx` - Fixed routing for Vercel

## 🌐 After Deployment

1. Your frontend will be available at: `https://your-app-name.vercel.app`
2. Your API will be available at: `https://your-app-name.vercel.app/api`
3. Update the `REACT_APP_API_URL` environment variable with your actual Vercel URL

## 🐛 Troubleshooting

### 404 Errors
- ✅ Fixed with proper rewrites in `vercel.json`
- ✅ Updated routing in `App.tsx`

### API Errors
- Make sure MongoDB URI is set correctly
- Verify JWT_SECRET is configured
- Check CORS settings in API

### Build Errors
- Run `npm run build` in frontend directory locally first
- Check that all dependencies are installed
