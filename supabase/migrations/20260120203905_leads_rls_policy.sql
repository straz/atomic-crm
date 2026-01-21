-- Enable RLS on leads table (if not already enabled)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert leads (for public form submissions)
CREATE POLICY "Allow anonymous inserts" ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all leads
CREATE POLICY "Allow authenticated users to view leads" ON leads
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete leads
CREATE POLICY "Allow authenticated users to delete leads" ON leads
FOR DELETE
TO authenticated
USING (true);
