import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

// GET /api/schemes/[id] — Get scheme by ID
export async function GET(request, { params }) {
  try {
    const sql = getDb();
    const { id } = await params;
    
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid ID parameter. ID must be a valid UUID.' },
        { status: 400 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    let query, queryParams;
    
    if (lang === 'en') {
      query = 'SELECT * FROM government_schemes WHERE id = $1';
      queryParams = [id];
    } else {
      query = `
        SELECT
          g.*,
          COALESCE(t.title,                g."Scheme Title")                AS "Scheme Title",
          COALESCE(t.details,              g."Details")                    AS "Details",
          COALESCE(t.benefits,             g."Benefits")                   AS "Benefits",
          COALESCE(t.eligibility,          g."Eligibility")                AS "Eligibility",
          COALESCE(t.application_process,  g."Application Process (Steps)") AS "Application Process (Steps)",
          COALESCE(t.documents_required,   g."Documents Required")         AS "Documents Required",
          COALESCE(t.tags,                 g."Tags")                       AS "Tags",
          COALESCE(t.scheme_category,      g."Scheme Category")            AS "Scheme Category"
        FROM government_schemes g
        LEFT JOIN scheme_translations t ON t.scheme_id = g.id AND t.lang = $2
        WHERE g.id = $1
      `;
      queryParams = [id, lang];
    }
    
    const result = await sql.query(query, queryParams);
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching scheme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheme' },
      { status: 500 }
    );
  }
}
