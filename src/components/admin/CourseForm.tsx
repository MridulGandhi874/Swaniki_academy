"use client";

import { useState } from "react";
import { type CourseDraft, type EvaluationCriterionDraft, emptyModule } from "./types";
import ModuleEditor from "./ModuleEditor";
import Button from "@/components/ui/Button";
import { SPECIALIZATIONS, SKILL_LEVEL_OPTIONS } from "@/lib/domains";

interface CourseFormProps {
  initialData: CourseDraft;
  onSubmit: (data: CourseDraft) => Promise<void>;
  submitLabel: string;
  lockCourseId?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-gray-500";

export default function CourseForm({ initialData, onSubmit, submitLabel, lockCourseId }: CourseFormProps) {
  const [draft, setDraft] = useState<CourseDraft>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function addModule() {
    setDraft({ ...draft, modules: [...draft.modules, emptyModule(draft.modules.length + 1)] });
  }

  function removeModule(i: number) {
    setDraft({ ...draft, modules: draft.modules.filter((_, idx) => idx !== i) });
  }

  function updateCriterion(i: number, next: EvaluationCriterionDraft) {
    const evaluationCriteria = [...draft.evaluationCriteria];
    evaluationCriteria[i] = next;
    setDraft({ ...draft, evaluationCriteria });
  }

  function addCriterion() {
    setDraft({
      ...draft,
      evaluationCriteria: [...draft.evaluationCriteria, { criterion: "", weight: 0, description: "" }],
    });
  }

  function removeCriterion(i: number) {
    setDraft({ ...draft, evaluationCriteria: draft.evaluationCriteria.filter((_, idx) => idx !== i) });
  }

  const criteriaWeightSum = draft.evaluationCriteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  function toggleDomainTag(value: string) {
    setDraft((d) => ({
      ...d,
      domainTags: d.domainTags.includes(value)
        ? d.domainTags.filter((t) => t !== value)
        : [...d.domainTags, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!draft.courseId.trim() || !draft.title.trim()) {
      setErrorMsg("Course ID and title are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(draft);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900">Course details</h2>
        <p className="mt-1 text-xs text-gray-400">
          Every course is published as Swaniki Academy — there&rsquo;s no per-course instructor to set.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Course ID (slug, unique)</label>
            <input
              className={inputClass}
              value={draft.courseId}
              disabled={lockCourseId}
              onChange={(e) => setDraft({ ...draft, courseId: e.target.value })}
              placeholder="full-stack-developer-trainee"
            />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Full Stack Developer Trainee Program"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Banner image URL</label>
            <input
              className={inputClass}
              value={draft.bannerUrl}
              onChange={(e) => setDraft({ ...draft, bannerUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>Skill level</label>
            <select
              className={inputClass}
              value={draft.skillLevel}
              onChange={(e) =>
                setDraft({ ...draft, skillLevel: e.target.value as CourseDraft["skillLevel"] })
              }
            >
              {SKILL_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input
              type="number"
              min={0}
              step={100}
              className={inputClass}
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              placeholder="1499"
            />
          </div>
          <div>
            <label className={labelClass}>Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              className={inputClass}
              value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelClass}>Badge</label>
            <input
              className={inputClass}
              value={draft.badge}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              placeholder="Most Popular, Advanced, High Demand..."
            />
          </div>
          <div>
            <label className={labelClass}>Total Days (14-30)</label>
            <input
              type="number"
              min={1}
              max={60}
              className={inputClass}
              value={draft.totalDays}
              onChange={(e) => setDraft({ ...draft, totalDays: Number(e.target.value) })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Specialization tags</label>
            <p className="mb-2 text-xs text-gray-400">
              Used to match this course to trainees in &ldquo;Recommended for You.&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((opt) => {
                const active = draft.domainTags.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleDomainTag(opt.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Active (visible in catalog)
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Evaluation Criteria</h2>
          <button
            type="button"
            onClick={addCriterion}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + Add criterion
          </button>
        </div>

        <div className="space-y-3">
          {draft.evaluationCriteria.map((c, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-[2fr_1fr_3fr_auto]">
              <div>
                <label className={labelClass}>Criterion</label>
                <input
                  className={inputClass}
                  value={c.criterion}
                  onChange={(e) => updateCriterion(i, { ...c, criterion: e.target.value })}
                  placeholder="Code Structure"
                />
              </div>
              <div>
                <label className={labelClass}>Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  value={c.weight}
                  onChange={(e) => updateCriterion(i, { ...c, weight: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  className={inputClass}
                  value={c.description}
                  onChange={(e) => updateCriterion(i, { ...c, description: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeCriterion(i)}
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className={`mt-3 text-xs font-medium ${criteriaWeightSum === 100 ? "text-green-600" : "text-amber-600"}`}>
          Weights total {criteriaWeightSum}% {criteriaWeightSum !== 100 && "— should sum to 100%"}
        </p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Modules (daily lessons)</h2>
          <button
            type="button"
            onClick={addModule}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + Add day
          </button>
        </div>
        <div className="space-y-4">
          {draft.modules.map((module, i) => (
            <ModuleEditor
              key={i}
              module={module}
              onChange={(next) => {
                const modules = [...draft.modules];
                modules[i] = next;
                setDraft({ ...draft, modules });
              }}
              onRemove={() => removeModule(i)}
            />
          ))}
        </div>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
