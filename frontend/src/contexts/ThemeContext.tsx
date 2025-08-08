import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { useAuth } from './AuthContext';
import api from '../config/api';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize dark mode from localStorage first, then user preferences
  const getInitialDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return user?.preferences?.darkMode || false;
  };

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Update dark mode when user preferences change
  useEffect(() => {
    if (user?.preferences?.darkMode !== undefined) {
      setDarkMode(user.preferences.darkMode);
      localStorage.setItem('darkMode', JSON.stringify(user.preferences.darkMode));
    }
  }, [user]);

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save to localStorage immediately for persistence
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Save to backend if user is authenticated
    if (user) {
      try {
        await api.put('/api/auth/preferences', {
          darkMode: newDarkMode,
          language: user.preferences?.language || 'en',
          currency: user.preferences?.currency || 'USD'
        });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        // Don't revert the UI change even if API call fails
        // The localStorage will keep it consistent
      }
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};