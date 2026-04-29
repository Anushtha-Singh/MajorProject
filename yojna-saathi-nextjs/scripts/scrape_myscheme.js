const { Client } = require('pg');
const cheerio = require('cheerio');
require('dotenv').config({ path: '.env' });

// We test with a few known scheme slugs first.
// To scrape all 1000+ schemes, you would read them from myscheme.gov.in sitemap
// or from their initial JSON listing API.
const TEST_SLUGS = [
  'pmkisan',
  'pmsby',
  'pmjjby'
];

async function createTableIfNotExists(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS scraped_schemes (
      id SERIAL PRIMARY KEY,
      myscheme_id VARCHAR(100) UNIQUE,
      myscheme_slug VARCHAR(200) UNIQUE,
      title TEXT,
      url TEXT,
      details TEXT,
      benefits JSONB,
      eligibility JSONB,
      application_process JSONB,
      documents_required JSONB,
      tags JSONB,
      scheme_category VARCHAR(100),
      level VARCHAR(100),
      department_state VARCHAR(255),
      last_synced_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Ensured scraped_schemes table exists (without modifying existing tables).');
}

async function scrapeScheme(slug) {
  try {
    const url = `https://www.myscheme.gov.in/schemes/${slug}`;
    console.log(`Fetching ${url}...`);
    
    // 1. Fetch the raw HTML of the scheme page
    // Using a fake User-Agent prevents basic bot-blocking
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.log(`❌ Failed to fetch ${slug}: HTTP ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // 2. Load into cheerio to easily extract the hidden Next.js data block
    const $ = cheerio.load(html);
    const nextDataScript = $('#__NEXT_DATA__').html();
    
    if (!nextDataScript) {
      console.log(`❌ Could not find __NEXT_DATA__ for ${slug}`);
      return null;
    }

    // 3. Parse the JSON
    const data = JSON.parse(nextDataScript);
    
    // The structure is usually inside pageProps -> schemeData
    const schemeData = data?.props?.pageProps?.schemeData?.basicDetails;
    const additionalData = data?.props?.pageProps?.schemeData;
    
    if (!schemeData) {
      console.log(`❌ Missing schemeData for ${slug}`);
      return null;
    }

    // 4. Map to our database format
    // Note: myscheme data structure requires checking specific keys
    return {
      myscheme_id: schemeData.schemeId || schemeData.id || slug,
      myscheme_slug: slug,
      title: schemeData.schemeName || '',
      url: url,
      details: schemeData.briefDescription || '',
      benefits: JSON.stringify([additionalData?.benefits?.description || '']),
      eligibility: JSON.stringify([additionalData?.eligibilityCriteria?.description || '']),
      application_process: JSON.stringify([additionalData?.applicationProcess?.map(p => p.description).join('\n') || '']),
      documents_required: JSON.stringify([additionalData?.documentsRequired?.map(d => d.description).join('\n') || '']),
      tags: JSON.stringify(schemeData.tags || []),
      scheme_category: schemeData.category || 'General',
      level: schemeData.level || 'Central',
      department_state: schemeData.nodalMinistryName || schemeData.stateName || 'Government of India',
    };

  } catch (err) {
    console.error(`❌ Error scraping ${slug}:`, err.message);
    return null;
  }
}

async function runSync() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon database.');

    await createTableIfNotExists(client);

    const totalSchemes = TEST_SLUGS.length;
    const delayMs = 1500; // 1.5 seconds delay between requests to avoid blocking
    let processed = 0;
    
    // Estimate Time
    const estimatedSeconds = (totalSchemes * delayMs) / 1000;
    const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
    console.log(`\n⏳ Starting sync for ${totalSchemes} schemes...`);
    console.log(`⏱️ Estimated total time: ~${estimatedMinutes} minutes (at ${delayMs/1000}s per request)\n`);

    const startTime = Date.now();

    for (const slug of TEST_SLUGS) {
      processed++;
      const scheme = await scrapeScheme(slug);
      
      if (scheme) {
        // 5. UPSERT the scheme (Update if exists, Insert if new)
        const query = `
          INSERT INTO scraped_schemes (
            myscheme_id, myscheme_slug, title, url, details, benefits, 
            eligibility, application_process, documents_required, tags, 
            scheme_category, level, department_state, last_synced_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()
          )
          ON CONFLICT (myscheme_id) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            details = EXCLUDED.details,
            benefits = EXCLUDED.benefits,
            eligibility = EXCLUDED.eligibility,
            application_process = EXCLUDED.application_process,
            documents_required = EXCLUDED.documents_required,
            last_synced_at = NOW();
        `;
        
        const values = [
          scheme.myscheme_id, scheme.myscheme_slug, scheme.title, scheme.url, 
          scheme.details, scheme.benefits, scheme.eligibility, 
          scheme.application_process, scheme.documents_required, scheme.tags,
          scheme.scheme_category, scheme.level, scheme.department_state
        ];

        await client.query(query, values);
        
        const elapsed = (Date.now() - startTime) / 1000;
        const avgTimePerItem = elapsed / processed;
        const remainingItems = totalSchemes - processed;
        const etaSeconds = Math.round(avgTimePerItem * remainingItems);
        const etaMinutes = (etaSeconds / 60).toFixed(1);

        console.log(`✅ [${processed}/${totalSchemes}] Saved: ${scheme.title} | ETA: ${etaMinutes} mins`);
      }
      
      // Delay to avoid getting blocked by myscheme servers
      await new Promise(r => setTimeout(r, delayMs));
    }

    console.log('\n🎉 Sync complete!');
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await client.end();
  }
}

runSync();
