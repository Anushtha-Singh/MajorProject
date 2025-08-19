const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // ✅ Use SSL only in production
    : false, // ✅ No SSL locally
});

module.exports = pool;
