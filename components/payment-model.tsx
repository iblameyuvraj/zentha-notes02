"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing-card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getRedirectPath } from "@/lib/redirect-utils";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    name: "Basic Plan",
    price: 49,
    period: "Per Semester",
    features: [
      "Unlimited access to all semester wise notes",
      "Custom Support",
      "AI-Powered doubt solving (soon)",
    ],
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      alert('Please log in first to make a payment.');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Starting payment for user:', user.id);
      
      // Create order
      // Get Supabase access token for authenticated API calls
      const { supabase } = await import('@/lib/supabase');
      let { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        console.log('[payment] No access token yet, trying to refresh session...');
        const { data: refreshed } = await supabase.auth.refreshSession();
        sessionData = refreshed as any;
        accessToken = (refreshed as any)?.session?.access_token;
        console.log('[payment] Access token present after refresh:', !!accessToken);
      }

      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ amount: 4900, access_token: accessToken }), // ₹49
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Zentha Notes',
        description: 'Semester Subscription - Unlimited Notes Access',
        order_id: order.orderId,
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#000000',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                access_token: accessToken,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              // Payment successful - redirect to correct dashboard based on user profile
              const redirectPath = profile ? getRedirectPath(profile) : '/dashboard1/physics';
              router.push(redirectPath);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="min-h-screen bg-black text-white py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4"> 
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {plans.map((plan) => (
              <PricingCard 
                key={plan.name} 
                {...plan} 
                onPurchase={handlePayment}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
