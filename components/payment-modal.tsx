"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Check, Shield, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/lib/redirect-utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentModal({ isOpen, onClose, userEmail }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { profile } = useAuth();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
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

      // Create order
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
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
          email: userEmail,
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
                'Authorization': `Bearer ${accessToken}`,
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
              onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <Card className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Unlock Premium Access
          </CardTitle>
          <p className="text-white/80 text-sm">
            Get unlimited access to all semester notes
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pricing */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">₹49</div>
            <div className="text-white/70 text-sm">Per Semester</div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-sm">Unlimited access to all notes</span>
            </div>
            <div className="flex items-center text-white/90">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-sm">Custom support</span>
            </div>
            <div className="flex items-center text-white/90">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-sm">AI-powered doubt solving (soon)</span>
            </div>
            <div className="flex items-center text-white/90">
              <Shield className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
              <span className="text-sm">Secure payment with Razorpay</span>
            </div>
            <div className="flex items-center text-white/90">
              <Clock className="h-4 w-4 text-purple-400 mr-3 flex-shrink-0" />
              <span className="text-sm">6 months validity</span>
            </div>
          </div>

          {/* Payment button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Unlock Notes for ₹49"
            )}
          </Button>

          <p className="text-xs text-white/60 text-center">
            Secure payment powered by Razorpay. Your data is protected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
