-- Check if teacher_uploads table exists and create it if needed
-- Run this in your Supabase SQL editor

-- First, check if the table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teacher_uploads') THEN
        -- Create teacher_uploads table
        CREATE TABLE teacher_uploads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          year TEXT NOT NULL,
          semester TEXT,
          subject_combo TEXT,
          subject TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('Notes', 'Assignment')),
          description TEXT,
          file_path TEXT NOT NULL,
          download_url TEXT,
          file_size BIGINT,
          file_name TEXT,
          uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          status TEXT DEFAULT 'Approved' CHECK (status IN ('Approved')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable Row Level Security
        ALTER TABLE teacher_uploads ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Teachers can view own uploads" ON teacher_uploads
          FOR SELECT USING (auth.uid() = uploaded_by);

        CREATE POLICY "Teachers can insert own uploads" ON teacher_uploads
          FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

        CREATE POLICY "Teachers can update own uploads" ON teacher_uploads
          FOR UPDATE USING (auth.uid() = uploaded_by);

        CREATE POLICY "Teachers can delete own uploads" ON teacher_uploads
          FOR DELETE USING (auth.uid() = uploaded_by);

        -- Add policy for students to view approved uploads
        CREATE POLICY "Students can view approved uploads" ON teacher_uploads
          FOR SELECT USING (status = 'Approved');

        -- Create index for better performance
        CREATE INDEX idx_teacher_uploads_uploaded_by ON teacher_uploads(uploaded_by);
        CREATE INDEX idx_teacher_uploads_created_at ON teacher_uploads(created_at);
        CREATE INDEX idx_teacher_uploads_status ON teacher_uploads(status);

        -- Create function to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create trigger to automatically update updated_at
        CREATE TRIGGER update_teacher_uploads_updated_at 
            BEFORE UPDATE ON teacher_uploads 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        RAISE NOTICE 'teacher_uploads table created successfully';
    ELSE
        RAISE NOTICE 'teacher_uploads table already exists';
    END IF;
END $$;

-- Insert some test data
INSERT INTO teacher_uploads (
    title, 
    year, 
    semester, 
    subject_combo, 
    subject, 
    type, 
    description, 
    file_path, 
    download_url, 
    file_size, 
    file_name, 
    uploaded_by, 
    status
) VALUES 
(
    'Test Chemistry Notes',
    '1',
    '1st Semester',
    'Chemistry',
    'Chemistry',
    'Notes',
    'Test chemistry notes for students',
    'test/path/chemistry_notes.pdf',
    'https://example.com/test.pdf',
    1024000,
    'chemistry_notes.pdf',
    (SELECT id FROM auth.users LIMIT 1),
    'Approved'
),
(
    'Test Physics Assignment',
    '1',
    '1st Semester',
    'Physics and PPS',
    'Physics',
    'Assignment',
    'Test physics assignment for students',
    'test/path/physics_assignment.pdf',
    'https://example.com/test2.pdf',
    2048000,
    'physics_assignment.pdf',
    (SELECT id FROM auth.users LIMIT 1),
    'Approved'
)
ON CONFLICT DO NOTHING;

-- Show the data
SELECT * FROM teacher_uploads; 