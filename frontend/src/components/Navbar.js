import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = JSON.parse(localStorage.getItem('customer'));

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/landing" className="brand">Bank Lending</Link>
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>New Loan</Link></li>
        {customer && (
          <li><Link to={`/overview/${customer.id}`} className={location.pathname.startsWith('/overview') ? 'active' : ''}>Account Overview</Link></li>
        )}
      </ul>
      {customer && (
        <div className="logout-container">
          <span className="customer-info">{customer.name}</span>
          <button className="button history-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 