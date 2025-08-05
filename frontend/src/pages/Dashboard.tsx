import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  GridLegacy as Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Fade,
  Grow,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Receipt,
  GetApp,
  CurrencyYen,
  Category,
  Timeline,
  AccountBalanceWallet,
  Info,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { DashboardSummary } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number>(0.38); // Default JPY to PHP rate
  const [loadingRate, setLoadingRate] = useState(false);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const fetchExchangeRate = useCallback(async () => {
    try {
      setLoadingRate(true);
      // Using a free exchange rate API
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/JPY');
      const rate = response.data.rates.PHP;
      setExchangeRate(rate || 0.38); // Fallback to default rate if API fails
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      // Keep the default rate if API fails
    } finally {
      setLoadingRate(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get('/api/dashboard/summary');
      setSummary(response.data.data);
    } catch (error) {
      toast.error(t('dashboard.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
    fetchExchangeRate();
  }, [fetchDashboardData, fetchExchangeRate]);

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/dashboard/export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(t('dashboard.exportSuccess'));
    } catch (error) {
      toast.error(t('dashboard.exportError'));
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            {t('dashboard.loadingOverview')}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!summary) {
    return (
      <Container>
        <Typography>{t('dashboard.noDataAvailable')}</Typography>
      </Container>
    );
  }

  const pieChartData = {
    labels: summary.categoryBreakdown.map(cat => t(`expenses.categories.${cat._id.toLowerCase()}`, cat._id)),
    datasets: [
      {
        data: summary.categoryBreakdown.map(cat => cat.total),
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7',
          '#DDA0DD',
          '#98D8C8',
          '#F7DC6F',
          '#BB8FCE',
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: t('dashboard.monthlyExpenses'),
        data: Array(12).fill(0).map((_, index) => {
          const monthData = summary.monthlyTotals.find(m => m._id === index + 1);
          return monthData ? monthData.total : 0;
        }),
        backgroundColor: 'rgba(70, 130, 235, 0.8)',
        borderColor: 'rgba(70, 130, 235, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              mb: 6,
              p: 4,
              borderRadius: '24px',
              background: darkMode 
                ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: darkMode
                ? '0 20px 40px rgba(26, 26, 46, 0.5)'
                : '0 20px 40px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3Ccircle cx="3" cy="13" r="3"/%3E%3Ccircle cx="13" cy="3" r="3"/%3E%3C/g%3E%3C/svg%3E")',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('dashboard.welcomeBack', { name: user?.name })}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {t('dashboard.financialOverview', { month: format(new Date(), 'MMMM yyyy') })}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<GetApp />}
                  onClick={handleExport}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('dashboard.exportCsv')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} lg={4}>
            <Grow in={true} timeout={800}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  background: darkMode
                    ? 'linear-gradient(135deg, #2C1810 0%, #3D2317 100%)'
                    : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: 'white',
                  boxShadow: darkMode
                    ? '0 15px 35px rgba(44, 24, 16, 0.4)'
                    : '0 15px 35px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: darkMode
                      ? '0 25px 50px rgba(44, 24, 16, 0.6)'
                      : '0 25px 50px rgba(255, 107, 107, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <CurrencyYen sx={{ fontSize: 40, opacity: 0.9 }} />
                    <Chip 
                      label={t('dashboard.thisMonth')} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white',
                        fontSize: '0.75rem',
                      }} 
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ¥{summary.currentMonthTotal.toFixed(2)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('dashboard.japaneseYen')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Grow in={true} timeout={900}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  background: darkMode
                    ? 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)'
                    : 'linear-gradient(135deg, #52B788 0%, #40916C 100%)',
                  color: 'white',
                  boxShadow: darkMode
                    ? '0 15px 35px rgba(27, 67, 50, 0.4)'
                    : '0 15px 35px rgba(82, 183, 136, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: darkMode
                      ? '0 25px 50px rgba(27, 67, 50, 0.6)'
                      : '0 25px 50px rgba(82, 183, 136, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box sx={{ fontSize: 40, opacity: 0.9, fontWeight: 'bold' }}>₱</Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Chip 
                        label={loadingRate ? t('dashboard.updating') : "PHP"} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.2)', 
                          color: 'white',
                          fontSize: '0.75rem',
                        }} 
                      />
                      <Tooltip title={t('dashboard.exchangeRate', { rate: exchangeRate.toFixed(4) })} arrow>
                        <Info sx={{ fontSize: 16, opacity: 0.7, cursor: 'help' }} />
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ₱{(summary.currentMonthTotal * exchangeRate).toFixed(2)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('dashboard.philippinePeso')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>



          <Grid item xs={12} sm={6} lg={4}>
            <Grow in={true} timeout={1000}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  background: darkMode
                    ? 'linear-gradient(135deg, #1A2328 0%, #2C3E50 100%)'
                    : 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                  color: 'white',
                  boxShadow: darkMode
                    ? '0 15px 35px rgba(26, 35, 40, 0.4)'
                    : '0 15px 35px rgba(78, 205, 196, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: darkMode
                      ? '0 25px 50px rgba(26, 35, 40, 0.6)'
                      : '0 25px 50px rgba(78, 205, 196, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Timeline sx={{ fontSize: 40, opacity: 0.9 }} />
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Chip 
                        label={t('dashboard.allMonths')} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.2)', 
                          color: 'white',
                          fontSize: '0.75rem',
                        }} 
                      />
                      <Tooltip title={`Exchange Rate: 1 JPY = ${exchangeRate.toFixed(4)} PHP`} arrow>
                        <Info sx={{ fontSize: 16, opacity: 0.7, cursor: 'help' }} />
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ¥{summary.monthlyTotals.reduce((total, month) => total + month.total, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, opacity: 0.8 }}>
                    ₱{(summary.monthlyTotals.reduce((total, month) => total + month.total, 0) * exchangeRate).toFixed(2)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ mr: 1, color: '#27ae60' }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('dashboard.totalYearExpenses')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Grow in={true} timeout={1400}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '20px',
                  background: darkMode
                    ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: darkMode
                    ? '0 15px 35px rgba(26, 26, 46, 0.4)'
                    : '0 15px 35px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: darkMode
                      ? '0 25px 50px rgba(26, 26, 46, 0.6)'
                      : '0 25px 50px rgba(102, 126, 234, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Category sx={{ fontSize: 40, opacity: 0.9 }} />
                    <Chip 
                      label={t('dashboard.topCategory')} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white',
                        fontSize: '0.75rem',
                      }} 
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {summary.categoryBreakdown[0] ? t(`expenses.categories.${summary.categoryBreakdown[0]._id.toLowerCase()}`, summary.categoryBreakdown[0]._id) : 'N/A'}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <AccountBalanceWallet sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      ¥{summary.categoryBreakdown[0]?.total.toFixed(2) || '0'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} lg={8}>
            <Fade in={true} timeout={1600}>
              <Paper
                sx={{
                  p: 4,
                  height: 480,
                  borderRadius: '24px',
                  background: darkMode
                    ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  boxShadow: darkMode
                    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                    : '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode
                      ? '0 30px 60px rgba(0, 0, 0, 0.4)'
                      : '0 30px 60px rgba(0, 0, 0, 0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: darkMode
                      ? 'radial-gradient(circle at 20% 30%, rgba(187, 134, 252, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(70, 130, 235, 0.08) 0%, transparent 50%)'
                      : 'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(116, 75, 162, 0.06) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  },
                }}
              >
                {/* Floating Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '10%',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: darkMode ? '#BB86FC' : '#667eea',
                    opacity: 0.6,
                    animation: 'float 4s ease-in-out infinite',
                    zIndex: 1,
                    '@keyframes float': {
                      '0%, 100%': {
                        transform: 'translateY(0px) rotate(0deg)',
                      },
                      '50%': {
                        transform: 'translateY(-15px) rotate(180deg)',
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '70%',
                    left: '15%',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: darkMode ? 'rgba(187, 134, 252, 0.4)' : 'rgba(102, 126, 234, 0.4)',
                    animation: 'floatReverse 6s ease-in-out infinite',
                    zIndex: 1,
                    '@keyframes floatReverse': {
                      '0%, 100%': {
                        transform: 'translateY(0px) translateX(0px)',
                      },
                      '33%': {
                        transform: 'translateY(-10px) translateX(10px)',
                      },
                      '66%': {
                        transform: 'translateY(5px) translateX(-5px)',
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '25%',
                    left: '85%',
                    width: '8px',
                    height: '8px',
                    border: `1px solid ${darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(102, 126, 234, 0.3)'}`,
                    borderRadius: '50%',
                    animation: 'pulse 3s ease-in-out infinite',
                    zIndex: 1,
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 0.3,
                      },
                      '50%': {
                        transform: 'scale(1.2)',
                        opacity: 0.6,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '55%',
                    right: '25%',
                    width: '3px',
                    height: '3px',
                    background: darkMode ? 'rgba(70, 130, 235, 0.5)' : 'rgba(116, 75, 162, 0.5)',
                    borderRadius: '50%',
                    animation: 'drift 8s linear infinite',
                    zIndex: 1,
                    '@keyframes drift': {
                      '0%': {
                        transform: 'translateX(0px) translateY(0px)',
                      },
                      '25%': {
                        transform: 'translateX(15px) translateY(-10px)',
                      },
                      '50%': {
                        transform: 'translateX(0px) translateY(-20px)',
                      },
                      '75%': {
                        transform: 'translateX(-15px) translateY(-10px)',
                      },
                      '100%': {
                        transform: 'translateX(0px) translateY(0px)',
                      },
                    },
                  }}
                />

                <Box display="flex" alignItems="center" mb={3} sx={{ position: 'relative', zIndex: 2 }}>
                  <Timeline sx={{ mr: 2, color: darkMode ? '#BB86FC' : '#667eea', fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : '#333' }}>
                    {t('dashboard.monthlyTrend')}
                  </Typography>
                </Box>
                <Box sx={{ height: 360, position: 'relative', zIndex: 2 }}>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(102, 126, 234, 0.9)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: darkMode ? '#BB86FC' : '#667eea',
                          borderWidth: 1,
                          cornerRadius: 12,
                          displayColors: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: darkMode ? '#ccc' : '#666',
                            font: {
                              size: 12,
                              weight: 'bold',
                            },
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          },
                          ticks: {
                            color: darkMode ? '#ccc' : '#666',
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Fade in={true} timeout={1800}>
              <Paper
                sx={{
                  p: 4,
                  height: 480,
                  borderRadius: '24px',
                  background: darkMode
                    ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  boxShadow: darkMode
                    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                    : '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode
                      ? '0 30px 60px rgba(0, 0, 0, 0.4)'
                      : '0 30px 60px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Category sx={{ mr: 2, color: darkMode ? '#BB86FC' : '#667eea', fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: darkMode ? 'white' : '#333' }}>
                    {t('dashboard.categoryBreakdown')}
                  </Typography>
                </Box>
                <Box sx={{ height: 360 }}>
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right' as const,
                          labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                              size: 13,
                              weight: 'bold',
                            },
                            color: darkMode ? '#ccc' : '#333',
                            boxWidth: 15,
                            boxHeight: 15,
                          },
                        },
                        tooltip: {
                          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          cornerRadius: 12,
                          displayColors: true,
                        },
                      },
                      layout: {
                        padding: {
                          right: 20,
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Recent Expenses */}
          <Grid item xs={12}>
            <Fade in={true} timeout={2000}>
              <Paper
                sx={{
                  borderRadius: '24px',
                  background: darkMode
                    ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                  boxShadow: darkMode
                    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                    : '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Decorative Background Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '200px',
                    height: '200px',
                    background: darkMode
                      ? 'radial-gradient(circle, rgba(187, 134, 252, 0.1) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                    zIndex: 0,
                  }}
                />
                
                {/* Header Section */}
                <Box
                  sx={{
                    p: 3,
                    background: darkMode
                      ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '3px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          mr: 2,
                        }}
                      >
                        <Receipt sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.2 }}>
                          {t('dashboard.recentExpenses')}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                          {t('dashboard.recentExpensesSubtitle')}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${summary.recentExpenses.length} ${t('dashboard.items')}`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        height: '28px',
                      }}
                    />
                  </Box>
                </Box>

                {/* Expenses List */}
                <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  {summary.recentExpenses.map((expense, index) => (
                    <Grow key={expense._id} in={true} timeout={1000 + index * 150}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          mb: 1.5,
                          borderRadius: '16px',
                          background: darkMode
                            ? (index % 2 === 0 
                                ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.08) 0%, rgba(187, 134, 252, 0.03) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)')
                            : (index % 2 === 0
                                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(102, 126, 234, 0.03) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 255, 0.6) 100%)'),
                          border: `1px solid ${darkMode 
                            ? (index % 2 === 0 ? 'rgba(187, 134, 252, 0.1)' : 'rgba(255, 255, 255, 0.05)')
                            : (index % 2 === 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.3)')}`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: '70px',
                          '&:hover': {
                            transform: 'translateX(8px) scale(1.01)',
                            background: darkMode
                              ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.15) 0%, rgba(187, 134, 252, 0.08) 100%)'
                              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.08) 100%)',
                            boxShadow: darkMode
                              ? '0 8px 24px rgba(187, 134, 252, 0.2)'
                              : '0 8px 24px rgba(102, 126, 234, 0.2)',
                            '&::before': {
                              opacity: 1,
                            }
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '3px',
                            background: darkMode ? '#BB86FC' : '#667eea',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }
                        }}
                      >
                        {/* Left Side - Avatar and Details */}
                        <Box display="flex" alignItems="center" flex={1}>
                          <Box
                            sx={{
                              position: 'relative',
                              mr: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                background: darkMode
                                  ? 'linear-gradient(135deg, #BB86FC 0%, #9C27B0 100%)'
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: darkMode
                                  ? '0 4px 12px rgba(187, 134, 252, 0.3)'
                                  : '0 4px 12px rgba(102, 126, 234, 0.3)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <Receipt sx={{ fontSize: 20 }} />
                            </Avatar>
                            {/* Category Indicator Dot */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -1,
                                right: -1,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: '#4CAF50',
                                border: `2px solid ${darkMode ? '#1e1e1e' : '#ffffff'}`,
                                boxShadow: '0 1px 4px rgba(76, 175, 80, 0.4)',
                              }}
                            />
                          </Box>
                          
                          <Box flex={1}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: darkMode ? 'white' : '#333',
                                mb: 0.3,
                                fontSize: '0.95rem',
                                lineHeight: 1.2,
                              }}
                            >
                              {expense.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                              <Chip
                                label={t(`expenses.categories.${expense.category.toLowerCase()}`, expense.category)}
                                size="small"
                                sx={{
                                  background: darkMode
                                    ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.2) 0%, rgba(187, 134, 252, 0.1) 100%)'
                                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(102, 126, 234, 0.1) 100%)',
                                  color: darkMode ? '#BB86FC' : '#667eea',
                                  fontWeight: '600',
                                  borderRadius: '8px',
                                  height: '22px',
                                  fontSize: '0.7rem',
                                  border: `1px solid ${darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(102, 126, 234, 0.3)'}`,
                                  '& .MuiChip-label': {
                                    px: 1.5,
                                  }
                                }}
                              />
                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    bgcolor: darkMode ? '#888' : '#999',
                                    mr: 0.8,
                                  }}
                                />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: darkMode ? '#ccc' : '#666',
                                    fontWeight: '500',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        {/* Right Side - Amount */}
                        <Box textAlign="right" sx={{ minWidth: '100px' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              textShadow: '0 1px 2px rgba(231, 76, 60, 0.2)',
                              fontSize: '1.1rem',
                              lineHeight: 1.2,
                              position: 'relative',
                            }}
                          >
                            ¥{expense.amount.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: darkMode ? '#888' : '#999',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px',
                              fontSize: '0.65rem',
                            }}
                          >
                            {t('dashboard.amount')}
                          </Typography>
                        </Box>

                        {/* Hover Effect Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '40px',
                            height: '100%',
                            background: darkMode
                              ? 'linear-gradient(90deg, transparent 0%, rgba(187, 134, 252, 0.1) 100%)'
                              : 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.1) 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                          }}
                          className="hover-overlay"
                        />
                      </Box>
                    </Grow>
                  ))}

                  {/* Empty State */}
                  {summary.recentExpenses.length === 0 && (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 6,
                        color: darkMode ? '#888' : '#999',
                      }}
                    >
                      <Receipt sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {t('dashboard.noRecentExpenses')}
                      </Typography>
                      <Typography variant="body2">
                        {t('dashboard.expenseHistoryWillAppear')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;