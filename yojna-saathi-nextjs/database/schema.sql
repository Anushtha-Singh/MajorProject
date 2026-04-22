-- Yojna Saathi Database Schema for Neon PostgreSQL
-- Run this in Neon SQL Editor to create the required table

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the government_schemes table
CREATE TABLE IF NOT EXISTS government_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Scheme Title" TEXT,
  "URL" TEXT,
  "Details" TEXT,
  "Benefits" TEXT,
  "Eligibility" TEXT,
  "Application Process (Steps)" TEXT,
  "Documents Required" TEXT,
  "Tags" TEXT,
  "Scheme Category" TEXT,
  "Level" TEXT,
  "Benefit Type" TEXT,
  "Department/State" TEXT,
  "Sources & References" TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_schemes_category ON government_schemes("Scheme Category");
CREATE INDEX IF NOT EXISTS idx_schemes_level ON government_schemes("Level");
CREATE INDEX IF NOT EXISTS idx_schemes_benefit_type ON government_schemes("Benefit Type");
CREATE INDEX IF NOT EXISTS idx_schemes_title ON government_schemes("Scheme Title");

-- Insert a sample scheme for testing
INSERT INTO government_schemes (
  "Scheme Title",
  "URL",
  "Details",
  "Benefits",
  "Eligibility",
  "Application Process (Steps)",
  "Documents Required",
  "Tags",
  "Scheme Category",
  "Level",
  "Benefit Type",
  "Department/State",
  "Sources & References"
) VALUES (
  'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
  'https://pmkisan.gov.in/',
  'Direct income support scheme providing financial benefit to all landholding farmers families across the country to supplement their financial needs for procuring various inputs related to agriculture.',
  '["₹6,000 per year in three equal installments of ₹2,000 each", "Direct bank transfer", "No intermediary involved"]',
  '["Small and marginal farmers", "Landholding families with cultivable land", "Must have Aadhaar card"]',
  '["Visit nearest Common Service Centre (CSC)", "Provide Aadhaar number and bank account details", "Submit land records", "Application will be processed and verified"]',
  '["Aadhaar Card", "Bank Account Details", "Land Records", "Mobile Number"]',
  '["Agriculture", "Farmer", "Direct Benefit Transfer", "Central Scheme"]',
  'Agriculture, Rural & Environment',
  'Central',
  'Cash',
  'Ministry of Agriculture & Farmers Welfare',
  '["https://pmkisan.gov.in/", "Ministry of Agriculture & Farmers Welfare"]'
);

-- Verify the insert
SELECT COUNT(*) as total_schemes FROM government_schemes;
