import type { CourseModule } from "@/lib/models/Course";

interface LessonReaderProps {
  module: CourseModule;
}

export default function LessonReader({ module }: LessonReaderProps) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Day {module.day}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{module.title}</h1>
      </div>

      {module.lessons.map((lesson, i) => (
        <article key={i} className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>

          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="rounded-xl bg-blue-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Learning Objectives
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {lesson.objectives.map((obj, oi) => (
                  <li key={oi}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {lesson.content && (
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          )}

          {lesson.codeBlocks && lesson.codeBlocks.length > 0 && (
            <div className="space-y-3">
              {lesson.codeBlocks.map((block, ci) => (
                <div key={ci} className="overflow-hidden rounded-xl bg-gray-900">
                  <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400">
                    <span>{block.language}</span>
                    {block.caption && <span>{block.caption}</span>}
                  </div>
                  <pre className="overflow-x-auto px-4 pb-4 text-sm text-gray-100">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </article>
      ))}

      {(module.handsOnProject?.title || module.handsOnProject?.description) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Hands-On Mini-Project
          </p>
          {module.handsOnProject.title && (
            <h3 className="mt-1 text-base font-semibold text-gray-900">
              {module.handsOnProject.title}
            </h3>
          )}
          {module.handsOnProject.description && (
            <p className="mt-2 text-sm text-gray-700">{module.handsOnProject.description}</p>
          )}
        </div>
      )}

      {(module.assignment?.title || module.assignment?.instructions) && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">Assignment</p>
          {module.assignment.title && (
            <h3 className="mt-1 text-base font-semibold text-gray-900">{module.assignment.title}</h3>
          )}
          {module.assignment.instructions && (
            <p className="mt-2 text-sm text-gray-700">{module.assignment.instructions}</p>
          )}
        </div>
      )}
    </div>
  );
}
