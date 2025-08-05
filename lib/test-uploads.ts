import { supabase } from './supabase'

export async function testTeacherUploads() {
  try {
    console.log('Testing teacher_uploads table...')
    
    // Test 1: Check if table exists
    const { data: tableData, error: tableError } = await supabase
      .from('teacher_uploads')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.error('Table access error:', tableError)
      return { success: false, error: tableError.message }
    }
    
    console.log('✅ Table exists and is accessible')
    
    // Test 2: Get total count
    const { count, error: countError } = await supabase
      .from('teacher_uploads')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Count error:', countError)
      return { success: false, error: countError.message }
    }
    
    console.log(`✅ Total records: ${count}`)
    
    // Test 3: Get approved uploads
    const { data: approvedData, error: approvedError } = await supabase
      .from('teacher_uploads')
      .select('*')
      .eq('status', 'Approved')
      .limit(5)
    
    if (approvedError) {
      console.error('Approved uploads error:', approvedError)
      return { success: false, error: approvedError.message }
    }
    
    console.log(`✅ Approved uploads: ${approvedData?.length || 0}`)
    console.log('Sample data:', approvedData)
    
    return { 
      success: true, 
      totalCount: count,
      approvedCount: approvedData?.length || 0,
      sampleData: approvedData
    }
    
  } catch (error) {
    console.error('Test error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 