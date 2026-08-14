import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/utils/auth-server";
import { seedCourses } from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const results = await seedCourses();
  return NextResponse.json({ seeded: results, count: results.length });
}
