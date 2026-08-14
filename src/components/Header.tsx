"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

function getInitials(name: string, email: string) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Header() {
  const { firebaseUser, mongoUser, loading, signInWithGoogle, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const displayName = mongoUser?.displayName || firebaseUser?.displayName || "";
  const email = mongoUser?.email || firebaseUser?.email || "";
  const initials = getInitials(displayName, email);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/">
          <Logo size={30} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/courses"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Trainee Program
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Pages
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          ) : firebaseUser ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition hover:border-blue-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium text-gray-800 sm:inline">
                  {initials} {displayName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                    <p className="truncate text-xs text-gray-500">{email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  {mongoUser?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOutUser();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                signInWithGoogle().catch((err) => {
                  console.error(err);
                  alert(err instanceof Error ? err.message : "Sign-in failed.");
                });
              }}
              className="whitespace-nowrap rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="sm:hidden">Sign in</span>
              <span className="hidden sm:inline">Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
