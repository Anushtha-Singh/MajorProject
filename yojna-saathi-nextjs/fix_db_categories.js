const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await client.query(`UPDATE government_schemes SET "Scheme Category" = 'Social Welfare & Empowerment' WHERE "Scheme Category" = 'Social welfare & Empowerment';`);
    await client.query(`UPDATE government_schemes SET "Scheme Category" = 'Women & Child' WHERE "Scheme Category" = 'Women and Child';`);
    await client.query(`UPDATE government_schemes SET "Level" = 'State' WHERE "Level" = 'state';`);
    await client.query(`UPDATE government_schemes SET "Level" = 'Central' WHERE "Level" = 'central';`);
    await client.query(`UPDATE government_schemes SET "Benefit Type" = 'Cash' WHERE "Benefit Type" = 'cash';`);
    await client.query(`UPDATE government_schemes SET "Benefit Type" = 'Other' WHERE "Benefit Type" = 'other';`);
    await client.query(`UPDATE government_schemes SET "Benefit Type" = 'Composite' WHERE "Benefit Type" = 'composite';`);
    
    const res = await client.query('SELECT DISTINCT "Scheme Category" FROM government_schemes;');
    console.log('Updated Categories:', res.rows.map(r => r["Scheme Category"]));
  } catch (err) {
    console.log(err.message);
  }
  await client.end();
}
run();
