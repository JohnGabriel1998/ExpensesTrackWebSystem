import React, { useState, useEffect, useCallback } from 'react';
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
  Fade,
  Zoom,
  IconButton,
  GridLegacy as Grid,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  MonetizationOn as SalaryIcon,
  ArrowBack,
  Save as SaveIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import api from '../config/api';
import { Salary } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SalaryFormData {
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    food: number;
    other: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    pension: number;
    other: number;
  };
  month: number;
  year: number;
  payDate: Date;
  notes?: string;
}

const SalarySlip: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<SalaryFormData>({
    defaultValues: {
      basicSalary: 0,
      allowances: { housing: 0, transport: 0, food: 0, other: 0 },
      deductions: { tax: 0, insurance: 0, pension: 0, other: 0 },
      month: new Date().getMonth() === 0 ? 12 : new Date().getMonth(), // Previous month
      year: new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(), // Adjust year if previous month is December
      payDate: new Date(),
      notes: ''
    },
  });

  const watchedValues = watch();

  // Load salary data if editing
  const loadSalaryData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/salary/${id}`);
      const salary: Salary = response.data.data;

      setValue('basicSalary', salary.basicSalary);
      setValue('allowances', salary.allowances);
      setValue('deductions', salary.deductions);
      setValue('month', salary.month);
      setValue('year', salary.year);
      setValue('payDate', new Date(salary.payDate));
      setValue('notes', salary.notes || '');
    } catch (error) {
      toast.error(t('salary.addError'));
      navigate('/salary');
    } finally {
      setLoading(false);
    }
  }, [id, setValue, navigate, t]);

  // Calculate gross and net salary whenever form values change
  useEffect(() => {
    const basic = watchedValues.basicSalary || 0;
    const allowances = watchedValues.allowances || {};
    const deductions = watchedValues.deductions || {};

    const gross = basic + 
      (allowances.housing || 0) + 
      (allowances.transport || 0) + 
      (allowances.food || 0) + 
      (allowances.other || 0);

    const totalDeductions = 
      (deductions.tax || 0) + 
      (deductions.insurance || 0) + 
      (deductions.pension || 0) + 
      (deductions.other || 0);

    const net = gross - totalDeductions;

    setGrossSalary(gross);
    setNetSalary(net);
  }, [watchedValues]);

  // Load salary data if editing
  useEffect(() => {
    if (isEdit && id) {
      loadSalaryData();
    }
  }, [isEdit, id, loadSalaryData]);

  const onSubmit = async (data: SalaryFormData) => {
    try {
      // Check if the selected month/year is not in the future
      const selectedDate = new Date(data.year, data.month - 1);
      const currentDate = new Date();
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());
      
      if (selectedDate >= currentMonth) {
        toast.error(t('salary.previousMonthOnly'));
        return;
      }

      const url = isEdit ? `/api/salary/${id}` : '/api/salary';
      const method = isEdit ? 'put' : 'post';
      
      await api[method](url, data);
      
      toast.success(isEdit ? t('salary.updateSuccess') : t('salary.addSuccess'));
      navigate('/salary');
    } catch (error: any) {
      const message = error.response?.data?.message || t('salary.addError');
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>{t('salary.loadingSalary')}</Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                onClick={() => navigate('/salary')}
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: darkMode 
                      ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                      : '0 4px 12px rgba(16, 185, 129, 0.2)',
                  }
                }}
              >
                <ArrowBack sx={{ color: '#10b981' }} />
              </IconButton>

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
                  {isEdit ? t('salary.editSlip') : t('salary.addSlip')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 500,
                  }}
                >
                  {isEdit ? t('salary.updateSalary') : t('salary.recordSalary')}
                </Typography>
              </Box>
            </Box>
          </Fade>

          <Grid container spacing={3}>
            {/* Form Section */}
            <Grid item xs={12} md={8}>
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
                    <Grid container spacing={3}>
                      {/* Basic Information */}
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                          {t('salary.form.basicInfo')}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label={t('salary.form.month')}
                          type="number"
                          inputProps={{ min: 1, max: 12 }}
                          {...register('month', { 
                            required: 'Month is required',
                            min: { value: 1, message: 'Month must be between 1-12' },
                            max: { value: 12, message: 'Month must be between 1-12' }
                          })}
                          error={!!errors.month}
                          helperText={errors.month?.message || t('salary.form.monthHelper')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label={t('salary.form.year')}
                          type="number"
                          inputProps={{ min: 2020, max: new Date().getFullYear() }}
                          {...register('year', { 
                            required: 'Year is required',
                            min: { value: 2020, message: 'Year must be valid' },
                            max: { value: new Date().getFullYear(), message: 'Cannot add salary for future years' }
                          })}
                          error={!!errors.year}
                          helperText={errors.year?.message || t('salary.form.yearHelper')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="payDate"
                          control={control}
                          rules={{ required: 'Pay date is required' }}
                          render={({ field }) => (
                            <DatePicker
                              label={t('salary.form.payDate')}
                              value={field.value}
                              onChange={(newValue) => field.onChange(newValue)}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors.payDate,
                                  helperText: errors.payDate?.message,
                                  sx: {
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                    }
                                  }
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Basic Salary */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                          {t('salary.form.salaryDetails')}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={t('salary.form.basicSalary')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('basicSalary', { 
                            required: 'Basic salary is required',
                            min: { value: 0, message: 'Salary must be positive' }
                          })}
                          error={!!errors.basicSalary}
                          helperText={errors.basicSalary?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      {/* Allowances */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                          {t('salary.form.allowances')}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.housingAllowance')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('allowances.housing')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.transportAllowance')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('allowances.transport')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.foodAllowance')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('allowances.food')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.otherAllowances')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('allowances.other')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      {/* Deductions */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                          {t('salary.form.deductions')}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.taxDeduction')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('deductions.tax')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.insurance')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('deductions.insurance')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.pension')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('deductions.pension')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('salary.form.otherDeductions')}
                          type="number"
                          inputProps={{ step: '0.01', min: 0 }}
                          {...register('deductions.other')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                            }
                          }}
                        />
                      </Grid>

                      {/* Notes */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label={t('salary.form.notes')}
                          placeholder={t('salary.form.notesPlaceholder')}
                          {...register('notes')}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
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
                            onClick={() => navigate('/salary')}
                            disabled={isSubmitting}
                            sx={{
                              borderRadius: '12px',
                              px: 4,
                              py: 1.5,
                              textTransform: 'none',
                              fontSize: '1rem',
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            startIcon={<SaveIcon />}
                            sx={{
                              borderRadius: '12px',
                              px: 4,
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
                            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Salary' : 'Save Salary')}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>

            {/* Summary Card */}
            <Grid item xs={12} md={4}>
              <Zoom in={true} timeout={1000}>
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
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                      {t('salary.summary.title')}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.summary.grossSalary')}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
                        ¥{grossSalary.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.summary.netSalary')}
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#059669', fontWeight: 700 }}>
                        ¥{netSalary.toLocaleString()}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.form.basicSalary')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 600 }}>
                        ¥{(watchedValues.basicSalary || 0).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.summary.totalAllowances')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                        +¥{(
                          (watchedValues.allowances?.housing || 0) +
                          (watchedValues.allowances?.transport || 0) +
                          (watchedValues.allowances?.food || 0) +
                          (watchedValues.allowances?.other || 0)
                        ).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {t('salary.summary.totalDeductions')}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                        -¥{(
                          (watchedValues.deductions?.tax || 0) +
                          (watchedValues.deductions?.insurance || 0) +
                          (watchedValues.deductions?.pension || 0) +
                          (watchedValues.deductions?.other || 0)
                        ).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default SalarySlip;
