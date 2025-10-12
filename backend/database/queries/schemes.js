const pool = require('../index');
const { buildSearchQuery, normalizeSearchTerms } = require('./searchUtils');

async function getAllSchemes(page = 1, limit = 20, filters = {}) {
  const offset = (page - 1) * limit;
  
  // Build WHERE clause based on filters
  let whereConditions = [];
  let params = [];
  let paramCount = 0;
  
  // Search filter
  if (filters.search) {
    const searchTerms = normalizeSearchTerms(filters.search);
    const { whereClause, params: searchParams } = buildSearchQuery(searchTerms, 'gs');
    whereConditions.push(whereClause.replace('WHERE ', ''));
    params = [...params, ...searchParams];
    paramCount += searchParams.length;
  }
  
  // Category filter
  if (filters.category) {
    paramCount++;
    whereConditions.push(`gs."Scheme Category" = $${paramCount}`);
    params.push(filters.category);
  }
  
  // Level filter
  if (filters.level) {
    paramCount++;
    whereConditions.push(`LOWER(gs."Level") = $${paramCount}`);
    params.push(filters.level.toLowerCase());
  }
  
  // Benefit Type filter
  if (filters.benefitType) {
    paramCount++;
    whereConditions.push(`LOWER(gs."Benefit Type") = $${paramCount}`);
    params.push(filters.benefitType.toLowerCase());
  }
  
  // Build final query
  let query = 'SELECT * FROM government_schemes gs';
  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }
  query += ' ORDER BY gs.id DESC';
  query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  
  params.push(limit, offset);
  
  const result = await pool.query(query, params);
  return result.rows;
}

async function getSchemeById(id) {
  const result = await pool.query('SELECT * FROM government_schemes WHERE id = $1', [id]);
  return result.rows[0];
}

async function searchSchemes(keywords, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const searchTerms = normalizeSearchTerms(keywords);
  const { whereClause, params } = buildSearchQuery(searchTerms, 'gs');
  
  const result = await pool.query(
    `SELECT * FROM government_schemes gs
     ${whereClause}
     ORDER BY gs.id DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return result.rows;
}

// Get total count for pagination metadata
async function getTotalCount(filters = {}) {
  let query = 'SELECT COUNT(*) FROM government_schemes gs';
  let params = [];
  let paramCount = 0;
  
  // Build WHERE clause based on filters
  let whereConditions = [];
  
  // Search filter
  if (filters.search) {
    const searchTerms = normalizeSearchTerms(filters.search);
    const { whereClause, params: searchParams } = buildSearchQuery(searchTerms, 'gs');
    whereConditions.push(whereClause.replace('WHERE ', ''));
    params = [...params, ...searchParams];
    paramCount += searchParams.length;
  }
  
  // Category filter
  if (filters.category) {
    paramCount++;
    whereConditions.push(`gs."Scheme Category" = $${paramCount}`);
    params.push(filters.category);
  }
  
  // Level filter
  if (filters.level) {
    paramCount++;
    whereConditions.push(`LOWER(gs."Level") = $${paramCount}`);
    params.push(filters.level.toLowerCase());
  }
  
  // Benefit Type filter
  if (filters.benefitType) {
    paramCount++;
    whereConditions.push(`LOWER(gs."Benefit Type") = $${paramCount}`);
    params.push(filters.benefitType.toLowerCase());
  }
  
  // Add WHERE clause if we have conditions
  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count);
}

// Get category counts for filtering
async function getCategoryCounts() {
  const result = await pool.query(`
    SELECT 
      "Scheme Category" as category,
      COUNT(*) as count
    FROM government_schemes 
    WHERE "Scheme Category" IS NOT NULL 
    GROUP BY "Scheme Category"
    ORDER BY count DESC
  `);
  return result.rows;
}

module.exports = {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  getTotalCount,
  getCategoryCounts
};
