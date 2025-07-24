import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ id: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Simulate async login (replace with real API if needed)
    setTimeout(() => {
      if (!form.id || !form.name) {
        setError('Both fields are required');
        setLoading(false);
        return;
      }
      // Simulate valid customer IDs (for demo)
      const validCustomers = [
        { id: 'cust1', name: 'Alice' },
        { id: 'cust2', name: 'Bob' },
        { id: 'cust3', name: 'Charlie' }
      ];
      const found = validCustomers.find(c => c.id === form.id && c.name.toLowerCase() === form.name.toLowerCase());
      if (!found) {
        setError('Invalid Customer ID or Name. Please check your credentials.');
        setLoading(false);
        return;
      }
      localStorage.setItem('customer', JSON.stringify({ id: form.id, name: form.name }));
      setSuccess('Login successful! Redirecting...');
      setLoading(false);
      setTimeout(() => navigate('/loan'), 1200);
    }, 900);
  };

  return (
    <div className="card">
      <div style={{marginBottom: '1.5rem'}}>
        <h2>Welcome to Bank Lending System</h2>
        <p className="highlight">Login to access your loans, make payments, and view your account overview. Your credentials are safe and your experience is our priority.</p>
      </div>
      <button className="button history-btn" style={{marginBottom: '1rem'}} onClick={() => navigate(-1)}>&larr; Back</button>
      <h3>Customer Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="detail-label">Customer ID</label>
          <input type="text" name="id" value={form.id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="detail-label">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', fontWeight: 600 }}>{success}</div>}
        <button type="submit" className="button payment-btn" disabled={loading}>{loading ? <span className="spinner" style={{width:24,height:24,borderWidth:4}}></span> : 'Login'}</button>
      </form>
    </div>
  );
}

export default Login; 