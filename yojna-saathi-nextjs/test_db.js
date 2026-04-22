const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const res1 = await client.query('SELECT DISTINCT "Level" FROM government_schemes;');
  console.log('Levels:', res1.rows.map(r => r.Level));
  
  const res2 = await client.query('SELECT DISTINCT "Scheme Category" FROM government_schemes;');
  console.log('Categories:', res2.rows.map(r => r["Scheme Category"]));
  
  const res3 = await client.query('SELECT DISTINCT "Benefit Type" FROM government_schemes;');
  console.log('Benefit Types:', res3.rows.map(r => r["Benefit Type"]));
  
  await client.end();
}
run();
