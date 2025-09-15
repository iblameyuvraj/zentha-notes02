import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Cache for subscription status to avoid repeated DB calls
const subscriptionCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache

// Pre-initialize service client to avoid repeated creation
let serviceClient: any = null;
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { 
      auth: { persistSession: false },
      db: { schema: 'public' },
      global: { headers: { 'x-application-name': 'zentha-subscription-check' } }
    }
  );
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Fast auth extraction - prefer Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    let userId: string | null = null;
    
    if (token) {
      // Fast token validation using service client if available
      if (serviceClient) {
        try {
          // Add timeout to prevent hanging requests
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth timeout')), 5000)
          );
          
          const { data: { user }, error } = await Promise.race([
            serviceClient.auth.getUser(token),
            timeoutPromise
          ]) as any;
          if (!error && user) userId = user.id;
        } catch (e) {
          console.warn('Service client auth failed, falling back to regular client:', e instanceof Error ? e.message : 'Unknown error');
          // Fallback to regular client
        }
      }
      
      if (!userId) {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) { return request.cookies.get(name)?.value },
              set() {},
              remove() {},
            },
          }
        );
        
        try {
          // Add timeout for fallback client too
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fallback auth timeout')), 5000)
          );
          
          const { data: { user }, error } = await Promise.race([
            supabase.auth.getUser(token),
            timeoutPromise
          ]) as any;
          if (!error && user) userId = user.id;
        } catch (e) {
          console.warn('Fallback client auth also failed:', e instanceof Error ? e.message : 'Unknown error');
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check cache first
    const cacheKey = `subscription_${userId}`;
    const cached = subscriptionCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        responseTime: Date.now() - startTime
      });
    }

    // Use service client for faster DB access
    const client = serviceClient || createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value },
          set() {},
          remove() {},
        },
      }
    );

    // Optimized query - only select necessary fields
    const { data: profile, error } = await client
      .from('profiles')
      .select('subscription_active, subscription_end_date, subscription_plan, year, semester, subject_combo')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Subscription status fetch error:', error);
      return NextResponse.json({ 
        error: 'Unable to fetch subscription', 
        details: error.message,
        responseTime: Date.now() - startTime
      }, { status: 500 });
    }

    // Fast boolean check
    const hasActive = !!(profile?.subscription_active && 
      (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date()));

    const responseData = { 
      success: true, 
      hasActive, 
      profile: { ...profile, id: userId },
      responseTime: Date.now() - startTime
    };

    // Cache the result
    subscriptionCache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    // Clean old cache entries periodically
    if (subscriptionCache.size > 1000) {
      const cutoff = now - CACHE_DURATION;
      for (const [key, value] of subscriptionCache.entries()) {
        if (value.timestamp < cutoff) {
          subscriptionCache.delete(key);
        }
      }
    }

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Subscription status route error:', err);
    return NextResponse.json({ 
      error: 'Internal error',
      responseTime: Date.now() - startTime
    }, { status: 500 });
  }
}
