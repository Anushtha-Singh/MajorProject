// Utility functions for building search queries with multiple keywords

function buildSearchQuery(searchTerms) {
  let whereClause = '';
  let params = [];
  
  if (searchTerms && searchTerms.length > 0) {
    const conditions = [];
    searchTerms.forEach((term, index) => {
      const paramIndex = index + 1;
      conditions.push(`(title ILIKE $${paramIndex} OR details ILIKE $${paramIndex} OR eligibility ILIKE $${paramIndex})`);
      params.push(`%${term}%`);
    });
    whereClause = `WHERE ${conditions.join(' OR ')}`;
  }
  
  return { whereClause, params };
}

function normalizeSearchTerms(keywords) {
  // Handle both single keyword (string) and multiple keywords (array)
  return Array.isArray(keywords) ? keywords : [keywords];
}

module.exports = {
  buildSearchQuery,
  normalizeSearchTerms
};
