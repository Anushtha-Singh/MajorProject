CREATE TABLE government_schemes (
  id SERIAL PRIMARY KEY,
  Title TEXT,
  URL TEXT,
  Details TEXT,
  Benefits TEXT,
  Eligibility TEXT,
  Application_Process TEXT,
  Documents_Required TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO government_schemes (
  title,
  url,
  details,
  benefits,
  eligibility,
  application_process,
  documents_required
) VALUES (
  'Dummy Scheme for Testing',
  'https://dummy-scheme.gov.in',
  'This is a dummy scheme used for testing.',
  'Free testing services and support',
  'All Indian citizens above 18 years',
  'Apply through the dummy scheme portal online',
  'Aadhar card, income certificate'
);

select * from government_schemes
