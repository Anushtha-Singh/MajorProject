const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
console.log('Type of sql:', typeof sql);
console.log('sql.query:', typeof sql.query);
