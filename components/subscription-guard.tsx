"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentModal } from "@/components/payment-modal";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check subscription status from profile
      const isActive = profile?.subscription_active;
      const endDate = profile?.subscription_end_date ? new Date(profile.subscription_end_date) : null;
      const now = new Date();
      
      const hasActiveSubscription = isActive && (!endDate || endDate > now);
      
      setHasSubscription(hasActiveSubscription ?? false);
      
      if (!hasActiveSubscription) {
        setShowPaymentModal(true);
      }
    };

    checkSubscription();
  }, [user, profile, router]);

  if (hasSubscription === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Subscription Required</h2>
              <p className="text-gray-400 mb-6">
                You need an active subscription to access this content.
              </p>
            </div>
          </div>
        )}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            router.push('/');
          }}
          userEmail={user?.email}
        />
      </>
    );
  }

  return <>{children}</>;
}
