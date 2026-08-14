"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Logo from "@/components/Logo";

function LoginContent() {
  const { firebaseUser, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!loading && firebaseUser) {
      router.replace(redirectTo);
    }
  }, [loading, firebaseUser, redirectTo, router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
      <Card className="w-full text-center">
        <div className="flex justify-center">
          <Logo size={40} showText={false} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Sign in to Swaniki Academy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Access your dashboard, enrolled tracks, and progress.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            signInWithGoogle().catch((err) => {
              alert(err instanceof Error ? err.message : "Sign-in failed.");
            });
          }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Continue with Google"}
        </button>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
