<div align="center">

# 💰 Expense Tracker Web System

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
</p>

<h3 align="center">🚀 A modern, full-stack expense tracking application with multi-language support</h3>

<p align="center">
  <a href="https://expenses-track-web-system-frontend.vercel.app"><strong>Live Demo »</strong></a>
  <br />
  <br />
  <a href="#-features">Features</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
  ·
  <a href="#-quick-start">Quick Start</a>
  ·
  <a href="#-deployment">Deployment</a>
  ·
  <a href="#-api-documentation">API Docs</a>
</p>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square&logo=github" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</div>

</div>

---

## 🌟 Live Deployment

<div align="center">

| Service | URL | Status |
|---------|-----|--------|
| 🌐 **Frontend** | [https://expenses-track-web-system-frontend.vercel.app](https://expenses-track-web-system-frontend.vercel.app) | ![Live](https://img.shields.io/badge/Live-brightgreen?style=flat-square) |
| ⚙️ **Backend API** | [https://expensestrackwebsystem.onrender.com](https://expensestrackwebsystem.onrender.com) | ![Live](https://img.shields.io/badge/Live-brightgreen?style=flat-square) |
| 🗄️ **Database** | MongoDB Atlas (Cloud) | ![Active](https://img.shields.io/badge/Active-brightgreen?style=flat-square) |

</div>

---

## ✨ Features

<table>
  <tr>
    <td>
      <h3>🔐 Authentication & Security</h3>
      <ul>
        <li>JWT-based authentication</li>
        <li>Secure password hashing</li>
        <li>Protected API routes</li>
        <li>Session management</li>
      </ul>
    </td>
    <td>
      <h3>💼 Expense Management</h3>
      <ul>
        <li>Create, read, update, delete expenses</li>
        <li>Categorize expenses</li>
        <li>Filter by date range</li>
        <li>Search functionality</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🎨 User Experience</h3>
      <ul>
        <li>🌓 Dark/Light theme toggle</li>
        <li>📱 Responsive design</li>
        <li>⚡ Real-time updates</li>
        <li>✨ Modern UI with Tailwind CSS</li>
      </ul>
    </td>
    <td>
      <h3>🌍 Internationalization</h3>
      <ul>
        <li>🇺🇸 English language support</li>
        <li>🇯🇵 Japanese language support</li>
        <li>🔄 Easy language switching</li>
        <li>📅 Localized date formats</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-4351E7?style=flat-square&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-4EA94B?style=flat-square&logo=mongodb&logoColor=white)

</div>

---

## 📦 Project Structure

```
ExpensesTrackWebSystem/
│
├── 📁 frontend/                    # React TypeScript Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI components
│   │   ├── 📁 contexts/           # React Context providers
│   │   ├── 📁 pages/              # Page components
│   │   ├── 📁 services/           # API service layer
│   │   ├── 📁 types/              # TypeScript definitions
│   │   └── 📁 utils/              # Utility functions
│   ├── 📄 .env                    # Environment variables
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
│
├── 📁 backend/                     # Express TypeScript Backend
│   ├── 📁 src/
│   │   ├── 📁 config/             # Configuration files
│   │   ├── 📁 controllers/        # Route controllers
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 models/             # Mongoose models
│   │   ├── 📁 routes/             # API routes
│   │   ├── 📁 types/              # TypeScript definitions
│   │   └── 📄 server.ts           # Entry point
│   ├── 📄 .env                    # Environment variables
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
└── 📄 README.md                    # You are here! 📍
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** (local or Atlas account)
- **Git**

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JohnGabriel1998/ExpensesTrackWebSystem.git
   cd ExpensesTrackWebSystem
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend
   cd backend
   
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your values:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   # PORT=5001
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup** (new terminal)
   ```bash
   # Navigate to frontend
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:5001" > .env
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

---

## 🌐 Deployment Guide

### Backend Deployment (Render)

<details>
<summary><b>Click to expand deployment steps</b></summary>

1. **Create Render Account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repository
   - Choose `ExpensesTrackWebSystem`

3. **Configure Build Settings**
   ```yaml
   Name: expensestrackwebsystem
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Environment Variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-secret-key-here
   PORT=5001
   ```

5. **Deploy** and wait for "Live" status

</details>

### Frontend Deployment (Vercel)

<details>
<summary><b>Click to expand deployment steps</b></summary>

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Project**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   ```
   VITE_API_URL=https://expensestrackwebsystem.onrender.com
   ```

</details>

---

## 📡 API Documentation

### Base URL
```
Production: https://expensestrackwebsystem.onrender.com
Development: http://localhost:5001
```

### Authentication
All protected routes require JWT token in header:
```http
Authorization: Bearer <token>
```

### Endpoints

<details>
<summary><b>🔐 Authentication</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

</details>

<details>
<summary><b>💰 Expenses</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/expenses` | Get all expenses | ✅ |
| GET | `/api/expenses/:id` | Get single expense | ✅ |
| POST | `/api/expenses` | Create expense | ✅ |
| PUT | `/api/expenses/:id` | Update expense | ✅ |
| DELETE | `/api/expenses/:id` | Delete expense | ✅ |

</details>

<details>
<summary><b>📊 Dashboard</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get statistics | ✅ |
| GET | `/api/dashboard/categories` | Category breakdown | ✅ |

</details>

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expenses-tracker

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5001
NODE_ENV=production
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=https://expensestrackwebsystem.onrender.com
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/400x300?text=Dashboard+View" width="400" alt="Dashboard" />
        <br />
        <b>Dashboard Overview</b>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/400x300?text=Expense+List" width="400" alt="Expenses" />
        <br />
        <b>Expense Management</b>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://via.placeholder.com/400x300?text=Dark+Mode" width="400" alt="Dark Mode" />
        <br />
        <b>Dark Mode Support</b>
      </td>
      <td align="center">
        <img src="https://via.placeholder.com/400x300?text=Mobile+View" width="400" alt="Mobile" />
        <br />
        <b>Mobile Responsive</b>
      </td>
    </tr>
  </table>
</div>

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

<div align="center">
  <img src="https://github.com/JohnGabriel1998.png" width="100" height="100" style="border-radius: 50%;" alt="John Gabriel" />
  <h3>John Gabriel</h3>
  <p>Full Stack Developer</p>
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/JohnGabriel1998)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/johngabriel)
</div>

---

<div align="center">
  <h3>⭐ If you found this project helpful, please give it a star!</h3>
  
  [![Star this repo](https://img.shields.io/github/stars/JohnGabriel1998/ExpensesTrackWebSystem?style=social)](https://github.com/JohnGabriel1998/ExpensesTrackWebSystem)
  [![Fork this repo](https://img.shields.io/github/forks/JohnGabriel1998/ExpensesTrackWebSystem?style=social)](https://github.com/JohnGabriel1998/ExpensesTrackWebSystem/fork)
  
  <br />
  
  Made with ❤️ and lots of ☕
</div>
