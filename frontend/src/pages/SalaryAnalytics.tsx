import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  GridLegacy as Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp,
  TrendingDown,
  Savings as SavingsIcon,
  MonetizationOn,
  AccountBalance,
  ShoppingCart,
  Lightbulb,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../config/api';
import { useTheme } from '../contexts/ThemeContext';

interface AnalyticsData {
  monthlyTrends: {
    month: number;
    year: number;
    salary: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  }[];
  currentMonth: {
    salary: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  };
  summary: {
    totalSalary: number;
    totalExpenses: number;
    totalSavings: number;
    averageSavingsRate: number;
  };
  expensesByCategory: { [key: string]: number };
  suggestions: string[];
}

const SalaryAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      // Use the new dashboard-style analytics endpoint
      const response = await api.get('/api/salary/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      toast.error(t('salary.addError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: JSX.Element } = {
      food: <ShoppingCart sx={{ color: '#f59e0b' }} />,
      transport: <AccountBalance sx={{ color: '#06b6d4' }} />,
      entertainment: <MonetizationOn sx={{ color: '#8b5cf6' }} />,
      utilities: <AccountBalance sx={{ color: '#10b981' }} />,
      healthcare: <CheckCircle sx={{ color: '#ef4444' }} />,
      shopping: <ShoppingCart sx={{ color: '#f97316' }} />,
    };
    return icons[category.toLowerCase()] || <MonetizationOn sx={{ color: '#6b7280' }} />;
  };

  const getSavingsLevel = (percentage: number) => {
    if (percentage >= 30) return { level: 'Excellent', color: '#10b981', icon: <CheckCircle /> };
    if (percentage >= 20) return { level: 'Good', color: '#06b6d4', icon: <TrendingUp /> };
    if (percentage >= 10) return { level: 'Fair', color: '#f59e0b', icon: <Warning /> };
    return { level: 'Low', color: '#ef4444', icon: <TrendingDown /> };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>{t('salary.loadingSalary')}</Typography>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No analytics data available. Please add salary and expense records first.
        </Alert>
      </Container>
    );
  }

  const savingsInfo = getSavingsLevel(analytics.currentMonth.savingsRate);

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
              justifyContent: 'space-between',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
              </Box>

              <Box>
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
                  {t('salary.analytics.title')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 500,
                  }}
                >
                  {t('salary.analytics.subtitle')}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/salary')}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                border: `2px solid ${darkMode ? '#ffffff' : '#1e293b'}`,
                color: darkMode ? '#ffffff' : '#1e293b',
                '&:hover': {
                  border: `2px solid ${darkMode ? '#e2e8f0' : '#475569'}`,
                  background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 41, 59, 0.1)',
                }
              }}
            >
              {t('salary.analytics.backToSalary')}
            </Button>
          </Box>
        </Fade>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={800}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MonetizationOn sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.currentSalary')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                        ¥{analytics.currentMonth.salary.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={900}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShoppingCart sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.currentExpenses')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                        ¥{analytics.currentMonth.expenses.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={1000}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${savingsInfo.color} 0%, ${savingsInfo.color}CC 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SavingsIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.currentSavings')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                        ¥{analytics.currentMonth.savings.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Zoom in={true} timeout={1100}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${savingsInfo.color} 0%, ${savingsInfo.color}CC 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {savingsInfo.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.savingsRate')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                          {analytics.currentMonth.savingsRate.toFixed(1)}%
                        </Typography>
                        <Chip
                          label={savingsInfo.level}
                          size="small"
                          sx={{
                            background: savingsInfo.color,
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Savings Progress */}
        <Zoom in={true} timeout={1200}>
          <Card
            sx={{
              mb: 4,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                {t('salary.analytics.financialOverview')}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                    {t('salary.analytics.expensesVsIncome')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                    {((analytics.currentMonth.expenses / analytics.currentMonth.salary) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(analytics.currentMonth.expenses / analytics.currentMonth.salary) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                    Savings Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                    {analytics.currentMonth.savingsRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={analytics.currentMonth.savingsRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${savingsInfo.color} 0%, ${savingsInfo.color}CC 100%)`,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        <Grid container spacing={3}>
          {/* Expense Breakdown */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1300}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                  height: 'fit-content',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                    {t('salary.analytics.expenseBreakdown')}
                  </Typography>
                  
                  {Object.keys(analytics.expensesByCategory).length === 0 ? (
                    <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)', textAlign: 'center', py: 2 }}>
                      {t('salary.analytics.noExpensesRecorded')}
                    </Typography>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {Object.entries(analytics.expensesByCategory).map(([category, amount], index) => (
                        <ListItem 
                          key={category}
                          sx={{ 
                            px: 0,
                            borderBottom: index === Object.entries(analytics.expensesByCategory).length - 1 
                              ? 'none' 
                              : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getCategoryIcon(category)}
                          </ListItemIcon>
                          <ListItemText
                            primary={t(`expenses.categories.${category.toLowerCase()}`) || category.charAt(0).toUpperCase() + category.slice(1)}
                            secondary={`${analytics.currentMonth.expenses > 0 ? ((amount / analytics.currentMonth.expenses) * 100).toFixed(1) : 0}${t('salary.analytics.percentOfTotal')}`}
                            primaryTypographyProps={{
                              color: darkMode ? '#ffffff' : '#1e293b',
                              fontWeight: 600,
                            }}
                            secondaryTypographyProps={{
                              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                            }}
                          />
                          <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                            ¥{amount.toLocaleString()}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Savings Suggestions */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1400}>
              <Card
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: '16px',
                  height: 'fit-content',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lightbulb sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                      {t('salary.analytics.smartSavingsTips')}
                    </Typography>
                  </Box>
                  
                  {analytics.suggestions.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: '12px' }}>
                      {t('salary.analytics.balancedSpending')}
                    </Alert>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {analytics.suggestions.map((suggestion, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            px: 0,
                            borderBottom: index === analytics.suggestions.length - 1 
                              ? 'none' 
                              : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Lightbulb sx={{ color: '#f59e0b', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{
                              color: darkMode ? '#ffffff' : '#1e293b',
                              fontWeight: 500,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Salary vs Expenses Comparison Chart */}
        <Zoom in={true} timeout={1400}>
          <Card
            sx={{
              mt: 4,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                  {t('salary.analytics.salaryVsExpenses')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Total Summary Cards */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
                    {/* Total Salary Card */}
                    <Box
                      sx={{
                        background: darkMode
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                        border: '2px solid #10b981',
                        borderRadius: '16px',
                        p: 3,
                        textAlign: 'center',
                        minWidth: 200,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#10b981', 
                          fontWeight: 700,
                          mb: 1
                        }}
                      >
                        {t('salary.analytics.totalSalary')}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: darkMode ? '#ffffff' : '#1e293b', 
                          fontWeight: 700
                        }}
                      >
                        ¥{analytics.currentMonth.salary.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Total Expenses Card */}
                    <Box
                      sx={{
                        background: darkMode
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                        border: '2px solid #ef4444',
                        borderRadius: '16px',
                        p: 3,
                        textAlign: 'center',
                        minWidth: 200,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#ef4444', 
                          fontWeight: 700,
                          mb: 1
                        }}
                      >
                        {t('salary.analytics.totalExpenses')}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: darkMode ? '#ffffff' : '#1e293b', 
                          fontWeight: 700
                        }}
                      >
                        ¥{analytics.currentMonth.expenses.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Chart Container */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      height: 350,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                    }}
                  >
                    {/* Donut Chart */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flex: 1
                      }}
                    >
                      <Box sx={{ position: 'relative', width: 250, height: 250 }}>
                        <svg width="250" height="250" viewBox="0 0 250 250">
                          {/* Background Circle */}
                          <circle
                            cx="125"
                            cy="125"
                            r="90"
                            fill="none"
                            stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                            strokeWidth="30"
                          />
                          
                          {/* Salary Arc */}
                          <circle
                            cx="125"
                            cy="125"
                            r="90"
                            fill="none"
                            stroke="url(#salaryGradient)"
                            strokeWidth="30"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 90 * 0.6} ${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90 * 0.25}`}
                            transform="rotate(-90 125 125)"
                            style={{
                              transition: 'stroke-dasharray 1.5s ease-out',
                              filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
                            }}
                          />
                          
                          {/* Expenses Arc */}
                          <circle
                            cx="125"
                            cy="125"
                            r="90"
                            fill="none"
                            stroke="url(#expenseGradient)"
                            strokeWidth="30"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 90 * (analytics.currentMonth.salary > 0 ? (analytics.currentMonth.expenses / analytics.currentMonth.salary) * 0.6 : 0)} ${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90 * (0.25 - 0.6)}`}
                            transform="rotate(-90 125 125)"
                            style={{
                              transition: 'stroke-dasharray 1.5s ease-out',
                              filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))'
                            }}
                          />
                          
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="salaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Center Content */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                          }}
                        >
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              color: analytics.currentMonth.savings > 0 ? '#10b981' : '#ef4444',
                              fontWeight: 700,
                              mb: 1
                            }}
                          >
                            {analytics.currentMonth.salary > 0 
                              ? `${analytics.currentMonth.savingsRate.toFixed(0)}%`
                              : '0%'}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                              fontWeight: 600
                            }}
                          >
                            {t('salary.analytics.savingsRateLabel')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Legend and Values */}
                    <Box sx={{ flex: 1, pl: 4 }}>
                      {/* Salary Legend */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            mr: 2,
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: darkMode ? '#ffffff' : '#1e293b', 
                              fontWeight: 600 
                            }}
                          >
                            {t('salary.analytics.totalSalary')}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#10b981', 
                              fontWeight: 700 
                            }}
                          >
                            ¥{analytics.currentMonth.salary.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Expenses Legend */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            mr: 2,
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: darkMode ? '#ffffff' : '#1e293b', 
                              fontWeight: 600 
                            }}
                          >
                            {t('salary.analytics.totalExpenses')}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#ef4444', 
                              fontWeight: 700 
                            }}
                          >
                            ¥{analytics.currentMonth.expenses.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Savings Legend */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '4px',
                            background: analytics.currentMonth.savings > 0 
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            mr: 2,
                            boxShadow: `0 2px 8px rgba(${analytics.currentMonth.savings > 0 ? '16, 185, 129' : '239, 68, 68'}, 0.3)`,
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: darkMode ? '#ffffff' : '#1e293b', 
                              fontWeight: 600 
                            }}
                          >
                            {analytics.currentMonth.savings > 0 ? t('salary.analytics.positiveBalance') : t('salary.analytics.negativeBalance')}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: analytics.currentMonth.savings > 0 ? '#10b981' : '#ef4444', 
                              fontWeight: 700 
                            }}
                          >
                            ¥{Math.abs(analytics.currentMonth.savings).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Comparison Summary */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  background: analytics.currentMonth.savings > 0
                    ? (darkMode 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)')
                    : (darkMode 
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'),
                  border: `1px solid ${analytics.currentMonth.savings > 0 ? '#10b981' : '#ef4444'}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {analytics.currentMonth.savings > 0 ? (
                      <CheckCircle sx={{ color: '#10b981', mr: 2 }} />
                    ) : (
                      <Warning sx={{ color: '#ef4444', mr: 2 }} />
                    )}
                    <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {analytics.currentMonth.savings > 0 
                        ? t('salary.analytics.positiveBalance') 
                        : t('salary.analytics.negativeBalance')}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: analytics.currentMonth.savings > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 700 
                    }}
                  >
                    ¥{Math.abs(analytics.currentMonth.savings).toLocaleString()}
                  </Typography>
                </Box>
                {analytics.currentMonth.salary > 0 && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)', 
                      mt: 1 
                    }}
                  >
                    {analytics.currentMonth.savings > 0 
                      ? `${t('salary.analytics.savingsRateLabel')}: ${analytics.currentMonth.savingsRate.toFixed(1)}%`
                      : t('salary.analytics.overspendingWarning')}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Zoom>

        {/* Monthly Trends Section */}
        <Zoom in={true} timeout={1500}>
          <Card
            sx={{
              mt: 4,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: '16px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                {t('salary.analytics.monthlyFinancialTrends')}
              </Typography>
              
              <Grid container spacing={2}>
                {analytics.monthlyTrends.slice(-6).map((trend, index) => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const monthName = monthNames[trend.month - 1];
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={`${trend.year}-${trend.month}`}>
                      <Card
                        sx={{
                          p: 2,
                          background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '12px',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                          {monthName} {trend.year}
                        </Typography>
                        
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 500 }}>
                            {t('salary.analytics.salary')}
                          </Typography>
                          <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                            ¥{(trend.salary / 1000).toFixed(0)}k
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 500 }}>
                            {t('salary.analytics.expenses')}
                          </Typography>
                          <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                            ¥{(trend.expenses / 1000).toFixed(0)}k
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 500 }}>
                            {t('salary.analytics.savings')}
                          </Typography>
                          <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                            ¥{(trend.savings / 1000).toFixed(0)}k
                          </Typography>
                          <Typography variant="body2" sx={{ color: trend.savingsRate >= 20 ? '#10b981' : trend.savingsRate >= 10 ? '#f59e0b' : '#ef4444', fontSize: '0.7rem', fontWeight: 600 }}>
                            {trend.savingsRate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Summary Statistics */}
              <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <Typography variant="subtitle1" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                  {t('salary.analytics.overallSummary')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.totalSalary')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                        ¥{analytics.summary.totalSalary.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.totalExpenses')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700 }}>
                        ¥{analytics.summary.totalExpenses.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.totalSavings')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                        ¥{analytics.summary.totalSavings.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.analytics.avgSavingsRate')}
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: analytics.summary.averageSavingsRate >= 20 ? '#10b981' : analytics.summary.averageSavingsRate >= 10 ? '#f59e0b' : '#ef4444', 
                        fontWeight: 700 
                      }}>
                        {analytics.summary.averageSavingsRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    </Container>
  );
};

export default SalaryAnalytics;
