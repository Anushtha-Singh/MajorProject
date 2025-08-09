const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'yojna-saathi',
  password: '8888',
  port: 5432,
});

module.exports = pool;
