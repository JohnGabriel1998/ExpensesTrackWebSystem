const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/summary
// @desc    Get expense summary for dashboard
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    // Get monthly totals for the year
    const monthlyTotals = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get category breakdown for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Get recent expenses
    const recentExpenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    // Calculate total for current month
    const currentMonthTotal = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);

    // Get weekly breakdown for current month
    const weeklyBreakdown = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $week: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        monthlyTotals,
        categoryBreakdown,
        recentExpenses,
        currentMonthTotal,
        weeklyBreakdown,
        year: parseInt(year)
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

// @route   GET /api/dashboard/export
// @desc    Export expenses to CSV
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Create CSV content
    const csvHeaders = 'Date,Title,Category,Amount,Description\n';
    const csvRows = expenses.map(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      const description = expense.description ? `"${expense.description.replace(/"/g, '""')}"` : '';
      return `${date},"${expense.title}",${expense.category},${expense.amount},${description}`;
    }).join('\n');

    const csvContent = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.send(csvContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;