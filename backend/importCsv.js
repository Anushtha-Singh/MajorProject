const fs = require('fs');
const csv = require('csv-parser');
const pool = require('./database'); //uses your database/index.js

const result = []; //empty array to hold the parsed data

fs.createReadStream('./database/schemes_dataset.csv')
    .pipe(csv())
    .on("data", (row) => {
        result.push(row);
    })
    .on('end', async () => {
        console.log(`Read ${result.length} rows from CSV file`);

        for(const row of result) {
            try {
                // console.log(Object.keys(row));
                await pool.query(
                    `INSERT INTO government_schemes
                    (title, url, details, benefits, eligibility, application_process, documents_required)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        row.Title,
                        row.URL,
                        row.Details,
                        row.Benefits,
                        row.Eligibility,
                        row['Application_Process'], // Make sure this matches your CSV header
                        row['Documents_Required']
                    ]
                );
            } catch (err) {
                console.error(`Error inserting row: ${JSON.stringify(row)} - ${err.message}`);
            }
        }

        console.log('CSV import completed successfully');
        pool.end();
    });