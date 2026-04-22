import { NextResponse } from 'next/server';
import { getDb, buildSearchConditions, normalizeSearchTerms } from '@/lib/db';

// GET /api/schemes/search?q=keyword — Search schemes
export async function GET(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    
    const keyword = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 20));
    const offset = (page - 1) * limit;
    
    const searchTerms = normalizeSearchTerms(keyword);
    const { conditions, params } = buildSearchConditions(searchTerms);
    
    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' OR ') 
      : '';
    
    // Get total count
    const countResult = await sql(
      `SELECT COUNT(*) FROM government_schemes ${whereClause}`,
      params
    );
    const total = parseInt(countResult[0].count);
    
    // Get paginated results
    const dataParams = [...params, limit, offset];
    const data = await sql(
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
    console.error('Error searching schemes:', error);
    return NextResponse.json(
      { error: 'Failed to search schemes' },
      { status: 500 }
    );
  }
}
