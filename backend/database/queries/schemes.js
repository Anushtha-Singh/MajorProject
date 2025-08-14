const pool = require('../index');
const { buildSearchQuery, normalizeSearchTerms } = require('./searchUtils');

async function getAllSchemes(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    'SELECT * FROM government_schemes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

async function getSchemeById(id) {
  const result = await pool.query('SELECT * FROM government_schemes WHERE id = $1', [id]);
  return result.rows[0];
}

async function searchSchemes(keywords, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const searchTerms = normalizeSearchTerms(keywords);
  const { whereClause, params } = buildSearchQuery(searchTerms);
  
  const result = await pool.query(
    `SELECT * FROM government_schemes
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return result.rows;
}

// Get total count for pagination metadata
async function getTotalCount(keywords = '') {
  let query = 'SELECT COUNT(*) FROM government_schemes';
  let params = [];
  
  if (keywords) {
    const searchTerms = normalizeSearchTerms(keywords);
    const { whereClause, params: searchParams } = buildSearchQuery(searchTerms);
    query += ` ${whereClause}`;
    params = searchParams;
  }
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count);
}

module.exports = {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  getTotalCount
};
