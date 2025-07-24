const pool = require('./db');

async function initDB() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT REFERENCES Customers(customer_id),
        principal_amount DECIMAL NOT NULL,
        total_amount DECIMAL NOT NULL,
        interest_rate DECIMAL NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT REFERENCES Loans(loan_id),
        amount DECIMAL NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created or already exist.');

    // Insert default customers if not present
    const customers = [
      { id: 'cust1', name: 'Alice' },
      { id: 'cust2', name: 'Bob' },
      { id: 'cust3', name: 'Charlie' }
    ];
    for (const c of customers) {
      await pool.query(
        `INSERT INTO Customers (customer_id, name) VALUES ($1, $2)
         ON CONFLICT (customer_id) DO NOTHING`,
        [c.id, c.name]
      );
    }
    console.log('Default customers inserted.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

initDB(); 