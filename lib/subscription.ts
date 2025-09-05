import { createClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function checkUserSubscription(userId?: string) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    let currentUserId = userId;
    
    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      currentUserId = user.id;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_active, subscription_end_date')
      .eq('id', currentUserId)
      .single();

    if (error || !profile) {
      return false;
    }

    // Check if subscription is active and not expired
    const isActive = profile.subscription_active;
    const endDate = profile.subscription_end_date ? new Date(profile.subscription_end_date) : null;
    const now = new Date();

    return isActive && (!endDate || endDate > now);
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

export async function requireSubscription() {
  const hasSubscription = await checkUserSubscription();
  
  if (!hasSubscription) {
    return {
      redirect: {
        destination: '/pay',
        permanent: false,
      },
    };
  }
  
  return { props: {} };
}
