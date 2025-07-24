# Bank Lending System

A modern, full-stack web application for managing bank loans, payments, and customer accounts.

## Features
- Customer login
- Create new loans
- Make EMI or lump sum payments
- View loan ledger and transaction history
- Account overview for all loans
- Responsive, beautiful UI
- Robust error and loading handling

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL or SQLite

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL or SQLite

### Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/bank-lending-system.git
cd bank-lending-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env with DATABASE_URL and PORT
npm run init-db # (optional) Initialize tables and demo customers
npm start
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Create a .env file with your backend URL:
# REACT_APP_BACKEND_URL=https://your-backend-deployed-url.com/api/v1
npm start
```

### Deployment
- Deploy the backend (Node.js) to Render, Heroku, or any Node hosting.
- Deploy the frontend (React) to Render, Vercel, Netlify, or any static hosting.
- **Important:** Set `REACT_APP_BACKEND_URL` in the frontend `.env` to your deployed backend API URL.

### Environment Variables
- **Backend:**
  - `DATABASE_URL` — Your PostgreSQL/SQLite connection string
  - `PORT` — Port for the backend server (default: 5000)
- **Frontend:**
  - `REACT_APP_BACKEND_URL` — The base URL for the backend API

### License
MIT 