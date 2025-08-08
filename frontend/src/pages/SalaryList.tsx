import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Fade,
  Zoom,
  Card,
  CardContent,
  GridLegacy as Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonetizationOn as SalaryIcon,
  Analytics as AnalyticsIcon,
  TrendingUp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../config/api';
import { Salary } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const SalaryList: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSalaries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/salary');
      setSalaries(response.data.data);
    } catch (error) {
      toast.error(t('salary.addError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSalaries();
  }, [loadSalaries]);

  const deleteSalary = async (id: string) => {
    if (window.confirm(t('salary.confirmDelete'))) {
      try {
        await api.delete(`/api/salary/${id}`);
        toast.success(t('salary.deleteSuccess'));
        loadSalaries();
      } catch (error) {
        toast.error(t('salary.deleteError'));
      }
    }
  };

  const getMonthName = (month: number) => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return t(`salary.months.${monthKeys[month - 1]}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>{t('salary.loadingSalary')}</Typography>
      </Container>
    );
  }

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
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                }}
              >
                <SalaryIcon sx={{ color: 'white', fontSize: 28 }} />
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
                  {t('salary.title')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 500,
                  }}
                >
                  {t('salary.subtitle')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/salary-analytics')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: `2px solid #8b5cf6`,
                  color: '#8b5cf6',
                  '&:hover': {
                    border: `2px solid #7c3aed`,
                    background: 'rgba(139, 92, 246, 0.1)',
                  }
                }}
              >
                {t('salary.analyticsButton')}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/salary/add')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                  },
                }}
              >
                {t('salary.addSalary')}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Summary Cards */}
        {salaries.length > 0 && (
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
                        <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                          {t('salary.latestSalary')}
                        </Typography>
                        <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                          ¥{salaries[0]?.netSalary?.toLocaleString() || '0'}
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
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SalaryIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                          {t('salary.averageSalary')}
                        </Typography>
                        <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                          ¥{Math.round(salaries.reduce((sum, s) => sum + s.netSalary, 0) / salaries.length).toLocaleString()}
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
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
                          {salaries.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                          {t('salary.totalRecords')}
                        </Typography>
                        <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                          {salaries.length} months
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
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                          {t('salary.highestSalary')}
                        </Typography>
                        <Typography variant="h6" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 700 }}>
                          ¥{Math.max(...salaries.map(s => s.netSalary)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        )}

        {/* Salary Table */}
        <Zoom in={true} timeout={1200}>
          <Paper 
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
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.period')}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.form.basicSalary')}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.summary.grossSalary')}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.summary.netSalary')}
                    </TableCell>
                    <TableCell sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.actions')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                          {t('salary.noRecords')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    salaries.map((salary) => (
                      <TableRow 
                        key={salary._id}
                        sx={{
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                              {getMonthName(salary.month)} {salary.year}
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                              Paid: {new Date(salary.payDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                            ¥{salary.basicSalary.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ¥{salary.grossSalary.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`¥${salary.netSalary.toLocaleString()}`}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/salary/edit/${salary._id}`)}
                              sx={{
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => deleteSalary(salary._id)}
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Zoom>
      </Box>
    </Container>
  );
};

export default SalaryList;
