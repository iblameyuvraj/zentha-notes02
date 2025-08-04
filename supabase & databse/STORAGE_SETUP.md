# Supabase Storage Setup Guide

## Prerequisites

1. You have a Supabase project set up
2. You have the database tables created (profiles, teacher_uploads)
3. You have the environment variables configured

## Storage Bucket Setup

### 1. Create Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Set the following configuration:
   - **Name**: `teacher-uploads`
   - **Public bucket**: ✅ Check this option
   - **File size limit**: 25 MB (or your preferred limit)
   - **Allowed MIME types**: 
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `image/jpeg`
     - `image/png`
     - `image/gif`
     - `application/zip`
     - `application/x-7z-compressed`

### 2. Configure Storage Policies

After creating the bucket, go to **Storage > Policies** and add the following policies:

#### Policy 1: Allow authenticated users to upload files
```sql
-- Name: "Allow authenticated users to upload files"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```



#### Policy 2: Allow users to view their own uploads
```sql
-- Name: "Allow users to view their own uploads"
-- Operation: SELECT
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```



#### Policy 3: Allow users to update their own uploads
```sql
-- Name: "Allow users to update their own uploads"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```



#### Policy 4: Allow users to delete their own uploads
```sql
-- Name: "Allow users to delete their own uploads"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

### 3. Folder Structure

The storage bucket will automatically create the following folder structure based on uploads:

```
teacher-uploads/
├── 1st year/
│   ├── physics/
│   │   ├── notes/
│   │   │   ├── physics/
│   │   │   ├── pps/
│   │   │   ├── mathematics/
│   │   │   ├── human value/
│   │   │   └── bee/
│   │   └── assignment/
│   │       ├── physics/
│   │       ├── pps/
│   │       ├── mathematics/
│   │       ├── human value/
│   │       └── bee/
│   └── chemistry/
│       ├── notes/
│       │   ├── chemistry/
│       │   ├── civil/
│       │   ├── communication skill/
│       │   ├── mathematics/
│       │   └── mechanical/
│       └── assignment/
│           ├── chemistry/
│           ├── civil/
│           ├── communication skill/
│           ├── mathematics/
│           └── mechanical/
└── year-2/ (for future years)
    └── semester-3/
        ├── notes/
        └── assignment/
```

## Database Setup

### 1. Create teacher_uploads table

Run the SQL from `supabase & databse/databse-setup/teacher_uploads.sql` in your Supabase SQL editor.

### 2. Verify the table structure

The table should have the following columns:
- `id` (UUID, Primary Key)
- `title` (TEXT, NOT NULL)
- `year` (TEXT, NOT NULL)
- `semester` (TEXT)
- `subject_combo` (TEXT)
- `subject` (TEXT, NOT NULL)
- `type` (TEXT, NOT NULL, CHECK constraint)
- `description` (TEXT)
- `file_path` (TEXT, NOT NULL)
- `download_url` (TEXT)
- `file_size` (BIGINT)
- `file_name` (TEXT)
- `uploaded_by` (UUID, Foreign Key to auth.users)
- `status` (TEXT, DEFAULT 'Pending')
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Setup

1. **Test Upload**: Try uploading a file through the teacher dashboard
2. **Check Storage**: Verify the file appears in the correct folder in Supabase Storage
3. **Check Database**: Verify the upload record appears in the `teacher_uploads` table
4. **Test Download**: Click the download button to verify the file can be accessed

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Ensure the bucket name is exactly `teacher-uploads`
   - Check that the bucket is created in the correct project

2. **"Policy violation" error**
   - Verify all storage policies are correctly configured
   - Check that the user is authenticated

3. **"File too large" error**
   - Check the file size limit in bucket settings
   - Ensure the file is under 25MB

4. **"Invalid MIME type" error**
   - Check the allowed MIME types in bucket settings
   - Ensure the file type is supported

### Debug Steps

1. Check browser console for detailed error messages
2. Verify Supabase client configuration
3. Check network tab for failed requests
4. Verify user authentication status

## Security Considerations

1. **File Validation**: The application validates file types and sizes before upload
2. **User Isolation**: Users can only access their own uploads
3. **Public Access**: Files are publicly accessible via download URLs
4. **Rate Limiting**: Consider implementing rate limiting for uploads

## Performance Optimization

1. **File Compression**: Consider compressing large files before upload
2. **CDN**: Supabase automatically serves files through a CDN
3. **Caching**: Files are cached for 1 hour (configurable)
4. **Batch Operations**: For multiple files, consider batch uploads 