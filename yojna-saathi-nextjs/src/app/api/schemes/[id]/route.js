import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

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
    
    const result = await sql.query('SELECT * FROM government_schemes WHERE id = $1', [id]);
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Scheme not found' },
        { status: 404 }
      );
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
