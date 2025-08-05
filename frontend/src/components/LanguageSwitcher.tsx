import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Tooltip,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { darkMode } = useCustomTheme();
  const currentLang = i18n.language || 'en';

  const handleLanguageToggle = () => {
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Tooltip title={`Switch to ${currentLang === 'en' ? '日本語' : 'English'}`}>
      <Box
        onClick={handleLanguageToggle}
        sx={{
          position: 'relative',
          width: 80,
          height: 36,
          borderRadius: '18px',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: darkMode
              ? '0 8px 20px rgba(99, 102, 241, 0.3)'
              : '0 8px 20px rgba(99, 102, 241, 0.2)',
            border: `1px solid ${darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.3)'}`,
          }
        }}
      >
        {/* English Side */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 700,
            color: currentLang === 'en' ? '#ffffff' : (darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
            background: currentLang === 'en' 
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : 'transparent',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: currentLang === 'en' ? 3 : 1,
            boxShadow: currentLang === 'en' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
            transform: currentLang === 'en' ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              transform: currentLang === 'en' ? 'scale(1.15)' : 'scale(1.05)',
            }
          }}
        >
          🇺🇸
        </Box>

        {/* Japanese Side */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 700,
            color: currentLang === 'ja' ? '#ffffff' : (darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
            background: currentLang === 'ja' 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'transparent',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: currentLang === 'ja' ? 3 : 1,
            boxShadow: currentLang === 'ja' ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none',
            transform: currentLang === 'ja' ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              transform: currentLang === 'ja' ? 'scale(1.15)' : 'scale(1.05)',
            }
          }}
        >
          🇯🇵
        </Box>

        {/* Sliding Background Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            left: currentLang === 'en' ? 2 : 44,
            width: 32,
            height: 32,
            borderRadius: '16px',
            background: darkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'}`,
          }}
        />

        {/* Language Labels */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          {currentLang === 'en' ? 'English' : '日本語'}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default LanguageSwitcher;
