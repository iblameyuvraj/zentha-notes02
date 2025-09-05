import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })
  

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error in middleware:', sessionError)
      // Continue with the request even if there's a session error
      // This allows for better handling of concurrent sessions
    }

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/', '/test-db', '/debug-profile', '/pay']
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    
    // Define dashboard routes that require subscription
    const dashboardRoutes = ['/dashboard1', '/dashboard2', '/dashboard3', '/dashboard4']
    const isDashboardRoute = dashboardRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // If user is not signed in and trying to access a protected route
    if (!session && !isPublicRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access login/signup, check subscription and redirect accordingly
    if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup'))) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_active, subscription_end_date, year, semester, subject_combo')
          .eq('id', session.user.id)
          .single()

        const hasActiveSubscription = profile?.subscription_active && 
          (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date())

        const redirectUrl = req.nextUrl.clone()
        
        if (hasActiveSubscription && profile) {
          // User has subscription, redirect to their dashboard
          const { getRedirectPath } = await import('@/lib/redirect-utils')
          // Create complete profile object with required fields
          const completeProfile = {
            ...profile,
            id: session.user.id,
            email: session.user.email || ''
          }
          redirectUrl.pathname = getRedirectPath(completeProfile)
        } else {
          // User doesn't have subscription, redirect to payment page
          redirectUrl.pathname = '/pay'
        }
        
        return NextResponse.redirect(redirectUrl)
      } catch (error) {
        console.error('Error checking subscription in middleware:', error)
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/pay'
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Check subscription for dashboard routes
    if (session && isDashboardRoute) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_active, subscription_end_date')
          .eq('id', session.user.id)
          .single()

        const hasActiveSubscription = profile?.subscription_active && 
          (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date())

        if (!hasActiveSubscription) {
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = '/pay'
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        console.error('Error checking subscription in middleware:', error)
        // On error, redirect to pay page for safety
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/pay'
        return NextResponse.redirect(redirectUrl)
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to continue
    // This prevents blocking legitimate requests due to session issues
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 