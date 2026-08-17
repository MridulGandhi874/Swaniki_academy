"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Logo from "@/components/Logo";
import {
  FIELD_OF_STUDY_OPTIONS,
  YEAR_STAGE_OPTIONS,
  SPECIALIZATIONS,
  SKILL_LEVEL_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
} from "@/lib/domains";

const TOTAL_STEPS = 3;

interface FormState {
  fieldOfStudy: string;
  yearStage: string;
  specializations: string[];
  skillLevel: string;
  primaryGoal: string;
}

const OPTION_BUTTON =
  "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition";
function optionClass(active: boolean) {
  return `${OPTION_BUTTON} ${
    active
      ? "border-blue-600 bg-blue-50 text-blue-700"
      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
  }`;
}

export default function WelcomePage() {
  const { firebaseUser, mongoUser, loading, refreshMongoUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    fieldOfStudy: "",
    yearStage: "",
    specializations: [],
    skillLevel: "",
    primaryGoal: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login?redirect=/welcome");
      return;
    }
    if (mongoUser?.onboardingCompleted || mongoUser?.onboardingSkipped) {
      router.replace("/dashboard");
    }
  }, [loading, firebaseUser, mongoUser, router]);

  async function patchUser(body: Record<string, unknown>) {
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();
    await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(body),
    });
    await refreshMongoUser();
  }

  async function handleSkip() {
    setSubmitting(true);
    await patchUser({ onboardingSkipped: true });
    router.replace("/dashboard");
  }

  async function handleFinish() {
    setSubmitting(true);
    await patchUser({ ...form, onboardingCompleted: true });
    router.replace("/dashboard");
  }

  function toggleSpecialization(value: string) {
    setForm((f) => ({
      ...f,
      specializations: f.specializations.includes(value)
        ? f.specializations.filter((s) => s !== value)
        : [...f.specializations, value],
    }));
  }

  const canAdvanceStep1 = Boolean(form.fieldOfStudy && form.yearStage);
  const canAdvanceStep2 = form.specializations.length > 0 && Boolean(form.skillLevel);
  const canFinish = Boolean(form.primaryGoal);

  if (loading || !firebaseUser) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex items-center justify-between">
          <Logo size={30} />
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="text-xs font-medium text-gray-400 hover:text-gray-600"
          >
            Skip for now
          </button>
        </div>

        <div className="mt-6 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < step ? "bg-blue-600" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-medium text-gray-400">
          Step {step} of {TOTAL_STEPS}
        </p>

        {step === 1 && (
          <div className="mt-6">
            <h1 className="text-xl font-bold text-gray-900">Tell us about yourself</h1>
            <p className="mt-1 text-sm text-gray-500">
              This helps us recommend the right tracks for you.
            </p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Field of study
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_OF_STUDY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={optionClass(form.fieldOfStudy === opt.value)}
                    onClick={() => setForm((f) => ({ ...f, fieldOfStudy: opt.value }))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Year / stage
              </p>
              <div className="grid grid-cols-2 gap-2">
                {YEAR_STAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={optionClass(form.yearStage === opt.value)}
                    onClick={() => setForm((f) => ({ ...f, yearStage: opt.value }))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button className="mt-8 w-full" disabled={!canAdvanceStep1} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <h1 className="text-xl font-bold text-gray-900">What are you into?</h1>
            <p className="mt-1 text-sm text-gray-500">Pick as many specializations as you like.</p>

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SPECIALIZATIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={optionClass(form.specializations.includes(opt.value))}
                    onClick={() => toggleSpecialization(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Skill level
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SKILL_LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={optionClass(form.skillLevel === opt.value)}
                    onClick={() => setForm((f) => ({ ...f, skillLevel: opt.value }))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" disabled={!canAdvanceStep2} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6">
            <h1 className="text-xl font-bold text-gray-900">What&rsquo;s your goal?</h1>
            <p className="mt-1 text-sm text-gray-500">
              We&rsquo;ll use this along with your interests to recommend tracks.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2">
              {PRIMARY_GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={optionClass(form.primaryGoal === opt.value)}
                  onClick={() => setForm((f) => ({ ...f, primaryGoal: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" disabled={!canFinish || submitting} onClick={handleFinish}>
                {submitting ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
