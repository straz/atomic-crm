-- Drop all existing leads policies and recreate clean ones
DROP POLICY IF EXISTS "Allow authenticated read on leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated update on leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated delete on leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to delete leads" ON leads;
DROP POLICY IF EXISTS "leads_anon_insert" ON leads;
DROP POLICY IF EXISTS "leads_authenticated_insert" ON leads;

-- Recreate all policies cleanly
CREATE POLICY "leads_select" ON leads
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "leads_insert_anon" ON leads
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "leads_insert_authenticated" ON leads
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "leads_update" ON leads
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "leads_delete" ON leads
FOR DELETE TO authenticated
USING (true);
