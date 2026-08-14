"use client";

import { type ModuleDraft, type LessonDraft, emptyLesson } from "./types";

interface ModuleEditorProps {
  module: ModuleDraft;
  onChange: (next: ModuleDraft) => void;
  onRemove: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-gray-500";

export default function ModuleEditor({ module, onChange, onRemove }: ModuleEditorProps) {
  function updateLesson(i: number, next: LessonDraft) {
    const lessons = [...module.lessons];
    lessons[i] = next;
    onChange({ ...module, lessons });
  }

  function addLesson() {
    onChange({ ...module, lessons: [...module.lessons, emptyLesson()] });
  }

  function removeLesson(i: number) {
    onChange({ ...module, lessons: module.lessons.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Day {module.day}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-red-500 hover:text-red-600"
        >
          Remove day
        </button>
      </div>

      <div className="mt-3">
        <label className={labelClass}>Module title</label>
        <input
          className={inputClass}
          value={module.title}
          onChange={(e) => onChange({ ...module, title: e.target.value })}
          placeholder="Introduction to Web Development"
        />
      </div>

      <div className="mt-4 space-y-4">
        {module.lessons.map((lesson, i) => (
          <div key={i} className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Lesson {i + 1}
              </p>
              {module.lessons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLesson(i)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className={labelClass}>Lesson title</label>
                <input
                  className={inputClass}
                  value={lesson.title}
                  onChange={(e) => updateLesson(i, { ...lesson, title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select
                  className={inputClass}
                  value={lesson.type}
                  onChange={(e) =>
                    updateLesson(i, { ...lesson, type: e.target.value as LessonDraft["type"] })
                  }
                >
                  <option value="reading">Reading</option>
                  <option value="video">Video</option>
                  <option value="code">Code</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className={labelClass}>Learning objectives (one per line)</label>
              <textarea
                className={inputClass}
                rows={2}
                value={lesson.objectives}
                onChange={(e) => updateLesson(i, { ...lesson, objectives: e.target.value })}
              />
            </div>

            <div className="mt-3">
              <label className={labelClass}>Content (markdown/HTML)</label>
              <textarea
                className={inputClass}
                rows={5}
                value={lesson.content}
                onChange={(e) => updateLesson(i, { ...lesson, content: e.target.value })}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Code language (optional)</label>
                <input
                  className={inputClass}
                  value={lesson.codeLanguage}
                  onChange={(e) => updateLesson(i, { ...lesson, codeLanguage: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Code block (optional)</label>
                <textarea
                  className={`${inputClass} font-mono`}
                  rows={3}
                  value={lesson.code}
                  onChange={(e) => updateLesson(i, { ...lesson, code: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addLesson}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add lesson
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Hands-on project title</label>
          <input
            className={inputClass}
            value={module.handsOnTitle}
            onChange={(e) => onChange({ ...module, handsOnTitle: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Hands-on project description</label>
          <input
            className={inputClass}
            value={module.handsOnDescription}
            onChange={(e) => onChange({ ...module, handsOnDescription: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Assignment title</label>
          <input
            className={inputClass}
            value={module.assignmentTitle}
            onChange={(e) => onChange({ ...module, assignmentTitle: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Assignment instructions</label>
          <input
            className={inputClass}
            value={module.assignmentInstructions}
            onChange={(e) => onChange({ ...module, assignmentInstructions: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
