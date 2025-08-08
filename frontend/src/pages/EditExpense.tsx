// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useForm, Controller } from 'react-hook-form';
// import {
//   Container,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   MenuItem,
//   Grid,
//   CircularProgress,
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { toast } from 'react-toastify';
// import api from '../config/api';
// import { ExpenseCategory } from '../types';

// const categories: ExpenseCategory[] = [
//   'Food & Dining',
//   'Transportation',
//   'Shopping',
//   'Entertainment',
//   'Bills & Utilities',
//   'Healthcare',
//   'Education',
//   'Travel',
//   'Other',
// ];

// interface ExpenseFormData {
//   title: string;
//   amount: number;
//   category: ExpenseCategory;
//   date: Date;
//   description?: string;
// }

// const EditExpense: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [loading, setLoading] = useState(true);
  
//   const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>();

//   useEffect(() => {
//     fetchExpense();
//   }, [id]);

//   const fetchExpense = async () => {
//     try {
//       const response = await api.get(`/api/expenses/${id}`);
//       const expense = response.data.expense;
      
//       reset({
//         title: expense.title,
//         amount: expense.amount,
//         category: expense.category,
//         date: new Date(expense.date),
//         description: expense.description || '',
//       });
//     } catch (error) {
//       toast.error('Failed to fetch expense');
//       navigate('/expenses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: ExpenseFormData) => {
//     try {
//       await api.put(`/api/expenses/${id}`, data);
//       toast.success('Expense updated successfully');
//       navigate('/expenses');
//     } catch (error) {
//       toast.error('Failed to update expense');
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Container maxWidth="sm">
//         <Paper sx={{ p: 4, mt: 4 }}>
//           <Typography variant="h4" gutterBottom>
//             Edit Expense
//           </Typography>
          
//           <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Title"
//                   {...register('title', { required: 'Title is required' })}
//                   error={!!errors.title}
//                   helperText={errors.title?.message}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Amount"
//                   type="number"
//                   inputProps={{ step: '0.01' }}
//                   {...register('amount', {
//                     required: 'Amount is required',
//                     min: { value: 0.01, message: 'Amount must be greater than 0' },
//                   })}
//                   error={!!errors.amount}
//                   helperText={errors.amount?.message}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Category"
//                   defaultValue=""
//                   {...register('category', { required: 'Category is required' })}
//                   error={!!errors.category}
//                   helperText={errors.category?.message}
//                 >
//                   {categories.map((category) => (
//                     <MenuItem key={category} value={category}>
//                       {category}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               <Grid item xs={12}>
//                 <Controller
//                   name="date"
//                   control={control}
//                   rules={{ required: 'Date is required' }}
//                   render={({ field }) => (
//                     <DatePicker
//                       label="Date"
//                       value={field.value}
//                       onChange={(newValue) => field.onChange(newValue)}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           fullWidth
//                           error={!!errors.date}
//                           helperText={errors.date?.message}
//                         />
//                       )}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   label="Description (optional)"
//                   {...register('description')}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => navigate('/expenses')}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     disabled={isSubmitting}
//                   >
//                     Update Expense
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </LocalizationProvider>
//   );
// };

// export default EditExpense;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  GridLegacy as Grid,
  CircularProgress,
  Avatar,
  Fade,
  Zoom,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack,
  Receipt as ReceiptIcon,
  CurrencyYen,
  Category as CategoryIcon,
  CalendarToday,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import api from '../config/api';
import { ExpenseCategory } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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

const categoryColors: Record<string, string> = {
  'Rent': '#8b5cf6',
  'Gas': '#06b6d4',
  'Water': '#3b82f6',
  'Electric': '#f59e0b',
  'Food': '#10b981',
  'Shopping': '#ef4444',
  'Transportation': '#f97316',
  'MoneyTransfer': '#ec4899',
  'CreditCard': '#8b5cf6',
  'Others': '#6b7280',
};

interface ExpenseFormData {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
}

const EditExpense: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/api/expenses/${id}`);
        const expense = response.data.expense;
        
        reset({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: new Date(expense.date),
          description: expense.description || '',
        });
      } catch (error) {
        toast.error(t('expenses.messages.fetchError'));
        navigate('/expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, reset, navigate, t]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await api.put(`/api/expenses/${id}`, data);
      toast.success(t('expenses.messages.updateSuccess'));
      navigate('/expenses');
    } catch (error) {
      toast.error(t('expenses.messages.updateError'));
    }
  };

  if (loading) {
    return (
      <Container 
        maxWidth="md" 
        sx={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.3) 100%)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60}
            sx={{
              color: '#6366f1',
              mb: 2,
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: darkMode ? '#ffffff' : '#1e293b',
              fontWeight: 600,
            }}
          >
            {t('expenses.messages.loading')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container 
        maxWidth="md" 
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
              <IconButton
                onClick={() => navigate('/expenses')}
                sx={{
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
                <ArrowBack sx={{ color: '#6366f1' }} />
              </IconButton>

              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                }}
              >
                <EditIcon sx={{ color: 'white', fontSize: 28 }} />
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
                  {t('expenses.editExpense')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 500,
                  }}
                >
                  {t('expenses.updateRecord')}
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Form Section */}
          <Zoom in={true} timeout={800}>
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
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  {/* Title Field */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <ReceiptIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1e293b',
                        }}
                      >
                        {t('expenses.form.title')}
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      label={t('expenses.form.enterTitle')}
                      placeholder={t('expenses.form.titlePlaceholder')}
                      {...register('title', { required: t('expenses.validation.titleRequired') })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
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
                    />
                  </Grid>

                  {/* Amount and Category Row */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
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
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1e293b',
                        }}
                      >
                        {t('expenses.form.amount')}
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      label={t('expenses.form.enterAmount')}
                      type="number"
                      placeholder="0.00"
                      inputProps={{ step: '0.01' }}
                      {...register('amount', {
                        required: t('expenses.validation.amountRequired'),
                        min: { value: 0.01, message: t('expenses.validation.amountMinimum') },
                      })}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
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

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <CategoryIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1e293b',
                        }}
                      >
                        {t('expenses.form.category')}
                      </Typography>
                    </Box>
                    <TextField
                      select
                      fullWidth
                      label={t('expenses.form.selectCategory')}
                      defaultValue=""
                      {...register('category', { required: t('expenses.validation.categoryRequired') })}
                      error={!!errors.category}
                      helperText={errors.category?.message}
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
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

                  {/* Date Field */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1e293b',
                        }}
                      >
                        {t('expenses.form.date')}
                      </Typography>
                    </Box>
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: t('expenses.validation.dateRequired') }}
                      render={({ field }) => (
                        <DatePicker
                          label={t('expenses.form.selectDate')}
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.date,
                              helperText: errors.date?.message,
                              sx: {
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
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Description Field */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                          fontSize: '1rem',
                        }}
                      >
                        <DescriptionIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1e293b',
                        }}
                      >
                        {t('expenses.form.description')}
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={t('expenses.form.addDescription')}
                      placeholder={t('expenses.form.descriptionPlaceholder')}
                      {...register('description')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                          '& fieldset': {
                            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#64748b',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#64748b',
                          }
                        }
                      }}
                    />
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/expenses')}
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          border: `2px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                          color: darkMode ? '#ffffff' : '#1e293b',
                          '&:hover': {
                            border: `2px solid ${darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}`,
                            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          }
                        }}
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 600,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #e99307 0%, #b45309 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 24px rgba(245, 158, 11, 0.4)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                            transform: 'none',
                            boxShadow: 'none',
                          }
                        }}
                      >
                        {isSubmitting ? t('expenses.buttons.updating') : t('expenses.buttons.updateExpense')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Zoom>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default EditExpense;