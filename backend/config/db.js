const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Log database connection info (excluding password)
const { host, database, user } = pool.options;
console.log(`Connected to database: host=${host}, database=${database}, user=${user}`);

module.exports = pool; 