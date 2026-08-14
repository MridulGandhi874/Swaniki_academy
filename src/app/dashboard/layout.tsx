"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { firebaseUser, mongoUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, firebaseUser, pathname, router]);

  if (loading || !firebaseUser || !mongoUser) {
    return (
      <div className="min-h-screen bg-[var(--color-soft-canvas)] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return <DashboardShell user={mongoUser}>{children}</DashboardShell>;
}
