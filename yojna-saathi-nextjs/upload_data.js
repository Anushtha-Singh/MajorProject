const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function uploadData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon database.');
    
    await client.query('TRUNCATE TABLE government_schemes;');
    console.log('Cleared existing data.');

    const results = [];
    fs.createReadStream('/Users/mohanmanjhi/MajorProject/Documents/schemes_dataset.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Parsed ${results.length} rows from CSV.`);
        
        let inserted = 0;
        const batchSize = 100;
        
        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize);
          
          let query = `
            INSERT INTO government_schemes (
              "Scheme Title", "URL", "Details", "Benefits", "Eligibility",
              "Application Process (Steps)", "Documents Required", "Tags",
              "Scheme Category", "Level", "Benefit Type", "Department/State", "Sources & References"
            ) VALUES 
          `;
          
          const values = [];
          const placeholders = [];
          
          batch.forEach((row, index) => {
            const offset = index * 13;
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13})`);
            
            // Extract title
            let title = row.Title || row['\uFEFFTitle'] || '';
            if (!title) {
              const details = row.Details || '';
              const match = details.match(/(?:The scheme|The) ["'“‘”]([^"'“‘”]+)["'“‘”]/i) || details.match(/["'“‘”]([^"'“‘”]+)["'“‘”] scheme/i);
              if (match && match[1]) {
                title = match[1].trim();
              } else if (row.URL) {
                const parts = row.URL.split('/');
                const slug = parts[parts.length - 1];
                if (slug) {
                  title = slug.replace(/-/g, ' ').toUpperCase();
                }
              }
            }
            if (!title) title = 'Government Scheme';

            values.push(
              title,
              row.URL || '',
              row.Details || '',
              row.Benefits ? JSON.stringify([row.Benefits]) : '[]',
              row.Eligibility ? JSON.stringify([row.Eligibility]) : '[]',
              row.Application_Process ? JSON.stringify([row.Application_Process]) : '[]',
              row.Documents_Required ? JSON.stringify([row.Documents_Required]) : '[]',
              '[]',
              'General',
              'Central',
              'Other',
              'Government of India',
              '[]'
            );
          });
          
          query += placeholders.join(', ');
          
          try {
            await client.query(query, values);
            inserted += batch.length;
            console.log(`Inserted ${inserted}/${results.length} schemes...`);
          } catch (err) {
            console.error('Error inserting batch:', err.message);
          }
        }
        
        console.log(`Successfully inserted ${inserted} schemes total.`);
        await client.end();
      });
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

uploadData();
