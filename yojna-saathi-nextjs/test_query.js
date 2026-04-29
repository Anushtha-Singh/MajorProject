import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://neondb_owner:npg_wONXG78MbQPY@ep-bold-unit-ao0niqan.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
const query = `SELECT g."Scheme Title" as orig_title, t.title as hi_title, t.tags as hi_tags FROM government_schemes g LEFT JOIN scheme_translations t ON g.id = t.scheme_id AND t.lang = 'hi' LIMIT 5`;
pool.query(query).then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  pool.end();
});
