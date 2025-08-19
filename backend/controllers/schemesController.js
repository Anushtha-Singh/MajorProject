const schemeService = require('../database/queries/schemes');

function validatePagination(pageQuery, limitQuery) {
  let page = parseInt(pageQuery);
  let limit = parseInt(limitQuery);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 20;
  return { page, limit };
}

exports.getAllSchemes = async (req, res) => {
  try {
    const { page, limit } = validatePagination(req.query.page, req.query.limit);
    
    const schemes = await schemeService.getAllSchemes(page, limit);
    const totalCount = await schemeService.getTotalCount();
    
    res.json({
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      results: schemes.length,
      data: schemes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSchemeById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Validate UUID (Supabase uses uuid for primary keys commonly)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid ID parameter. ID must be a valid UUID.' });
    }
    
    const scheme = await schemeService.getSchemeById(id);
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchSchemes = async (req, res) => {
  try {
    const keyword = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const schemes = await schemeService.searchSchemes(keyword, page, limit);
    const totalCount = await schemeService.getTotalCount(keyword);
    
    res.json({
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      results: schemes.length,
      data: schemes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const totalCount = await schemeService.getTotalCount();
    
    res.json({
      totalSchemes: totalCount,
      message: 'Government schemes summary',
      endpoints: {
        getAll: '/api/',
        search: '/api/search?q=keyword',
        getById: '/api/:id',
        summary: '/api/summary'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

