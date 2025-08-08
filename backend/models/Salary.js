const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basicSalary: {
    type: Number,
    required: [true, 'Basic salary is required'],
    min: [0, 'Basic salary must be positive']
  },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    pension: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2020
  },
  payDate: {
    type: Date,
    required: true
  },
  grossSalary: {
    type: Number,
    default: function() {
      return this.basicSalary + 
             (this.allowances?.housing || 0) + 
             (this.allowances?.transport || 0) + 
             (this.allowances?.food || 0) + 
             (this.allowances?.other || 0);
    }
  },
  netSalary: {
    type: Number,
    default: function() {
      const gross = this.basicSalary + 
                   (this.allowances?.housing || 0) + 
                   (this.allowances?.transport || 0) + 
                   (this.allowances?.food || 0) + 
                   (this.allowances?.other || 0);
      const totalDeductions = (this.deductions?.tax || 0) + 
                             (this.deductions?.insurance || 0) + 
                             (this.deductions?.pension || 0) + 
                             (this.deductions?.other || 0);
      return gross - totalDeductions;
    }
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for unique salary per month/year per user
salarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

// Calculate gross and net salary before saving
salarySchema.pre('save', function(next) {
  this.grossSalary = this.basicSalary + 
                    (this.allowances?.housing || 0) + 
                    (this.allowances?.transport || 0) + 
                    (this.allowances?.food || 0) + 
                    (this.allowances?.other || 0);
  
  const totalDeductions = (this.deductions?.tax || 0) + 
                         (this.deductions?.insurance || 0) + 
                         (this.deductions?.pension || 0) + 
                         (this.deductions?.other || 0);
  
  this.netSalary = this.grossSalary - totalDeductions;
  next();
});

module.exports = mongoose.model('Salary', salarySchema);
