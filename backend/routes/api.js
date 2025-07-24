const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Create a new loan
router.post('/loans', async (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Calculate total interest and EMI
    const principal = parseFloat(loan_amount);
    const years = parseInt(loan_period_years);
    const rate = parseFloat(interest_rate_yearly) / 100;
    const totalInterest = principal * years * rate;
    const totalAmount = principal + totalInterest;
    const monthlyEMI = totalAmount / (years * 12);
    const loan_id = uuidv4();

    const result = await pool.query(
      `INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [loan_id, customer_id, principal, totalAmount, rate, years, monthlyEMI, 'ACTIVE']
    );

    res.status(201).json({
      loan_id,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEMI
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record a payment
router.post('/loans/:loan_id/payments', async (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type || !['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({ error: 'Invalid payment data' });
  }

  try {
    const loan = await pool.query('SELECT * FROM loans WHERE loan_id = $1', [loan_id]);
    if (loan.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const payment_id = uuidv4();
    const currentLoan = loan.rows[0];
    let newBalance = currentLoan.total_amount - amount;
    let emisLeft = Math.ceil(newBalance / currentLoan.monthly_emi);

    await pool.query(
      `INSERT INTO payments (payment_id, loan_id, amount, payment_type, payment_date)
       VALUES ($1, $2, $3, $4, NOW())`,
      [payment_id, loan_id, amount, payment_type]
    );

    await pool.query(
      'UPDATE loans SET total_amount = $1 WHERE loan_id = $2',
      [newBalance, loan_id]
    );

    if (newBalance <= 0) {
      await pool.query('UPDATE loans SET status = $1 WHERE loan_id = $2', ['PAID_OFF', loan_id]);
    }

    res.status(200).json({
      payment_id,
      loan_id,
      message: 'Payment recorded successfully',
      remaining_balance: newBalance,
      emis_left: emisLeft
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get loan ledger
router.get('/loans/:loan_id/ledger', async (req, res) => {
  const { loan_id } = req.params;

  try {
    const loan = await pool.query('SELECT * FROM loans WHERE loan_id = $1', [loan_id]);
    if (loan.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const payments = await pool.query('SELECT * FROM payments WHERE loan_id = $1 ORDER BY payment_date', [loan_id]);
    const currentLoan = loan.rows[0];
    const amountPaid = payments.rows.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const balanceAmount = currentLoan.total_amount;
    const emisLeft = Math.ceil(balanceAmount / currentLoan.monthly_emi);

    res.status(200).json({
      loan_id,
      customer_id: currentLoan.customer_id,
      principal: currentLoan.principal_amount,
      total_amount: currentLoan.total_amount + amountPaid,
      monthly_emi: currentLoan.monthly_emi,
      amount_paid: amountPaid,
      balance_amount: balanceAmount,
      emis_left: emisLeft,
      transactions: payments.rows.map(p => ({
        transaction_id: p.payment_id,
        date: p.payment_date,
        amount: p.amount,
        type: p.payment_type
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get customer overview
router.get('/customers/:customer_id/overview', async (req, res) => {
  const { customer_id } = req.params;

  try {
    const loans = await pool.query('SELECT * FROM loans WHERE customer_id = $1', [customer_id]);
    if (loans.rows.length === 0) {
      return res.status(404).json({ error: 'No loans found for customer' });
    }

    const loanDetails = await Promise.all(loans.rows.map(async (loan) => {
      const payments = await pool.query('SELECT * FROM payments WHERE loan_id = $1', [loan.loan_id]);
      const amountPaid = payments.rows.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalInterest = loan.total_amount - loan.principal_amount;
      const emisLeft = Math.ceil(loan.total_amount / loan.monthly_emi);

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount, // FIX: do not add amountPaid
        total_interest: totalInterest,
        emi_amount: loan.monthly_emi,
        amount_paid: amountPaid,
        emis_left: emisLeft
      };
    }));

    res.status(200).json({
      customer_id,
      total_loans: loans.rows.length,
      loans: loanDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 