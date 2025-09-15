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
  const [paymentStep, setPaymentStep] = useState<'idle' | 'creating-order' | 'opening-gateway' | 'processing'>('idle');
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      alert('Please log in first to make a payment.');
      router.push('/login');
      return;
    }

    // Immediately show overlay to prevent app access
    setIsLoading(true);
    setShowPaymentOverlay(true);
    setPaymentStep('creating-order');
    
    try {
      console.log('Starting payment for user:', user.id);
      
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

      // Create order with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ amount: 4900, access_token: accessToken }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || 'Failed to create order');
      }

      setPaymentStep('opening-gateway');

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
          setPaymentStep('processing');
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
              setShowPaymentOverlay(false);
              router.push(redirectPath);
            } else {
              setShowPaymentOverlay(false);
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setShowPaymentOverlay(false);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setShowPaymentOverlay(false);
            setPaymentStep('idle');
          },
          onhidden: function () {
            setIsLoading(false);
            setShowPaymentOverlay(false);
            setPaymentStep('idle');
          },
        },
      };

      // Small delay to ensure overlay is visible before opening gateway
      setTimeout(() => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }, 100);
      
    } catch (error) {
      console.error('Payment error:', error);
      setShowPaymentOverlay(false);
      setPaymentStep('idle');
      
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Payment request timed out. Please check your connection and try again.');
      } else {
        alert('Failed to initiate payment. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStepMessage = () => {
    switch (paymentStep) {
      case 'creating-order':
        return 'Creating payment order...';
      case 'opening-gateway':
        return 'Opening payment gateway...';
      case 'processing':
        return 'Processing payment...';
      default:
        return 'Preparing payment...';
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      {/* Payment Processing Overlay */}
      {showPaymentOverlay && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
            <p className="text-gray-400 mb-4">{getPaymentStepMessage()}</p>
            <div className="text-sm text-gray-500">
              Please do not close this window or navigate away
            </div>
          </div>
        </div>
      )}
      
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
