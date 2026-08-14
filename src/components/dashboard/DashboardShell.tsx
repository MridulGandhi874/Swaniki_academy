"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import type { MongoUser } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/Logo";
import { HomeIcon, UserIcon, BookIcon, AwardIcon, LogoutIcon } from "./icons";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "My Profile", href: "/dashboard/my-profile", icon: UserIcon },
  { label: "Enrolled Courses", href: "/dashboard/enrolled-courses", icon: BookIcon },
  { label: "Certificates", href: "/dashboard/certificates", icon: AwardIcon },
];

export default function DashboardShell({
  user,
  children,
}: {
  user: MongoUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { signOutUser } = useAuth();

  const displayName = user.publicDisplayName || user.displayName || user.email;

  return (
    <div className="min-h-screen bg-[var(--color-soft-canvas)]">
      {/* Fixed vertical sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[var(--color-soft-slate)] lg:flex">
        <div className="flex h-20 items-center px-6">
          <Logo size={28} textClassName="text-white" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--color-soft-periwinkle)] text-[var(--color-soft-slate)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <button
            type="button"
            onClick={() => signOutUser()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main canvas */}
      <div className="lg:pl-64">
        {/* Soft-UI top header */}
        <header className="flex flex-col gap-4 border-b border-black/5 bg-[var(--color-soft-canvas)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-lg font-bold text-[var(--color-soft-slate)]">Hello, {displayName}</p>
            <p className="text-xs text-gray-400">Welcome back to your trainee dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar name={displayName} photoURL={user.photoURL} size={44} />
          </div>
        </header>

        <main className="px-6 py-6 sm:px-8 sm:py-8">
          {/* Mobile nav (sidebar is desktop-only) */}
          <nav className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    isActive
                      ? "bg-[var(--color-soft-slate)] text-white"
                      : "bg-white text-gray-600 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOutUser()}
              className="rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
            >
              Logout
            </button>
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}
