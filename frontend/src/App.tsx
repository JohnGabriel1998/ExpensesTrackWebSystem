import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/RegisterNew';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Settings from './pages/Settings';
import './i18n'; // Initialize i18n

function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
          <CssBaseline />
          <Routes>
            <Route path="/ExpenseTracker" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="expenses/add" element={<AddExpense />} />
                <Route path="expenses/edit/:id" element={<EditExpense />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer position="top-right" />
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;  // This line was in the original, making sure it's there
