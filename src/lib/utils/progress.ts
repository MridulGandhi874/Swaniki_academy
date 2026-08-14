import type { Course } from "@/lib/models/Course";
import type { Progress } from "@/lib/models/Progress";

export function percentComplete(
  course: Pick<Course, "modules">,
  progress: Pick<Progress, "completedDays"> | null | undefined
): number {
  const totalModules = course.modules?.length ?? 0;
  if (totalModules === 0) return 0;
  const completed = progress?.completedDays?.length ?? 0;
  return Math.round((completed / totalModules) * 100);
}
