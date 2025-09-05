"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Crown, Zap } from 'lucide-react';
import { RazorpayCheckout } from '@/components/razorpay-checkout';
import Script from "next/script";
import { useRouter } from "next/navigation";
import { getRedirectPath } from "@/lib/redirect-utils";

export function SubscriptionGate() {
  const { user, profile, refreshProfile, hasActiveSubscription, syncProfileFromServer } = useAuth();
  const [open, setOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  const isSubscribed = hasActiveSubscription;

  useEffect(() => {
    const sync = async () => {
      if (user) {
        // Authoritatively check server-side subscription status
        const serverProfile = (await syncProfileFromServer?.()) ?? (await refreshProfile?.());
        const nowSubscribed = Boolean(
          serverProfile?.subscription_active &&
          (!serverProfile?.subscription_end_date || new Date(serverProfile.subscription_end_date) > new Date())
        );
        setOpen(!nowSubscribed);
      } else {
        setOpen(false);
      }
    };
    sync();
  }, [user]);

  const handlePurchase = async () => {
    if (!user) return;
    // Close our dialog first to prevent it from blocking Razorpay
    setOpen(false);
    // Small timeout to ensure the dialog is closed before opening Razorpay
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsPaying(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      let { data: sessionData } = await supabase.auth.getSession();
      let accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        sessionData = refreshed as any;
        accessToken = (refreshed as any)?.session?.access_token;
      }

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ amount: 4900, access_token: accessToken }),
      });

      const order = await res.json();
      if (!res.ok) {
        throw new Error(order?.details || order?.error || "Failed to create order");
      }

      const options: any = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Zentha Notes",
        description: "Semester Subscription - Unlimited Notes Access",
        order_id: order.orderId,
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
              // Refresh profile to immediately reflect subscription_active
              await (syncProfileFromServer?.() ?? refreshProfile?.());
              setOpen(false);
              // Ensure server components and any SSR checks see updated session/profile
              try { router.refresh(); } catch {}
              const redirectPath = profile ? getRedirectPath(profile) : "/dashboard1/physics";
              router.push(redirectPath);
            } else {
              throw new Error(verifyJson?.error || "Verification failed");
            }
          } catch (err) {
            console.error("Payment verification error", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
            // Reopen the subscription modal if payment popup is closed without success
            if (!isSubscribed) setOpen(true);
          },
        },
      };

      // @ts-ignore
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Purchase error", err);
      alert(err?.message || "Failed to initiate payment. Please refresh the page and try again.");
    } finally {
      setIsPaying(false);
    }
  };

  if (!user || isSubscribed) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Dialog
        open={open}
        modal={!isPaying}
        onOpenChange={(next) => {
          // Always allow closing, but prevent opening if already paying
          if (isPaying) return;
          setOpen(next);
        }}
      >
        <DialogContent
          hideClose={!isPaying}
          className="max-w-md"
          aria-describedby="subscription-modal-description"
          onInteractOutside={(e) => {
            // Only prevent default if not in payment flow
            if (!isPaying) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            // Only prevent default if not in payment flow
            if (!isPaying) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Unlock full access</DialogTitle>
            <DialogDescription id="subscription-modal-description">
              Get unlimited access to all notes, PYQs, and assignments for this semester for just ₹49.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Unlimited access to all semester-wise notes</p>
            <p>• Past year papers and assignments</p>
            <p>• Priority support</p>
          </div>

          <div className="flex gap-3 mt-4">
            <RazorpayCheckout
              amount={4900}
              onPaymentStart={async () => {
                // Close dialog before opening Razorpay to avoid overlay blocking
                setOpen(false);
                setIsPaying(true);
                // Ensure DOM updates flush
                await new Promise((r) => setTimeout(r, 100));
              }}
              onPaymentEnd={() => {
                setIsPaying(false);
                // If user canceled, reopen the subscription dialog
                if (!isSubscribed) setOpen(true);
              }}
              onSuccess={() => {
                // Refresh profile and close modal
                syncProfileFromServer?.() ?? refreshProfile?.();
                setOpen(false);
                router.refresh();
                const redirectPath = profile ? getRedirectPath(profile) : "/dashboard1/physics";
                router.push(redirectPath);
              }}
              onError={(error) => {
                console.error("Payment error:", error);
                alert("Payment failed. Please try again.");
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
