import { supabase } from './supabase'
import { uploadFile, saveUploadRecord, getTeacherUploads } from './storage'

// Test function to verify storage setup
export async function testStorageSetup() {
  console.log('Testing Supabase Storage Setup...')
  
  try {
    // Test 1: Check if bucket exists
    console.log('1. Checking if teacher-uploads bucket exists...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('Error listing buckets:', bucketError)
      return false
    }
    
    const teacherUploadsBucket = buckets.find(bucket => bucket.name === 'teacher-uploads')
    if (!teacherUploadsBucket) {
      console.error('❌ teacher-uploads bucket not found!')
      console.log('Available buckets:', buckets.map(b => b.name))
      return false
    }
    
    console.log('✅ teacher-uploads bucket found')
    
    // Test 2: Check if user is authenticated
    console.log('2. Checking authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ User not authenticated:', authError)
      return false
    }
    
    console.log('✅ User authenticated:', user.email)
    
    // Test 3: Check if teacher_uploads table exists
    console.log('3. Checking teacher_uploads table...')
    const { data: tableData, error: tableError } = await supabase
      .from('teacher_uploads')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.error('❌ teacher_uploads table not found or accessible:', tableError)
      return false
    }
    
    console.log('✅ teacher_uploads table accessible')
    
    // Test 4: Test file upload (with a small test file)
    console.log('4. Testing file upload...')
    
    // Create a test file
    const testContent = 'This is a test file for storage verification'
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
    
    const testUploadData = {
      title: 'Test Upload',
      year: '1',
      subjectCombo: 'Physics and PPS',
      subject: 'Physics',
      type: 'Notes' as const,
      description: 'Test upload for storage verification',
      file: testFile
    }
    
    const uploadResult = await uploadFile(testUploadData)
    
    if (!uploadResult.success) {
      console.error('❌ File upload failed:', uploadResult.error)
      return false
    }
    
    console.log('✅ File upload successful:', uploadResult.filePath)
    
    // Test 5: Save upload record
    console.log('5. Testing database record creation...')
    const saveResult = await saveUploadRecord(testUploadData, uploadResult)
    
    if (!saveResult.success) {
      console.error('❌ Database record creation failed:', saveResult.error)
      return false
    }
    
    console.log('✅ Database record created successfully')
    
    // Test 6: Fetch teacher uploads
    console.log('6. Testing upload retrieval...')
    const fetchResult = await getTeacherUploads(user.id)
    
    if (!fetchResult.success) {
      console.error('❌ Upload retrieval failed:', fetchResult.error)
      return false
    }
    
    console.log('✅ Upload retrieval successful, found', fetchResult.data.length, 'uploads')
    
    console.log('🎉 All storage tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
}

// Function to clean up test data
export async function cleanupTestData() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    // Delete test uploads from database
    const { error: dbError } = await supabase
      .from('teacher_uploads')
      .delete()
      .eq('title', 'Test Upload')
    
    if (dbError) {
      console.error('Error cleaning up database:', dbError)
    }
    
    // Delete test files from storage
    const { data: files, error: listError } = await supabase.storage
      .from('teacher-uploads')
      .list('1st year/physics/notes/physics')
    
    if (!listError && files) {
      for (const file of files) {
        if (file.name.includes('Test_Upload')) {
          const { error: deleteError } = await supabase.storage
            .from('teacher-uploads')
            .remove([`1st year/physics/notes/physics/${file.name}`])
          
          if (deleteError) {
            console.error('Error deleting test file:', deleteError)
          }
        }
      }
    }
    
    console.log('🧹 Test data cleaned up')
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
} 