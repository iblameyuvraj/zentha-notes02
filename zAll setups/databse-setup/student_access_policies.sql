-- Add policies to allow students to view approved teacher uploads
-- This should be run after the teacher_uploads table is created

-- Policy to allow all authenticated users to view approved uploads
CREATE POLICY "Students can view approved uploads" ON teacher_uploads
  FOR SELECT USING (status = 'Approved');

-- Note: The existing teacher policies remain unchanged
-- Teachers can still only view/edit/delete their own uploads
-- But students can view all approved uploads 