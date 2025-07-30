import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Database connection successful')
    return { success: true }
  } catch (error) {
    console.error('Test failed:', error)
    return { success: false, error: String(error) }
  }
} 