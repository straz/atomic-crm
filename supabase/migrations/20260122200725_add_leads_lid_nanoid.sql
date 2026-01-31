-- Add lid column (nanoid will be generated client-side)
ALTER TABLE leads
ADD COLUMN lid text;

-- Backfill existing rows with simple random IDs
UPDATE leads SET lid = substr(md5(random()::text), 1, 10) WHERE lid IS NULL;

-- Make NOT NULL after backfill
ALTER TABLE leads
ALTER COLUMN lid SET NOT NULL;

-- Add unique constraint
ALTER TABLE leads
ADD CONSTRAINT leads_lid_unique UNIQUE (lid);

-- Create index for fast lookups by lid
CREATE INDEX idx_leads_lid ON leads (lid);
