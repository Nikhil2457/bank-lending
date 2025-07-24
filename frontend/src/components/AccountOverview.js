import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

function AccountOverview() {
  const { customerId } = useParams();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/customers/${customerId}/overview`);
      setOverview(res.data);
    } catch (error) {
      setError('Failed to fetch account overview. ' + (error.response?.data?.error || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line
  }, [customerId]);

  if (loading) return <div className="spinner"></div>;
  if (error) return (
    <div className="card">
      <div style={{ color: 'red', fontWeight: 600, marginBottom: '1rem' }}>{error}</div>
      <button className="button payment-btn" onClick={fetchOverview}>Retry</button>
    </div>
  );
  if (!overview) return null;

  return (
    <div className="card">
      <button className="button history-btn" style={{marginBottom: '1rem'}} onClick={() => navigate(-1)}>&larr; Back</button>
      <h2>Account Overview</h2>
      <p><span className="detail-label">Customer ID:</span> <span className="detail-value">{overview.customer_id}</span></p>
      <p><span className="detail-label">Total Loans:</span> <span className="detail-value">{overview.total_loans}</span></p>
      <h3>Loans</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Principal</th>
              <th>Total Amount</th>
              <th>Total Interest</th>
              <th>EMI Amount</th>
              <th>Amount Paid</th>
              <th>EMIs Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {overview.loans.map(loan => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td><span className="detail-label">₹</span>{Number(loan.principal).toFixed(2)}</td>
                <td><span className="detail-label">₹</span>{Number(loan.total_amount).toFixed(2)}</td>
                <td><span className="detail-label">₹</span>{Number(loan.total_interest).toFixed(2)}</td>
                <td><span className="detail-label">₹</span>{Number(loan.emi_amount).toFixed(2)}</td>
                <td><span className="detail-label">₹</span>{Number(loan.amount_paid).toFixed(2)}</td>
                <td>{loan.emis_left}</td>
                <td>
                  <Link className="button payment-btn" to={`/payment/${loan.loan_id}`}>Make Payment</Link>
                  <Link className="button history-btn" to={`/ledger/${loan.loan_id}`} style={{marginLeft: '0.5rem'}}>View History</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountOverview; 