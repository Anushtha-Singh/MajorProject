import { NextResponse } from 'next/server';
import { getDb, buildSearchConditions, normalizeSearchTerms } from '@/lib/db';

export const runtime = 'edge';

const SUPPORTED_LANGS = ['hi','bn','ta','te','mr','gu','kn','ml','pa','ur'];

// GET /api/schemes — List schemes with filters, pagination, and optional translation
export async function GET(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 20));
    const offset = (page - 1) * limit;
    
    // Language param — e.g. ?lang=hi
    const rawLang = (searchParams.get('lang') || 'en').toLowerCase();
    const lang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : 'en';

    // Extract filter parameters
    const category    = searchParams.get('category');
    const level       = searchParams.get('level');
    const benefitType = searchParams.get('benefitType');
    const search      = searchParams.get('search') || searchParams.get('q');
    
    // Build WHERE conditions
    let whereConditions = [];
    let params = [];
    
    // Search filter
    if (search) {
      const searchTerms = normalizeSearchTerms(search);
      const { conditions, params: sParams } = buildSearchConditions(searchTerms);
      if (conditions.length > 0) {
        whereConditions.push(`(${conditions.join(' OR ')})`);
        params = [...params, ...sParams];
      }
    }
    
    // Category filter
    if (category) {
      params.push(`%${category.toLowerCase()}%`);
      whereConditions.push(`(LOWER("Scheme Category") LIKE $${params.length} OR LOWER("Tags") LIKE $${params.length})`);
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
    
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    // Get total count
    const countResult = await sql.query(
      `SELECT COUNT(*) FROM government_schemes ${whereClause}`,
      params
    );
    const total = parseInt(countResult[0].count);
    
    // Build query — if lang is not English, LEFT JOIN with translations table
    let dataQuery;
    let dataParams = [...params, limit, offset];

    if (lang === 'en') {
      // Plain English — no join needed
      dataQuery = `
        SELECT * FROM government_schemes
        ${whereClause}
        ORDER BY id DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
    } else {
      // Translated — LEFT JOIN so we always get a row even if not yet translated
      dataParams = [...params, lang, limit, offset];
      dataQuery = `
        SELECT
          g.*,
          COALESCE(t.title,                g."Scheme Title")                AS "Scheme Title",
          COALESCE(t.details,              g."Details")                    AS "Details",
          COALESCE(t.benefits,             g."Benefits")                   AS "Benefits",
          COALESCE(t.eligibility,          g."Eligibility")                AS "Eligibility",
          COALESCE(t.application_process,  g."Application Process (Steps)") AS "Application Process (Steps)",
          COALESCE(t.documents_required,   g."Documents Required")         AS "Documents Required",
          COALESCE(t.tags,                 g."Tags")                       AS "Tags",
          COALESCE(t.scheme_category,      g."Scheme Category")            AS "Scheme Category",
          CASE WHEN t.id IS NOT NULL THEN true ELSE false END AS "isTranslated"
        FROM government_schemes g
        LEFT JOIN scheme_translations t
          ON t.scheme_id = g.id AND t.lang = $${params.length + 1}
        ${whereClause}
        ORDER BY g.id DESC
        LIMIT $${params.length + 2} OFFSET $${params.length + 3}
      `;
    }

    const data = await sql.query(dataQuery, dataParams);
    
    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: data.length,
      lang,
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
