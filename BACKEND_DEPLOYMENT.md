# Deploy Backend to Railway (Free Alternative)

## Quick Backend Deployment to Railway

1. **Sign up at Railway.app** (free)
2. **Connect your GitHub repo**
3. **Deploy backend folder**
4. **Add environment variables:**
   - MONGODB_URI=your-mongodb-atlas-connection
   - JWT_SECRET=your-secure-secret
   - PORT=5000

## Update Frontend API URL
Once Railway gives you a backend URL, update in Vercel:
REACT_APP_API_URL=https://your-app.railway.app/api

## Alternative: Use Render.com (also free)
1. Go to render.com
2. Create web service
3. Connect GitHub repo
4. Select backend folder
5. Add same environment variables
