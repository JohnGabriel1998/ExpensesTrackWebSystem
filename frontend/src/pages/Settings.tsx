import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  GridLegacy as Grid,
  IconButton,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  CurrencyYen,
  Logout as LogoutIcon,
  DarkMode,
  LightMode,
  Email as EmailIcon,
  AccountCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [language, setLanguage] = useState(i18nInstance.language || 'en');
  const [currency, setCurrency] = useState(user?.preferences?.currency || 'USD');
  const [saving, setSaving] = useState(false);

  // Sync language state with i18n changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18nInstance.on('languageChanged', handleLanguageChange);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      setLanguage(newLanguage);
      await i18nInstance.changeLanguage(newLanguage);
      toast.success(t('settings.messages.saveSuccess'));
    } catch (error) {
      console.error('Language change error:', error);
      toast.error(t('settings.messages.saveError'));
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      await api.put('/api/auth/preferences', {
        language,
        darkMode,
        currency,
      });
      toast.success(t('settings.messages.saveSuccess'));
    } catch (error) {
      toast.error(t('settings.messages.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{
        py: 4,
        background: darkMode
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%)'
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.3) 100%)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={true} timeout={600}>
          <Box 
            sx={{ 
              mb: 4, 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              p: 3,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(100, 116, 139, 0.3)',
              }}
            >
              <SettingsIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 800,
                  background: darkMode
                    ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                {t('settings.title')}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  fontWeight: 500,
                }}
              >
                {t('settings.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} lg={4}>
            <Zoom in={true} timeout={800}>
              <Card 
                sx={{ 
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                  boxShadow: darkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  height: 'fit-content',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Profile Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        fontSize: '1rem',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {t('settings.profile.title')}
                    </Typography>
                  </Box>

                  {/* Profile Avatar */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        fontSize: '3rem',
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <AccountCircle sx={{ fontSize: 80 }} />
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#1e293b',
                        mb: 1,
                      }}
                    >
                      {user?.name || 'User Name'}
                    </Typography>
                    <Chip
                      label={t('settings.profile.premiumUser')}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                      }}
                    />
                  </Box>

                  {/* Profile Details */}
                  <Box sx={{ space: 2 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2.5,
                        mb: 2,
                        background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {t('settings.profile.emailAddress')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: darkMode ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                          }}
                        >
                          {user?.email || 'user@example.com'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2.5,
                        mb: 2,
                        background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <CurrencyYen sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {t('settings.profile.preferredCurrency')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: darkMode ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                          }}
                        >
                          {currency === 'JPY' ? 'Japanese Yen (¥)' : `${currency} (${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2.5,
                        background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <LanguageIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {t('settings.profile.language')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: darkMode ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                          }}
                        >
                          {language === 'en' ? 'English' : 'Japanese (日本語)'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Settings Section */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Appearance Settings */}
              <Zoom in={true} timeout={1000}>
                <Paper 
                  sx={{ 
                    p: 4,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '16px',
                    boxShadow: darkMode
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                        fontSize: '1rem',
                      }}
                    >
                      <PaletteIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {t('settings.appearance.title')}
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 3,
                      background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <IconButton 
                        sx={{ 
                          p: 0.5,
                          background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        {darkMode ? <DarkMode sx={{ fontSize: 20, color: '#ffffff' }} /> : <LightMode sx={{ fontSize: 20, color: '#f59e0b' }} />}
                      </IconButton>
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            color: darkMode ? '#ffffff' : '#1e293b',
                          }}
                        >
                          {t('settings.appearance.darkMode')}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            fontSize: '0.85rem',
                          }}
                        >
                          {t('settings.appearance.darkModeDescription')}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#6366f1',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#6366f1',
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Zoom>

              {/* Language Settings */}
              <Zoom in={true} timeout={1200}>
                <Paper 
                  sx={{ 
                    p: 4,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '16px',
                    boxShadow: darkMode
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        fontSize: '1rem',
                      }}
                    >
                      <LanguageIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {t('settings.language.title')}
                    </Typography>
                  </Box>
                  
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      sx={{ gap: 1 }}
                    >
                      <FormControlLabel 
                        value="en" 
                        control={
                          <Radio 
                            sx={{
                              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                              '&.Mui-checked': {
                                color: '#8b5cf6',
                              },
                            }}
                          />
                        } 
                        label={
                          <Box 
                            sx={{ 
                              p: 2,
                              background: language === 'en' 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
                                : darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '12px',
                              border: language === 'en' 
                                ? '1px solid rgba(139, 92, 246, 0.3)'
                                : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                              width: '100%',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                color: darkMode ? '#ffffff' : '#1e293b',
                              }}
                            >
                              {t('settings.language.english')}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                fontSize: '0.85rem',
                              }}
                            >
                              {t('settings.language.englishDescription')}
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          m: 0, 
                          width: '100%',
                          '& .MuiFormControlLabel-label': { width: '100%' }
                        }}
                      />
                      <FormControlLabel 
                        value="ja" 
                        control={
                          <Radio 
                            sx={{
                              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                              '&.Mui-checked': {
                                color: '#8b5cf6',
                              },
                            }}
                          />
                        } 
                        label={
                          <Box 
                            sx={{ 
                              p: 2,
                              background: language === 'ja' 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
                                : darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                              borderRadius: '12px',
                              border: language === 'ja' 
                                ? '1px solid rgba(139, 92, 246, 0.3)'
                                : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                              width: '100%',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                color: darkMode ? '#ffffff' : '#1e293b',
                              }}
                            >
                              {t('settings.language.japanese')}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                fontSize: '0.85rem',
                              }}
                            >
                              {t('settings.language.japaneseDescription')}
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          m: 0, 
                          width: '100%',
                          '& .MuiFormControlLabel-label': { width: '100%' }
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Zoom>

              {/* Currency Settings */}
              <Zoom in={true} timeout={1400}>
                <Paper 
                  sx={{ 
                    p: 4,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '16px',
                    boxShadow: darkMode
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        fontSize: '1rem',
                      }}
                    >
                      <CurrencyYen sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#1e293b',
                      }}
                    >
                      {t('settings.currency.title')}
                    </Typography>
                  </Box>
                  
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      sx={{ gap: 1 }}
                    >
                      {[
                        { value: 'USD', label: 'US Dollar', symbol: '$', desc: 'United States Dollar' },
                        { value: 'EUR', label: 'Euro', symbol: '€', desc: 'European Union Euro' },
                        { value: 'GBP', label: 'British Pound', symbol: '£', desc: 'British Pound Sterling' },
                        { value: 'JPY', label: 'Japanese Yen', symbol: '¥', desc: 'Japanese Yen' }
                      ].map((curr) => (
                        <FormControlLabel 
                          key={curr.value}
                          value={curr.value} 
                          control={
                            <Radio 
                              sx={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                '&.Mui-checked': {
                                  color: '#10b981',
                                },
                              }}
                            />
                          } 
                          label={
                            <Box 
                              sx={{ 
                                p: 2,
                                background: currency === curr.value 
                                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'
                                  : darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                border: currency === curr.value 
                                  ? '1px solid rgba(16, 185, 129, 0.3)'
                                  : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                width: '100%',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: darkMode ? '#ffffff' : '#1e293b',
                                  }}
                                >
                                  {curr.label}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {curr.desc}
                                </Typography>
                              </Box>
                              <Chip
                                label={curr.symbol}
                                size="small"
                                sx={{
                                  background: currency === curr.value 
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                  color: currency === curr.value ? 'white' : (darkMode ? '#ffffff' : '#1e293b'),
                                  fontWeight: 600,
                                  minWidth: '40px',
                                }}
                              />
                            </Box>
                          }
                          sx={{ 
                            m: 0, 
                            width: '100%',
                            '& .MuiFormControlLabel-label': { width: '100%' }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Zoom>

              {/* Action Buttons */}
              <Zoom in={true} timeout={1600}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSavePreferences}
                    disabled={saving}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5b5bf6 0%, #7c3aed 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(99, 102, 241, 0.4)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        transform: 'none',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {saving ? t('settings.actions.saving') : t('settings.actions.savePreferences')}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    color="error"
                    onClick={logout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      border: '2px solid #ef4444',
                      color: '#ef4444',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: '2px solid #dc2626',
                        background: 'rgba(239, 68, 68, 0.1)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    {t('settings.actions.logout')}
                  </Button>
                </Box>
              </Zoom>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Settings;