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
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register: registerUser, token, user } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  const password = watch('password');

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
                  {t('auth.register.welcome')}
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
                  {t('auth.register.description')}
                </Typography>
                
                {/* Feature highlights */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { icon: '🚀', text: t('auth.register.features.quick') },
                    { icon: '📊', text: t('auth.register.features.analytics') },
                    { icon: '💰', text: t('auth.register.features.budget') },
                    { icon: '🔒', text: t('auth.register.features.secure') }
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

          {/* Right Side - Registration Form */}
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
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 32 }} />
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
                    {t('auth.register.title')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    {t('auth.register.subtitle')}
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    {/* Name Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: darkMode ? '#ffffff' : '#1e293b',
                          }}
                        >
                          {t('auth.register.name')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label={t('auth.register.nameLabel')}
                        placeholder={t('auth.register.namePlaceholder')}
                        autoComplete="name"
                        autoFocus
                        {...register('name', {
                          required: t('auth.validation.nameRequired'),
                          minLength: {
                            value: 2,
                            message: t('auth.validation.nameMinLength'),
                          },
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#8b5cf6',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#8b5cf6',
                            }
                          }
                        }}
                      />
                    </Grid>

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
                          {t('auth.register.email')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label={t('auth.register.emailLabel')}
                        placeholder={t('auth.register.emailPlaceholder')}
                        autoComplete="email"
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
                          {t('auth.register.password')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        label={t('auth.register.passwordLabel')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder={t('auth.register.passwordPlaceholder')}
                        autoComplete="new-password"
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

                    {/* Confirm Password Field */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                          {t('auth.register.confirmPassword')}
                        </Typography>
                      </Box>
                      <TextField
                        required
                        fullWidth
                        label={t('auth.register.confirmPasswordLabel')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        {...register('confirmPassword', {
                          required: t('auth.validation.confirmPasswordRequired'),
                          validate: (value) =>
                            value === password || t('auth.validation.passwordMismatch'),
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                              borderColor: '#f59e0b',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#f59e0b',
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      mt: 4,
                      mb: 3,
                      borderRadius: '12px',
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
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
                    {isSubmitting ? t('auth.register.creating') : t('auth.register.createButton')}
                  </Button>

                  {/* Login Link */}
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          textAlign: 'center',
                        }}
                      >
                        {t('auth.register.hasAccount')}{' '}
                        <Link 
                          component={RouterLink} 
                          to="/login"
                          sx={{
                            color: '#10b981',
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
                          <Login sx={{ fontSize: 16 }} />
                          {t('auth.register.signInLink')}
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

export default Register;
