# 🚨 Backend Deployment Troubleshooting

## Quick MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new project (name it "ExpenseTracker")

### Step 2: Create Database
1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE)
3. Choose AWS / Google Cloud (any region)
4. Name your cluster: "expense-tracker-cluster"

### Step 3: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `expense-user`
5. Password: `ExpenseTracker2024!` (or generate one)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It will look like: `mongodb+srv://expense-user:<password>@expense-tracker-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update Railway Environment Variables
Replace `<password>` with your actual password and add `/expense-tracker` at the end:

**MONGODB_URI**: `mongodb+srv://expense-user:ExpenseTracker2024!@expense-tracker-cluster.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority`

## Common Deploy Log Errors & Solutions

### Error: "ENOTFOUND" or "MongoNetworkError"
- **Problem**: Can't connect to MongoDB
- **Solution**: Double-check your MONGODB_URI and ensure IP is whitelisted

### Error: "Authentication failed"
- **Problem**: Wrong MongoDB username/password
- **Solution**: Check Database Access settings in Atlas

### Error: "Cannot find module"
- **Problem**: Missing dependencies
- **Solution**: Ensure package.json is in backend folder

### Error: "Port already in use"
- **Problem**: Railway PORT configuration
- **Solution**: Make sure you're using `process.env.PORT || 5000`

## Manual Railway Environment Variables

If you haven't set them yet, add these in Railway Variables tab:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://expense-user:ExpenseTracker2024!@expense-tracker-cluster.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=mySecretKey123!@#ExpenseTracker2024
PORT=5000
FRONTEND_URL=https://expenses-track-web-system.vercel.app
```
