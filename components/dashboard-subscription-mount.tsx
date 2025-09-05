"use client";

import { usePathname } from "next/navigation";
import { SubscriptionGate } from "@/components/subscription-gate";

export function DashboardSubscriptionMount() {
  const pathname = usePathname();
  const onDashboard = [
    "/dashboard",
    "/dashboard1",
    "/dashboard2",
    "/dashboard3",
    "/dashboard4",
  ].some(prefix => pathname?.startsWith(prefix));

  if (!onDashboard) return null;
  return <SubscriptionGate />;
}
