import { NextResponse } from 'next/server';
import { getDb, buildSearchConditions, normalizeSearchTerms } from '@/lib/db';

// GET /api/schemes — List schemes with filters & pagination
export async function GET(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 20));
    const offset = (page - 1) * limit;
    
    // Extract filter parameters
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const benefitType = searchParams.get('benefitType');
    const search = searchParams.get('search') || searchParams.get('q');
    
    // Build WHERE conditions
    let whereConditions = [];
    let params = [];
    
    // Search filter
    if (search) {
      const searchTerms = normalizeSearchTerms(search);
      const { conditions, params: searchParams } = buildSearchConditions(searchTerms);
      if (conditions.length > 0) {
        whereConditions.push(`(${conditions.join(' OR ')})`);
        params = [...params, ...searchParams];
      }
    }
    
    // Category filter
    if (category) {
      params.push(category);
      whereConditions.push(`"Scheme Category" = $${params.length}`);
    }
    
    // Level filter
    if (level) {
      params.push(level.toLowerCase());
      whereConditions.push(`LOWER("Level") = $${params.length}`);
    }
    
    // Benefit Type filter
    if (benefitType) {
      params.push(benefitType.toLowerCase());
      whereConditions.push(`LOWER("Benefit Type") = $${params.length}`);
    }
    
    // Build WHERE clause
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';
    
    // Get total count
    const countResult = await sql.query(`SELECT COUNT(*) FROM government_schemes ${whereClause}`, params);
    const total = parseInt(countResult[0].count);
    
    // Get paginated results
    const dataParams = [...params, limit, offset];
    const data = await sql.query(
      `SELECT * FROM government_schemes ${whereClause} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      dataParams
    );
    
    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: data.length,
      data,
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
}
