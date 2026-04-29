-- ============================================================
-- Run this SQL in your Neon dashboard:
-- https://console.neon.tech → Your Project → SQL Editor
-- ============================================================

-- Create the translations table
CREATE TABLE IF NOT EXISTS scheme_translations (
  id                   SERIAL PRIMARY KEY,
  scheme_id            UUID NOT NULL,
  lang                 VARCHAR(10) NOT NULL,
  title                TEXT,
  details              TEXT,
  benefits             TEXT,
  eligibility          TEXT,
  application_process  TEXT,
  documents_required   TEXT,
  tags                 TEXT,
  scheme_category      TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scheme_id, lang)
);

-- Index for fast lookups by scheme + language
CREATE INDEX IF NOT EXISTS idx_scheme_translations_lookup
  ON scheme_translations(scheme_id, lang);

-- Index for fetching all translations for a given language
CREATE INDEX IF NOT EXISTS idx_scheme_translations_lang
  ON scheme_translations(lang);

-- Verify it worked
SELECT 'scheme_translations table created successfully!' AS status;
