import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function PaymentForm() {
  const { loanId } = useParams();
  const [formData, setFormData] = useState({
    amount: '',
    payment_type: 'EMI'
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
      const res = await api.post(`/loans/${loanId}/payments`, formData);
      setResponse(res.data);
      setSuccess('Payment recorded successfully!');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError('Failed to record payment: ' + error.response.data.error);
      } else {
        setError('Failed to record payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <button className="button history-btn" style={{marginBottom: '1rem'}} onClick={() => navigate(-1)}>&larr; Back</button>
      <h2>Record Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="detail-label">Loan ID</label>
          <input type="text" value={loanId} disabled />
        </div>
        <div className="form-group">
          <label className="detail-label">Payment Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="detail-label">Payment Type</label>
          <select name="payment_type" value={formData.payment_type} onChange={handleChange}>
            <option value="EMI">EMI</option>
            <option value="LUMP_SUM">Lump Sum</option>
          </select>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', fontWeight: 600 }}>{success}</div>}
        <button type="submit" className="button payment-btn" disabled={loading}>{loading ? <span className="spinner" style={{width:24,height:24,borderWidth:4}}></span> : 'Record Payment'}</button>
      </form>
      {response && (
        <div className="card" style={{background:'#f5f5f5', marginTop:'1.5rem'}}>
          <h3>Payment Recorded</h3>
          <p><span className="detail-label">Payment ID:</span> <span className="detail-value">{response.payment_id}</span></p>
          <p><span className="detail-label">Remaining Balance:</span> <span className="detail-value">₹{Number(response.remaining_balance).toFixed(2)}</span></p>
          <p><span className="detail-label">EMIs Left:</span> <span className="detail-value">{response.emis_left}</span></p>
        </div>
      )}
    </div>
  );
}

export default PaymentForm; 