import { Profile } from './supabase'

export function getRedirectPath(profile: Profile): string {
  const { year, semester, subject_combo } = profile

  console.log('Redirect calculation:', { year, semester, subject_combo })

  if (year === 1) {
    if (subject_combo === 'physics') return '/dashboard1/physics'
    else if (subject_combo === 'chemistry') return '/dashboard1/chemistry'
    // Default fallback for year 1
    return '/dashboard1/physics'
  } else if (year === 2) {
    if (semester === 3) return '/dashboard2/dashboard21'
    else if (semester === 4) return '/dashboard2/dashboard22'
    // Default fallback for year 2
    return '/dashboard2/dashboard21'
  } else if (year === 3) {
    if (semester === 5) return '/dashboard3/dashboard31'
    else if (semester === 6) return '/dashboard3/dashboard32'
    // Default fallback for year 3
    return '/dashboard3/dashboard31'
  } else if (year === 4) {
    if (semester === 7) return '/dashboard4/dashboard41'
    else if (semester === 8) return '/dashboard4/dashboard42'
    // Default fallback for year 4
    return '/dashboard4/dashboard41'
  }

  // Default fallback
  return '/dashboard1/physics'
}

export function mapYearToNumber(yearString: string): number {
  switch (yearString) {
    case '1st year': return 1
    case '2nd year': return 2
    case '3rd year': return 3
    case '4th year': return 4
    default: return 1
  }
}

export function mapSemesterToNumber(semesterString: string): number {
  switch (semesterString) {
    case '1st': return 1
    case '2nd': return 2
    case '3rd': return 3
    case '4th': return 4
    case '5th': return 5
    case '6th': return 6
    case '7th': return 7
    case '8th': return 8
    default: return 1
  }
}

export function mapSubjectComboToValue(subjectCombo: string): string {
  // Map the subject combinations to the expected values
  // If selected value is "1" → subject: Physics & PPS
  // If selected value is "2" → subject: Chemistry & Civil
  switch (subjectCombo) {
    case '1':
    case 'Physics & PPS':
      return 'physics'
    case '2':
    case 'Chemistry & Civil':
      return 'chemistry'
    default:
      return 'physics'
  }
} 