import { supabase } from './supabase'

export interface UploadData {
  title: string
  year: string
  semester?: string
  subjectCombo?: string
  subject: string
  type: 'Notes' | 'Assignment'
  description?: string
  file: File
}

export interface UploadResult {
  success: boolean
  error?: string
  filePath?: string
  downloadUrl?: string
}

// Helper function to generate storage path based on form data
export function generateStoragePath(data: UploadData): string {
  const { year, subjectCombo, subject, type } = data
  
  // For 1st year, use subject combination to determine base path
  if (year === "1") {
    const basePath = subjectCombo === "Physics and PPS" ? "1st year/physics" : "1st year/chemistry"
    const typePath = type.toLowerCase() // "notes" or "assignment"
    
    // Map subjects to their correct folder names
    const subjectMap: { [key: string]: string } = {
      // Physics combination subjects
      "Physics": "physics",
      "PPS": "pps", 
      "Human Values": "human value",
      "Mathematics (Common)": "mathematics",
      "BEE": "bee",
      
      // Chemistry combination subjects
      "Chemistry": "chemistry",
      "Civil": "civil",
      "Communication Skill": "communication skill",
      "Mathematics": "mathematics",
      "Mechanical": "mechanical"
    }
    
    const subjectFolder = subjectMap[subject] || subject.toLowerCase()
    
    return `${basePath}/${typePath}/${subjectFolder}`
  }
  
  // For other years, use year/semester structure
  // This can be expanded later for 2nd, 3rd, 4th years
  return `year-${year}/semester-${data.semester}/${type.toLowerCase()}/${subject.toLowerCase()}`
}

// Upload file to Supabase storage
export async function uploadFile(data: UploadData): Promise<UploadResult> {
  try {
    const { file, title } = data
    
    // Generate the storage path
    const storagePath = generateStoragePath(data)
    
    // Create a unique filename
    const timestamp = new Date().getTime()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`
    const fullPath = `${storagePath}/${fileName}`
    
    console.log('Uploading file to path:', fullPath)
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('teacher-uploads') // You'll need to create this bucket
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: uploadError.message
      }
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('teacher-uploads')
      .getPublicUrl(fullPath)
    
    return {
      success: true,
      filePath: fullPath,
      downloadUrl: urlData.publicUrl
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Save upload record to database
export async function saveUploadRecord(data: UploadData, uploadResult: UploadResult) {
  try {
    const { data: record, error } = await supabase
      .from('teacher_uploads')
      .insert({
        title: data.title,
        year: data.year,
        semester: data.semester,
        subject_combo: data.subjectCombo,
        subject: data.subject,
        type: data.type,
        description: data.description,
        file_path: uploadResult.filePath,
        download_url: uploadResult.downloadUrl,
        file_size: data.file.size,
        file_name: data.file.name,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'Approved'
      })
    
    if (error) {
      console.error('Error saving upload record:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data: record }
  } catch (error) {
    console.error('Error saving upload record:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Get uploads for a teacher
export async function getTeacherUploads(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teacher_uploads')
      .select('*')
      .eq('uploaded_by', teacherId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching uploads:', error)
      return { success: false, error: error.message, data: [] }
    }
    
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching uploads:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: [] 
    }
  }
}

// Delete upload (file and database record)
export async function deleteUpload(uploadId: string, teacherId: string) {
  try {
    // First, get the upload record to check permissions and get file path
    const { data: upload, error: fetchError } = await supabase
      .from('teacher_uploads')
      .select('*')
      .eq('id', uploadId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching upload:', fetchError)
      return { success: false, error: 'Upload not found' }
    }
    
    if (!upload) {
      return { success: false, error: 'Upload not found' }
    }
    
    // Check if the teacher owns this upload
    if (upload.uploaded_by !== teacherId) {
      return { success: false, error: 'You can only delete your own uploads' }
    }
    
    // Teachers can delete their own uploads
    // No approval restrictions since everything is auto-approved
    
    // Delete the file from storage if it exists
    if (upload.file_path) {
      const { error: storageError } = await supabase.storage
        .from('teacher-uploads')
        .remove([upload.file_path])
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }
    
    // Delete the database record
    const { error: deleteError } = await supabase
      .from('teacher_uploads')
      .delete()
      .eq('id', uploadId)
      .eq('uploaded_by', teacherId) // Extra safety check
    
    if (deleteError) {
      console.error('Error deleting upload record:', deleteError)
      return { success: false, error: deleteError.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting upload:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 