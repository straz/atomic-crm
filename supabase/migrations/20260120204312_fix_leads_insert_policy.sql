-- Drop existing INSERT policies on leads that may be conflicting
DROP POLICY IF EXISTS "Allow anonymous inserts" ON leads;
DROP POLICY IF EXISTS "Allow public lead submission" ON leads;

-- Create INSERT policy for anon role (unauthenticated public form submissions)
CREATE POLICY "leads_anon_insert" ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Create INSERT policy for authenticated role (CRM users)
CREATE POLICY "leads_authenticated_insert" ON leads
FOR INSERT
TO authenticated
WITH CHECK (true);
