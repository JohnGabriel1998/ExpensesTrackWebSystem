import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  TextField,
  Link,
  GridLegacy as Grid,
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, token, user } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = React.useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
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
      {/* Language Switcher */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <LanguageSwitcher />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Welcome Section */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={600}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
                <Typography 
                  variant="h2" 
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    background: darkMode
                      ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                      : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  {t('auth.login.welcome')}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                    fontWeight: 400,
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  {t('auth.login.description')}
                </Typography>
                
                {/* Feature highlights */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { icon: '⚡', text: t('auth.login.features.fast') },
                    { icon: '📱', text: t('auth.login.features.mobile') },
                    { icon: '💡', text: t('auth.login.features.insights') },
                    { icon: '🔐', text: t('auth.login.features.security') }
                  ].map((feature, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        opacity: 0,
                        animation: `fadeInUp 0.6s ease forwards ${0.8 + index * 0.2}s`,
                      }}
                    >
                      <Box 
                        sx={{ 
                          fontSize: '1.5rem',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                          background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={800}>
              <Paper 
                elevation={0}
                sx={{
                  p: 5,
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '20px',
                  boxShadow: darkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 60,
                      height: 60,
                      mb: 2,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <LoginIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography 
                    component="h1" 
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: darkMode
                        ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                        : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {t('auth.login.title')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    {t('auth.login.subtitle')}
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    {/* Email Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: darkMode ? '#ffffff' : '#1e293b',
                          }}
                        >
                          {t('auth.login.email')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label={t('auth.login.emailLabel')}
                        placeholder={t('auth.login.emailPlaceholder')}
                        autoComplete="email"
                        autoFocus
                        {...register('email', {
                          required: t('auth.validation.emailRequired'),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('auth.validation.emailInvalid'),
                          },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#06b6d4',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#06b6d4',
                            }
                          }
                        }}
                      />
                    </Grid>

                    {/* Password Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <LockIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: darkMode ? '#ffffff' : '#1e293b',
                          }}
                        >
                          {t('auth.login.password')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        label={t('auth.login.passwordLabel')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder={t('auth.login.passwordPlaceholder')}
                        autoComplete="current-password"
                        {...register('password', {
                          required: t('auth.validation.passwordRequired'),
                          minLength: {
                            value: 6,
                            message: t('auth.validation.passwordMinLength'),
                          },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#10b981',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#10b981',
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Forgot Password Link */}
                  <Box sx={{ textAlign: 'right', mt: 2, mb: 3 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      sx={{
                        color: '#6366f1',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      {t('auth.login.forgotPassword')}
                    </Link>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      mb: 3,
                      borderRadius: '12px',
                      py: 1.5,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        transform: 'none',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {isSubmitting ? t('auth.login.signingIn') : t('auth.login.signInButton')}
                  </Button>

                  {/* Register Link */}
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          textAlign: 'center',
                        }}
                      >
                        {t('auth.login.noAccount')}{' '}
                        <Link 
                          component={RouterLink} 
                          to="/register"
                          sx={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }}
                        >
                          <PersonAdd sx={{ fontSize: 16 }} />
                          {t('auth.login.signUpLink')}
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Login;