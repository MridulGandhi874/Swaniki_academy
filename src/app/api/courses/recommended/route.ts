import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getVerifiedUid } from "@/lib/utils/auth-server";
import CourseModel from "@/lib/models/Course";
import UserModel from "@/lib/models/User";

const LIMIT = 4;
const ADJACENT_LEVEL: Record<string, string[]> = {
  beginner: ["intermediate"],
  intermediate: ["beginner", "advanced"],
  advanced: ["intermediate"],
};

/**
 * Transparent, rules-based matching — not a black-box model. A course scores
 * higher the more of the trainee's stated specializations it covers, plus a
 * bonus for matching (or being adjacent to) their stated skill level. Ties
 * break by rating. Signed-out visitors, or trainees with no specializations
 * set, get the "Most Popular" fallback (by active student count) instead of
 * an empty section.
 */
export async function GET(req: NextRequest) {
  await connectDB();

  const uid = await getVerifiedUid(req);
  const specializations: string[] = [];
  let skillLevel = "";

  if (uid) {
    const user = await UserModel.findOne({ uid }).lean();
    if (user?.specializations?.length) specializations.push(...user.specializations);
    if (user?.skillLevel) skillLevel = user.skillLevel;
  }

  const courses = await CourseModel.find({ active: true }).lean();

  if (specializations.length === 0) {
    const popular = [...courses]
      .sort((a, b) => (b.activeStudentCount ?? 0) - (a.activeStudentCount ?? 0))
      .slice(0, LIMIT);
    return NextResponse.json({ courses: popular, personalized: false });
  }

  const scored = courses.map((course) => {
    const tags = course.domainTags ?? [];
    const matchCount = tags.filter((t: string) => specializations.includes(t)).length;
    let score = matchCount * 3;

    if (skillLevel) {
      if (course.skillLevel === skillLevel) score += 2;
      else if (ADJACENT_LEVEL[skillLevel]?.includes(course.skillLevel ?? "")) score += 1;
    }

    return { course, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.course.rating ?? 0) - (a.course.rating ?? 0));

  if (matched.length === 0) {
    const popular = [...courses]
      .sort((a, b) => (b.activeStudentCount ?? 0) - (a.activeStudentCount ?? 0))
      .slice(0, LIMIT);
    return NextResponse.json({ courses: popular, personalized: false });
  }

  return NextResponse.json({
    courses: matched.slice(0, LIMIT).map((s) => s.course),
    personalized: true,
  });
}
