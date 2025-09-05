'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RazorpayCheckoutProps {
  amount?: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onPaymentStart?: () => void;
  onPaymentEnd?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({ 
  amount = 4900, 
  onSuccess, 
  onError,
  onPaymentStart,
  onPaymentEnd,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) return resolve();
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null;
      if (existing) {
        if ((window as any).Razorpay) return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Inform parent to close any blocking UI (e.g., Dialog overlay)
      onPaymentStart?.();

      // Ensure Razorpay SDK is loaded
      await loadRazorpay();

      // Get authentication token
      const { supabase } = await import("@/lib/supabase");
      let { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        sessionData = refreshed as any;
        accessToken = (refreshed as any)?.session?.access_token;
      }

      if (!accessToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Create order on server
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ amount, access_token: accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await response.json();

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zentha Notes',
        description: 'Semester Subscription',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on client side as well
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                access_token: accessToken,
              }),
            });
            
            const verifyJson = await verifyRes.json();
            if (verifyJson?.success) {
              console.log('Payment verified successfully:', response.razorpay_payment_id);
              onSuccess?.();
              onPaymentEnd?.();
            } else {
              throw new Error(verifyJson?.error || "Verification failed");
            }
          } catch (err) {
            console.error("Payment verification error", err);
            onError?.(err);
            onPaymentEnd?.();
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            onPaymentEnd?.();
          }
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      onError?.(error);
      setLoading(false);
      onPaymentEnd?.();
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Processing...' : `Pay ₹${amount / 100}`}
    </Button>
  );
}
