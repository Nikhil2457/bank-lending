import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function LoanForm() {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setResponse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setResponse(null);
    try {
      const res = await api.post('/loans', formData);
      setResponse(res.data);
      setSuccess('Loan created successfully!');
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError('Failed to create loan: ' + error.response.data.error);
      } else {
        setError('Failed to create loan. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{marginBottom: '1.5rem'}}>
        <h2>Bank Lending System</h2>
        <p className="highlight">A modern, secure, and user-friendly platform for managing loans, payments, and customer accounts. Easily create new loans, make payments, and view your complete loan history. Built with a focus on transparency, simplicity, and a beautiful user experience.</p>
      </div>
      <button className="button history-btn" style={{marginBottom: '1rem'}} onClick={() => navigate(-1)}>&larr; Back</button>
      <h3>Create New Loan</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="detail-label">Customer ID</label>
          <input
            type="text"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="detail-label">Loan Amount (₹)</label>
          <input
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="detail-label">Loan Period (Years)</label>
          <input
            type="number"
            name="loan_period_years"
            value={formData.loan_period_years}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="detail-label">Interest Rate (%)</label>
          <input
            type="number"
            name="interest_rate_yearly"
            value={formData.interest_rate_yearly}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', fontWeight: 600 }}>{success}</div>}
        <button type="submit" className="button payment-btn" disabled={loading}>{loading ? <span className="spinner" style={{width:24,height:24,borderWidth:4}}></span> : 'Create Loan'}</button>
      </form>
      {response && (
        <div className="card" style={{background:'#f5f5f5', marginTop:'1.5rem'}}>
          <h3>Loan Created</h3>
          <p><span className="detail-label">Loan ID:</span> <span className="detail-value">{response.loan_id}</span></p>
          <p><span className="detail-label">Total Amount Payable:</span> <span className="detail-value">₹{Number(response.total_amount_payable).toFixed(2)}</span></p>
          <p><span className="detail-label">Monthly EMI:</span> <span className="detail-value">₹{Number(response.monthly_emi).toFixed(2)}</span></p>
        </div>
      )}
    </div>
  );
}

export default LoanForm; 