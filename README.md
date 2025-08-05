# ExpensesTrackWeb System

A full-stack web application for tracking and managing personal expenses.

## Features

- User authentication and registration
- Add, edit, and delete expenses
- Dashboard with expense overview
- Multi-language support (English/Japanese)
- Dark/Light theme toggle
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Context API for state management
- i18next for internationalization
- CSS for styling

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
ExpensesTrackWeb/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── i18n/          # Internationalization
│   │   └── types/         # TypeScript type definitions
│   └── public/        # Static assets
├── backend/           # Node.js backend API
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── server.js      # Server entry point
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JohnGabriel1998/ExpensesTrackWebSystem.git
cd ExpensesTrackWebSystem
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Configure your MongoDB connection string and JWT secret

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/dashboard/stats` - Get dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
