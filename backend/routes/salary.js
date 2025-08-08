const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Salary = require('../models/Salary');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   GET /api/salary
// @desc    Get all salary records for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const salaries = await Salary.find({ user: req.user.id })
      .sort({ year: -1, month: -1 });
    
    res.json({
      success: true,
      data: salaries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/salary/:year/:month
// @desc    Get salary for specific month
// @access  Private
router.get('/:year/:month', protect, async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const salary = await Salary.findOne({
      user: req.user.id,
      year: parseInt(year),
      month: parseInt(month)
    });
    
    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }
    
    res.json({
      success: true,
      data: salary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/salary
// @desc    Add new salary record
// @access  Private
router.post('/', [
  protect,
  body('basicSalary').isNumeric().withMessage('Basic salary must be a number'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1-12'),
  body('year').isInt({ min: 2020 }).withMessage('Year must be valid'),
  body('payDate').isISO8601().withMessage('Pay date must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      basicSalary,
      allowances,
      deductions,
      month,
      year,
      payDate,
      notes
    } = req.body;

    // Check if salary for this month/year already exists
    const existingSalary = await Salary.findOne({
      user: req.user.id,
      month,
      year
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: 'Salary record for this month already exists'
      });
    }

    const salary = await Salary.create({
      user: req.user.id,
      basicSalary,
      allowances: allowances || {},
      deductions: deductions || {},
      month,
      year,
      payDate,
      notes
    });

    res.status(201).json({
      success: true,
      data: salary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/salary/:id
// @desc    Update salary record
// @access  Private
router.put('/:id', [
  protect,
  body('basicSalary').optional().isNumeric().withMessage('Basic salary must be a number'),
  body('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be between 1-12'),
  body('year').optional().isInt({ min: 2020 }).withMessage('Year must be valid'),
  body('payDate').optional().isISO8601().withMessage('Pay date must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    // Check if salary belongs to user
    if (salary.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this salary record'
      });
    }

    salary = await Salary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: salary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/salary/:id
// @desc    Delete salary record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    // Check if salary belongs to user
    if (salary.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this salary record'
      });
    }

    await Salary.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Salary record deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/salary/analytics
// @desc    Get salary analytics with monthly trends (dashboard style)
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    // Get all salary records for the user
    const salaries = await Salary.find({ user: req.user.id }).sort({ year: -1, month: -1 });
    
    if (salaries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No salary records found'
      });
    }

    // Get monthly trends (last 12 months or all available)
    const monthlyTrends = await Promise.all(
      salaries.slice(0, 12).map(async (salary) => {
        // Get expenses for this month
        const startDate = new Date(salary.year, salary.month - 1, 1);
        const endDate = new Date(salary.year, salary.month, 0);

        const expenses = await Expense.find({
          user: req.user.id,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        });

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const savings = salary.netSalary - totalExpenses;
        const savingsRate = salary.netSalary > 0 ? (savings / salary.netSalary) * 100 : 0;

        return {
          month: salary.month,
          year: salary.year,
          salary: salary.netSalary,
          expenses: totalExpenses,
          savings,
          savingsRate
        };
      })
    );

    // Get current month data (latest salary record)
    const latestSalary = salaries[0];
    const currentStartDate = new Date(latestSalary.year, latestSalary.month - 1, 1);
    const currentEndDate = new Date(latestSalary.year, latestSalary.month, 0);

    const currentExpenses = await Expense.find({
      user: req.user.id,
      date: {
        $gte: currentStartDate,
        $lte: currentEndDate
      }
    });

    const currentTotalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentSavings = latestSalary.netSalary - currentTotalExpenses;
    const currentSavingsRate = latestSalary.netSalary > 0 ? (currentSavings / latestSalary.netSalary) * 100 : 0;

    // Calculate summary statistics
    const totalSalary = salaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    const totalExpenses = monthlyTrends.reduce((sum, trend) => sum + trend.expenses, 0);
    const totalSavings = totalSalary - totalExpenses;
    const averageSavingsRate = monthlyTrends.length > 0 
      ? monthlyTrends.reduce((sum, trend) => sum + trend.savingsRate, 0) / monthlyTrends.length 
      : 0;

    // Get expense breakdown by category for current month
    const expensesByCategory = {};
    currentExpenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });

    // Generate savings suggestions
    const suggestions = [];
    
    if (currentSavingsRate < 10) {
      suggestions.push('Try to save at least 10% of your income for better financial health');
    }
    
    if (currentSavingsRate < 20) {
      suggestions.push('Consider reviewing your monthly expenses to identify areas for cost reduction');
    }

    // Find highest expense category for current month
    if (Object.keys(expensesByCategory).length > 0) {
      const highestExpenseCategory = Object.keys(expensesByCategory).reduce((a, b) => 
        expensesByCategory[a] > expensesByCategory[b] ? a : b
      );
      
      const categoryAmount = expensesByCategory[highestExpenseCategory];
      const categoryPercentage = (categoryAmount / currentTotalExpenses) * 100;
      
      if (categoryPercentage > 40) {
        suggestions.push(`Your ${highestExpenseCategory} expenses are quite high (${categoryPercentage.toFixed(1)}% of total). Consider reducing them.`);
      }
    }

    // Compare with previous month
    if (monthlyTrends.length > 1) {
      const previousMonth = monthlyTrends[1];
      const currentMonth = monthlyTrends[0];
      
      if (currentMonth.expenses > previousMonth.expenses) {
        const increase = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
        suggestions.push(`Your expenses increased by ${increase.toFixed(1)}% compared to last month. Try to monitor your spending.`);
      }
    }

    if (suggestions.length === 0) {
      suggestions.push('Great job! Your financial habits look healthy. Keep up the good work!');
    }

    res.json({
      success: true,
      data: {
        monthlyTrends: monthlyTrends.reverse(), // Show oldest to newest for chart
        currentMonth: {
          salary: latestSalary.netSalary,
          expenses: currentTotalExpenses,
          savings: currentSavings,
          savingsRate: currentSavingsRate
        },
        summary: {
          totalSalary,
          totalExpenses,
          totalSavings,
          averageSavingsRate
        },
        expensesByCategory,
        suggestions
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting analytics'
    });
  }
});

// @route   GET /api/salary/analytics/:year/:month
// @desc    Get salary analytics with expense comparison
// @access  Private
router.get('/analytics/:year/:month', protect, async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Get salary for the month
    const salary = await Salary.findOne({
      user: req.user.id,
      year: parseInt(year),
      month: parseInt(month)
    });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found for this month'
      });
    }

    // Get expenses for the same month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Expense.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate category-wise expenses
    const categoryExpenses = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Calculate savings
    const savings = salary.netSalary - totalExpenses;
    const savingsPercentage = ((savings / salary.netSalary) * 100).toFixed(2);

    // Generate savings suggestions
    const suggestions = generateSavingsSuggestions(salary, categoryExpenses, savings);

    res.json({
      success: true,
      data: {
        salary: {
          gross: salary.grossSalary,
          net: salary.netSalary,
          basicSalary: salary.basicSalary,
          allowances: salary.allowances,
          deductions: salary.deductions
        },
        expenses: {
          total: totalExpenses,
          byCategory: categoryExpenses,
          count: expenses.length
        },
        savings: {
          amount: savings,
          percentage: parseFloat(savingsPercentage)
        },
        suggestions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate savings suggestions
function generateSavingsSuggestions(salary, categoryExpenses, currentSavings) {
  const suggestions = [];
  const netSalary = salary.netSalary;
  
  // Ideal savings should be 20% of net salary
  const idealSavings = netSalary * 0.2;
  const savingsGap = idealSavings - currentSavings;

  if (currentSavings < 0) {
    suggestions.push({
      type: 'critical',
      priority: 'high',
      message: 'You are spending more than you earn! Immediate action required.',
      recommendation: 'Review all expenses and cut non-essential spending immediately.'
    });
  } else if (currentSavings < idealSavings) {
    suggestions.push({
      type: 'improvement',
      priority: 'medium',
      message: `Try to save ${savingsGap.toFixed(2)} more to reach the ideal 20% savings rate.`,
      recommendation: 'Look for areas to reduce spending in your top expense categories.'
    });
  } else {
    suggestions.push({
      type: 'success',
      priority: 'low',
      message: 'Great job! You are saving well.',
      recommendation: 'Consider investing your surplus savings for better returns.'
    });
  }

  // Category-specific suggestions
  Object.entries(categoryExpenses).forEach(([category, amount]) => {
    const percentage = (amount / netSalary) * 100;
    
    if (category === 'Food' && percentage > 15) {
      suggestions.push({
        type: 'category',
        priority: 'medium',
        message: `Food expenses (${percentage.toFixed(1)}%) are high.`,
        recommendation: 'Consider meal planning and cooking at home more often.'
      });
    } else if (category === 'Transportation' && percentage > 10) {
      suggestions.push({
        type: 'category',
        priority: 'medium',
        message: `Transportation costs (${percentage.toFixed(1)}%) are above recommended.`,
        recommendation: 'Look into public transport or carpooling options.'
      });
    } else if (category === 'Shopping' && percentage > 5) {
      suggestions.push({
        type: 'category',
        priority: 'low',
        message: `Shopping expenses (${percentage.toFixed(1)}%) could be reduced.`,
        recommendation: 'Create a shopping list and avoid impulse purchases.'
      });
    }
  });

  return suggestions;
}

module.exports = router;
