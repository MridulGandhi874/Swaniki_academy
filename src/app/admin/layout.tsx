"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Manage Courses", href: "/admin/courses" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, mongoUser, loading, signOutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (mongoUser?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, firebaseUser, mongoUser, pathname, router]);

  if (loading || mongoUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[var(--color-soft-canvas)] px-6 py-20 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-soft-canvas)]">
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-bold text-[var(--color-soft-slate)]">Admin</p>
            <p className="text-xs text-gray-400">Swaniki Academy</p>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--color-soft-slate)] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOutUser()}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
