import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function LedgerView() {
  const { loanId } = useParams();
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLedger = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/loans/${loanId}/ledger`);
      setLedger(res.data);
    } catch (error) {
      setError('Failed to fetch loan ledger. ' + (error.response?.data?.error || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    // eslint-disable-next-line
  }, [loanId]);

  if (loading) return <div className="spinner"></div>;
  if (error) return (
    <div className="card">
      <div style={{ color: 'red', fontWeight: 600, marginBottom: '1rem' }}>{error}</div>
      <button className="button payment-btn" onClick={fetchLedger}>Retry</button>
    </div>
  );
  if (!ledger) return null;

  return (
    <div className="card">
      <button className="button history-btn" style={{marginBottom: '1rem'}} onClick={() => navigate(-1)}>&larr; Back</button>
      <h2>Loan Ledger</h2>
      <p><span className="detail-label">Loan ID:</span> <span className="detail-value">{ledger.loan_id}</span></p>
      <p><span className="detail-label">Customer ID:</span> <span className="detail-value">{ledger.customer_id}</span></p>
      <p><span className="detail-label">Principal:</span> <span className="detail-value">₹{Number(ledger.principal).toFixed(2)}</span></p>
      <p><span className="detail-label">Total Amount:</span> <span className="detail-value">₹{Number(ledger.total_amount).toFixed(2)}</span></p>
      <p><span className="detail-label">Monthly EMI:</span> <span className="detail-value">₹{Number(ledger.monthly_emi).toFixed(2)}</span></p>
      <p><span className="detail-label">Amount Paid:</span> <span className="detail-value">₹{Number(ledger.amount_paid).toFixed(2)}</span></p>
      <p><span className="detail-label">Balance Amount:</span> <span className="detail-value">₹{Number(ledger.balance_amount).toFixed(2)}</span></p>
      <p><span className="detail-label">EMIs Left:</span> <span className="detail-value">{ledger.emis_left}</span></p>
      <h3>Transactions</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {ledger.transactions.map(tx => (
              <tr key={tx.transaction_id}>
                <td>{tx.transaction_id}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td><span className="detail-label">₹</span>{Number(tx.amount).toFixed(2)}</td>
                <td>{tx.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LedgerView; 