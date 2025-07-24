import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to <span className="highlight">Bank Lending System</span></h1>
        <p className="hero-subtitle">Empowering your financial journey with transparency, speed, and security.</p>
        <Link to="/login" className="button payment-btn hero-cta">Get Started</Link>
      </div>
      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="secure" className="feature-icon">🔒</span>
            <h3>Secure & Reliable</h3>
            <p>Your data and transactions are protected with industry-leading security.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="fast" className="feature-icon">⚡</span>
            <h3>Fast Loan Processing</h3>
            <p>Apply, get approved, and manage your loans in minutes, not days.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="history" className="feature-icon">📜</span>
            <h3>Complete Transparency</h3>
            <p>Track your payments, EMIs, and loan history with a single click.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="support" className="feature-icon">🤝</span>
            <h3>Friendly Support</h3>
            <p>Our team is here to help you at every step of your lending journey.</p>
          </div>
        </div>
      </div>
      <div className="about-section">
        <h2>About Bank Lending System</h2>
        <p>
          The Bank Lending System is a modern web application designed to simplify and secure the process of managing loans for both banks and customers. Built with the latest technology, it offers a seamless experience for loan creation, payment management, and account overview. Our mission is to make lending transparent, accessible, and stress-free for everyone.
        </p>
      </div>
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Bank Lending System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage; 