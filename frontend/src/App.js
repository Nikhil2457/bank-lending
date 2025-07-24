import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoanForm from './components/LoanForm';
import PaymentForm from './components/PaymentForm';
import LedgerView from './components/LedgerView';
import AccountOverview from './components/AccountOverview';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import './App.css';

function RequireAuth({ children }) {
  const customer = JSON.parse(localStorage.getItem('customer'));
  const location = useLocation();
  if (!customer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/loan" element={<RequireAuth><LoanForm /></RequireAuth>} />
            <Route path="/payment/:loanId" element={<RequireAuth><PaymentForm /></RequireAuth>} />
            <Route path="/ledger/:loanId" element={<RequireAuth><LedgerView /></RequireAuth>} />
            <Route path="/overview/:customerId" element={<RequireAuth><AccountOverview /></RequireAuth>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
