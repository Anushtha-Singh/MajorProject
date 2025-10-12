// Utility functions for building search queries with multiple keywords

function buildSearchQuery(searchTerms, tableAlias = 'gs') {
  let whereClause = '';
  let params = [];
  
  if (searchTerms && searchTerms.length > 0) {
    const conditions = [];
    searchTerms.forEach((term, index) => {
      const paramIndex = index + 1;
      // Search in specific columns for better performance
      conditions.push(`(
        ${tableAlias}."Scheme Title" ILIKE $${paramIndex} OR 
        ${tableAlias}."Details" ILIKE $${paramIndex} OR 
        ${tableAlias}."Benefits" ILIKE $${paramIndex} OR 
        ${tableAlias}."Eligibility" ILIKE $${paramIndex} OR 
        ${tableAlias}."Tags" ILIKE $${paramIndex}
      )`);
      params.push(`%${term}%`);
    });
    whereClause = `WHERE ${conditions.join(' OR ')}`;
  }
  
  return { whereClause, params };
}

function normalizeSearchTerms(keywords) {
  // Accept repeated q params (?q=a&q=b), comma-separated (?q=a,b), or space-separated (?q=a b)
  if (Array.isArray(keywords)) {
    return keywords
      .map(k => (typeof k === 'string' ? k.trim() : ''))
      .filter(k => k.length > 0);
  }

  if (typeof keywords === 'string') {
    const parts = keywords
      .split(/[\s,]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    return parts;
  }

  return [];
}

module.exports = {
  buildSearchQuery,
  normalizeSearchTerms
};
