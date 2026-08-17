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
  price: number;
  badge: string;
  domainTags: string[];
  skillLevel: "beginner" | "intermediate" | "advanced";
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
    price: draft.price,
    badge: draft.badge,
    domainTags: draft.domainTags,
    skillLevel: draft.skillLevel,
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
  price?: number;
  badge?: string;
  domainTags?: string[];
  skillLevel?: "beginner" | "intermediate" | "advanced";
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
    price: course.price ?? 0,
    badge: course.badge ?? "",
    domainTags: course.domainTags ?? [],
    skillLevel: course.skillLevel ?? "beginner",
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

// Ratings are drawn once from a credible 3.0-4.5 range rather than a
// suspiciously-perfect 4.7-4.9 band — this seeds a sensible default for a
// brand-new course; the admin can still override it.
export function randomSeedRating(): number {
  return Math.round((3.0 + Math.random() * 1.5) * 10) / 10;
}

export function emptyCourse(): CourseDraft {
  return {
    courseId: "",
    title: "",
    description: "",
    bannerUrl: "",
    price: 1999,
    badge: "",
    domainTags: [],
    skillLevel: "beginner",
    totalDays: 14,
    rating: randomSeedRating(),
    active: true,
    evaluationCriteria: defaultEvaluationCriteria(),
    modules: [emptyModule(1)],
  };
}
