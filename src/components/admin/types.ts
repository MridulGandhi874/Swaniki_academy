export type LessonType = "reading" | "video" | "code" | "assignment";

export interface LessonDraft {
  title: string;
  type: LessonType;
  content: string;
  objectives: string;
  codeLanguage: string;
  code: string;
}

export interface ModuleDraft {
  day: number;
  title: string;
  lessons: LessonDraft[];
  handsOnTitle: string;
  handsOnDescription: string;
  assignmentTitle: string;
  assignmentInstructions: string;
}

export interface EvaluationCriterionDraft {
  criterion: string;
  weight: number;
  description: string;
}

export interface CourseDraft {
  courseId: string;
  title: string;
  description: string;
  bannerUrl: string;
  authorName: string;
  price: number;
  badge: string;
  totalDays: number;
  rating: number;
  active: boolean;
  evaluationCriteria: EvaluationCriterionDraft[];
  modules: ModuleDraft[];
}

export function defaultEvaluationCriteria(): EvaluationCriterionDraft[] {
  return [
    { criterion: "Code Structure", weight: 30, description: "Repository is organized and follows conventions." },
    {
      criterion: "Architecture & Documentation",
      weight: 30,
      description: "README and design notes explain architecture and setup.",
    },
    {
      criterion: "Live Proof & Functionality",
      weight: 40,
      description: "Submission link is live and demonstrates working functionality.",
    },
  ];
}

export function emptyLesson(): LessonDraft {
  return { title: "", type: "reading", content: "", objectives: "", codeLanguage: "javascript", code: "" };
}

export function emptyModule(day: number): ModuleDraft {
  return {
    day,
    title: "",
    lessons: [emptyLesson()],
    handsOnTitle: "",
    handsOnDescription: "",
    assignmentTitle: "",
    assignmentInstructions: "",
  };
}

export function draftToApiPayload(draft: CourseDraft) {
  return {
    courseId: draft.courseId.trim(),
    title: draft.title.trim(),
    description: draft.description,
    bannerUrl: draft.bannerUrl,
    authorName: draft.authorName,
    price: draft.price,
    badge: draft.badge,
    totalDays: draft.totalDays,
    rating: draft.rating,
    active: draft.active,
    evaluationCriteria: draft.evaluationCriteria.filter((c) => c.criterion.trim()),
    modules: draft.modules.map((m) => ({
      day: m.day,
      title: m.title,
      lessons: m.lessons
        .filter((l) => l.title.trim())
        .map((l) => ({
          title: l.title,
          type: l.type,
          content: l.content,
          objectives: l.objectives
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          codeBlocks: l.code.trim()
            ? [{ language: l.codeLanguage || "text", code: l.code, caption: "" }]
            : [],
        })),
      handsOnProject: { title: m.handsOnTitle, description: m.handsOnDescription },
      assignment: { title: m.assignmentTitle, instructions: m.assignmentInstructions },
    })),
  };
}

interface ApiCourseLesson {
  title: string;
  type: LessonType;
  content: string;
  objectives: string[];
  codeBlocks: { language: string; code: string; caption?: string }[];
}

interface ApiCourseModule {
  day: number;
  title: string;
  lessons: ApiCourseLesson[];
  handsOnProject?: { title: string; description: string };
  assignment?: { title: string; instructions: string };
}

export interface ApiCourse {
  courseId: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  authorName?: string;
  price?: number;
  badge?: string;
  totalDays?: number;
  rating?: number;
  active?: boolean;
  evaluationCriteria?: EvaluationCriterionDraft[];
  modules: ApiCourseModule[];
}

export function apiCourseToDraft(course: ApiCourse): CourseDraft {
  return {
    courseId: course.courseId,
    title: course.title,
    description: course.description ?? "",
    bannerUrl: course.bannerUrl ?? "",
    authorName: course.authorName ?? "",
    price: course.price ?? 0,
    badge: course.badge ?? "",
    totalDays: course.totalDays ?? 14,
    rating: course.rating ?? 0,
    active: course.active ?? true,
    evaluationCriteria:
      course.evaluationCriteria && course.evaluationCriteria.length > 0
        ? course.evaluationCriteria
        : defaultEvaluationCriteria(),
    modules: course.modules.length
      ? course.modules.map((m) => ({
          day: m.day,
          title: m.title,
          lessons: m.lessons.length
            ? m.lessons.map((l) => ({
                title: l.title,
                type: l.type,
                content: l.content,
                objectives: (l.objectives ?? []).join("\n"),
                codeLanguage: l.codeBlocks?.[0]?.language ?? "javascript",
                code: l.codeBlocks?.[0]?.code ?? "",
              }))
            : [emptyLesson()],
          handsOnTitle: m.handsOnProject?.title ?? "",
          handsOnDescription: m.handsOnProject?.description ?? "",
          assignmentTitle: m.assignment?.title ?? "",
          assignmentInstructions: m.assignment?.instructions ?? "",
        }))
      : [emptyModule(1)],
  };
}

export function emptyCourse(): CourseDraft {
  return {
    courseId: "",
    title: "",
    description: "",
    bannerUrl: "",
    authorName: "",
    price: 1999,
    badge: "",
    totalDays: 14,
    rating: 4.5,
    active: true,
    evaluationCriteria: defaultEvaluationCriteria(),
    modules: [emptyModule(1)],
  };
}
