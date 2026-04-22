import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/schemes/summary — Get category counts and summary
export async function GET() {
  try {
    const sql = getDb();
    
    // Get total count
    const countResult = await sql('SELECT COUNT(*) FROM government_schemes');
    const totalSchemes = parseInt(countResult[0].count);
    
    // Get category counts
    const categoryCounts = await sql(`
      SELECT 
        "Scheme Category" as category,
        COUNT(*) as count
      FROM government_schemes 
      WHERE "Scheme Category" IS NOT NULL 
      GROUP BY "Scheme Category"
      ORDER BY count DESC
    `);
    
    return NextResponse.json({
      totalSchemes,
      categoryCounts,
      message: 'Government schemes summary',
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
