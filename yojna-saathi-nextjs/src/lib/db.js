import { neon } from '@neondatabase/serverless';

// Create a SQL query function using Neon's serverless driver
// This works on edge runtimes (Cloudflare Workers, Vercel Edge, etc.)
export function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

// Helper: Build search query with multiple keywords
export function buildSearchConditions(searchTerms) {
  if (!searchTerms || searchTerms.length === 0) return { conditions: [], params: [] };
  
  const conditions = [];
  const params = [];
  
  searchTerms.forEach((term) => {
    const paramValue = `%${term}%`;
    conditions.push(`(
      "Scheme Title" ILIKE $${params.length + 1} OR 
      "Details" ILIKE $${params.length + 1} OR 
      "Benefits" ILIKE $${params.length + 1} OR 
      "Eligibility" ILIKE $${params.length + 1} OR 
      "Tags" ILIKE $${params.length + 1}
    )`);
    params.push(paramValue);
  });
  
  return { conditions, params };
}

// Helper: Normalize search terms from query string
export function normalizeSearchTerms(keywords) {
  if (!keywords || typeof keywords !== 'string') return [];
  return keywords
    .split(/[\s,]+/)
    .map(k => k.trim())
    .filter(k => k.length > 0);
}
