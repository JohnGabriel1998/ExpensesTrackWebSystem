import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  GridLegacy as Grid,
  Chip,
  CircularProgress,
  Avatar,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  CurrencyYen,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../config/api';
import { Expense, ExpenseCategory } from '../types';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const categories: ExpenseCategory[] = [
  'Rent',
  'Gas',
  'Water',
  'Electric',
  'Food',
  'Shopping',
  'Transportation',
  'MoneyTransfer',
  'CreditCard',
  'Others',
];

const categoryColors: Record<ExpenseCategory, string> = {
  'Rent': '#6366f1',
  'Gas': '#ef4444',
  'Water': '#06b6d4',
  'Electric': '#f59e0b',
  'Food': '#10b981',
  'Shopping': '#8b5cf6',
  'Transportation': '#f97316',
  'MoneyTransfer': '#ec4899',
  'CreditCard': '#84cc16',
  'Others': '#64748b',
};

const Expenses: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { darkMode } = useCustomTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (categoryFilter) params.category = categoryFilter;
      if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

      const response = await api.get('/api/expenses', { params });
      
      setExpenses(response.data.expenses);
      setTotalExpenses(response.data.totalExpenses);
    } catch (error) {
      toast.error(t('expenses.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, categoryFilter, startDate, endDate, t]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t('expenses.confirmDelete'))) {
      try {
        await api.delete(`/api/expenses/${id}`);
        toast.success(t('expenses.deleteSuccess'));
        fetchExpenses();
      } catch (error) {
        toast.error(t('expenses.deleteError'));
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setStartDate(null);
    setEndDate(null);
  };

  if (loading && expenses.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
              '50%': { transform: 'scale(1.1)', opacity: 1 }
            }
          }}
        >
          <ReceiptIcon sx={{ fontSize: 36, color: 'white' }} />
        </Box>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{
            color: '#6366f1',
            mb: 2,
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            fontWeight: 600,
          }}
        >
          {t('expenses.loadingExpenses')}
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container 
        maxWidth="xl" 
        sx={{
          py: 3,
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
          <Box 
            sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
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
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
                }}
              >
                <ReceiptIcon sx={{ color: 'white', fontSize: 28 }} />
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
                  {t('expenses.manager')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 500,
                  }}
                >
                  {t('expenses.managerSubtitle')}
                </Typography>
              </Box>
            </Box>
            
            <Zoom in={true} timeout={600}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/expenses/add')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
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
                  }
                }}
              >
                {t('expenses.addNewExpense')}
              </Button>
            </Zoom>
          </Box>

          {/* Filters Section */}
          <Fade in={true} timeout={800}>
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3,
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: showFilters ? 3 : 0 }}>
                <IconButton 
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    mr: 2,
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: darkMode 
                        ? '0 4px 12px rgba(99, 102, 241, 0.3)' 
                        : '0 4px 12px rgba(99, 102, 241, 0.2)',
                    }
                  }}
                >
                  <FilterIcon sx={{ color: '#6366f1' }} />
                </IconButton>
                
                <Typography 
                  variant="h6" 
                  sx={{
                    fontWeight: 700,
                    color: darkMode ? '#ffffff' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SearchIcon sx={{ color: '#6366f1' }} />
                  {t('expenses.advancedFilters')}
                </Typography>
                
                {(categoryFilter || startDate || endDate) && (
                  <Button 
                    size="small" 
                    onClick={clearFilters} 
                    startIcon={<ClearIcon />}
                    sx={{ 
                      ml: 3,
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: darkMode
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      '&:hover': {
                        background: darkMode
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                      }
                    }}
                  >
                    {t('expenses.clearAllFilters')}
                  </Button>
                )}
              </Box>

              {showFilters && (
                <Fade in={showFilters} timeout={500}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        fullWidth
                        label={t('expenses.category')}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                            }
                          }
                        }}
                      >
                        <MenuItem value="">{t('expenses.allCategories')}</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: categoryColors[category],
                                }}
                              />
                              {t(`expenses.categories.${category.toLowerCase()}`)}
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label={t('expenses.startDate')}
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#6366f1',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label={t('expenses.endDate')}
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate || undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#6366f1',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Fade>
              )}
            </Paper>
          </Fade>

          {/* Expenses Table */}
          <Fade in={true} timeout={1000}>
            <TableContainer 
              component={Paper}
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
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background: darkMode
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                      '& .MuiTableCell-head': {
                        borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        py: 2.5,
                        px: 3,
                      }
                    }}
                  >
                    <TableCell>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          fontSize: '0.95rem'
                        }}
                      >
                        {t('expenses.expenseDetails')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          fontSize: '0.95rem'
                        }}
                      >
                        {t('expenses.category')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          fontSize: '0.95rem'
                        }}
                      >
                        {t('expenses.date')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          fontSize: '0.95rem'
                        }}
                      >
                        {t('expenses.amount')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 700,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          fontSize: '0.95rem'
                        }}
                      >
                        {t('expenses.actions')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense, index) => (
                    <Fade in={true} timeout={300 + (index * 100)} key={expense._id}>
                      <TableRow
                        sx={{
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: darkMode
                              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                            transform: 'translateX(4px)',
                          },
                          '& .MuiTableCell-body': {
                            borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                            py: 2,
                            px: 3,
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                background: `linear-gradient(135deg, ${categoryColors[expense.category]} 0%, ${categoryColors[expense.category]}dd 100%)`,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: `0 4px 12px ${categoryColors[expense.category]}40`,
                              }}
                            >
                              {expense.category.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: darkMode ? '#ffffff' : '#1e293b',
                                  mb: 0.5,
                                }}
                              >
                                {expense.title}
                              </Typography>
                              {expense.description && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                    display: 'block',
                                    maxWidth: 200,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {expense.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={t(`expenses.categories.${expense.category.toLowerCase()}`, expense.category)} 
                            size="small"
                            sx={{
                              background: `linear-gradient(135deg, ${categoryColors[expense.category] || '#64748b'}20 0%, ${categoryColors[expense.category] || '#64748b'}30 100%)`,
                              color: categoryColors[expense.category] || '#64748b',
                              border: `1px solid ${categoryColors[expense.category] || '#64748b'}40`,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              '& .MuiChip-label': {
                                px: 1.5,
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                              fontWeight: 500,
                            }}
                          >
                            {format(new Date(expense.date), 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              px: 2,
                              py: 1,
                              borderRadius: '8px',
                              background: darkMode
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <CurrencyYen sx={{ fontSize: 18, color: '#10b981' }} />
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#10b981',
                                fontSize: '1rem',
                              }}
                            >
                              {expense.amount.toFixed(2)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/expenses/edit/${expense._id}`)}
                              sx={{
                                borderRadius: '8px',
                                background: darkMode
                                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)'
                                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                }
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(expense._id)}
                              sx={{
                                borderRadius: '8px',
                                background: darkMode
                                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalExpenses}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
                  '& .MuiTablePagination-toolbar': {
                    px: 3,
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    fontWeight: 500,
                  },
                  '& .MuiIconButton-root': {
                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    '&:hover': {
                      background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    }
                  }
                }}
              />
            </TableContainer>
          </Fade>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default Expenses;