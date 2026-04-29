/**
 * translate_db.js — BATCHED translation for Yojna Saathi
 *
 * Optimizations:
 *  - Translates 1 language at a time (Hindi only by default).
 *  - Combines all 8 fields into a SINGLE translation request.
 *  - 8x fewer requests to avoid Google's IP blocks.
 */

import translate from 'google-translate-api-x';
import pkg from 'pg';

const { Pool } = pkg;

const DATABASE_URL =
  'postgresql://neondb_owner:npg_wONXG78MbQPY@ep-bold-unit-ao0niqan.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const targetLang = process.argv[2] || 'hi';
if (!/^[a-z]{2}$/.test(targetLang)) {
  console.error("Please provide a valid 2-letter language code (e.g., hi, bn, ta, te).");
  process.exit(1);
}

const BATCH_SIZE = 10;
const FIELD_MAX_CHARS = 550; // Google limits requests to 5000 chars total, so 550 * 8 = 4400

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanText(text) {
  if (!text || typeof text !== 'string') return 'EMPTY_TEXT';
  let cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
  
  if (!cleaned) return 'EMPTY_TEXT';
  return cleaned.length > FIELD_MAX_CHARS ? cleaned.slice(0, FIELD_MAX_CHARS) : cleaned;
}

// Translate all 8 fields in ONE request
async function translateSchemeBatched(scheme, to) {
  const fields = [
    'Scheme Title',
    'Details',
    'Benefits',
    'Eligibility',
    'Application Process (Steps)',
    'Documents Required',
    'Tags',
    'Scheme Category'
  ];

  // 1. Clean and combine fields with a unique separator
  const combinedText = fields.map(f => cleanText(scheme[f])).join(' \n\n|||\n\n ');

  // 2. Translate everything in one go (Never skip, wait on rate limit)
  let translatedText = '';
  let attempt = 1;
  while (true) {
    try {
      const result = await translate(combinedText, { from: 'en', to });
      translatedText = result.text;
      break; // Success
    } catch (err) {
      // If we hit a rate limit, wait longer and longer, up to 60 seconds, then try again.
      // We loop infinitely so we NEVER skip a scheme.
      const waitMs = Math.min(attempt * 5000, 60000); 
      process.stdout.write(`  ⚠ Rate limit hit. Waiting ${waitMs/1000}s before retry... \r`);
      await sleep(waitMs);
      attempt++;
    }
  }

  if (!translatedText) return null;

  // 3. Split the text back into 8 fields
  // Sometimes Google translates the spaces around the delimiter, so we make the split flexible
  const parts = translatedText.split(/ ?\|\|\| ?/);

  // If the splitting got messed up by Google, fail gracefully
  if (parts.length !== 8) {
    return null;
  }

  // 4. Return as an object, removing "EMPTY_TEXT" markers
  const removeEmpty = (t) => (t.includes('EMPTY_TEXT') || t.includes('EMPTY_') ? '' : t.trim());

  return {
    title: removeEmpty(parts[0]),
    details: removeEmpty(parts[1]),
    benefits: removeEmpty(parts[2]),
    eligibility: removeEmpty(parts[3]),
    application_process: removeEmpty(parts[4]),
    documents_required: removeEmpty(parts[5]),
    tags: removeEmpty(parts[6]),
    scheme_category: removeEmpty(parts[7])
  };
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    const { rows: [{ count: total }] } = await pool.query('SELECT COUNT(*) FROM government_schemes');
    const { rows: [{ count: done }] } = await pool.query('SELECT COUNT(DISTINCT scheme_id) FROM scheme_translations WHERE lang = $1', [targetLang]);
    
    const remaining = parseInt(total) - parseInt(done);
    const estMinutes = Math.ceil((remaining * 3) / 60);

    console.log(`\n📊 Total schemes: ${total}`);
    console.log(`✅ [${targetLang}] done:    ${done}`);
    console.log(`⏳ Remaining:     ${remaining}`);
    console.log(`⏱  Est. time:     ~${estMinutes} minutes (if no rate limits)`);
    console.log(`🚀 Target Lang:   ${targetLang.toUpperCase()}`);
    console.log(`Tip: Ctrl+C anytime — progress is saved!\n`);

    let processed = parseInt(done);
    let offset = 0;

    while (offset < parseInt(total)) {
      const { rows: schemes } = await pool.query(
        `SELECT
           id, "Scheme Title", "Details", "Benefits", "Eligibility",
           "Application Process (Steps)", "Documents Required", "Tags", "Scheme Category"
         FROM government_schemes ORDER BY id LIMIT $1 OFFSET $2`,
        [BATCH_SIZE, offset]
      );

      if (schemes.length === 0) break;

      for (const scheme of schemes) {
        // Skip if already has translation
        const existing = await pool.query('SELECT id FROM scheme_translations WHERE scheme_id = $1 AND lang = $2', [scheme.id, targetLang]);
        if (existing.rows.length > 0) {
          continue;
        }

        process.stdout.write(`🔄 [${processed + 1}/${total}] Translating Scheme ${scheme.id.slice(0,8)}... \r`);
        
        const translated = await translateSchemeBatched(scheme, targetLang);
        
        if (translated) {
          await pool.query(
            `INSERT INTO scheme_translations
               (scheme_id, lang, title, details, benefits, eligibility, application_process, documents_required, tags, scheme_category)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (scheme_id, lang) DO UPDATE SET
               title=EXCLUDED.title, details=EXCLUDED.details, benefits=EXCLUDED.benefits,
               eligibility=EXCLUDED.eligibility, application_process=EXCLUDED.application_process,
               documents_required=EXCLUDED.documents_required, tags=EXCLUDED.tags, scheme_category=EXCLUDED.scheme_category`,
            [
              scheme.id, targetLang,
              translated.title, translated.details, translated.benefits, translated.eligibility,
              translated.application_process, translated.documents_required, translated.tags, translated.scheme_category
            ]
          );
          processed++;
          const pct = ((processed / parseInt(total)) * 100).toFixed(1);
          console.log(`✅ [${processed}/${total}] (${pct}%) — ${scheme['Scheme Title'].slice(0, 50)}...`);
        } else {
          console.error(`\n⚠ Could not translate scheme #${scheme.id.slice(0,8)} (Skipping)`);
        }

        // Rest briefly so we don't spam Google
        await sleep(1500);
      }
      offset += BATCH_SIZE;
    }

    console.log(`\n\n🎉 [${targetLang.toUpperCase()}] translations complete!`);
  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
