/**
 * Seeds the full 15-course catalog into MongoDB. Safe to re-run — every
 * course is upserted by courseId, so this never creates duplicates.
 *
 * Usage: npm run seed
 */
import { seedCourses } from "../src/lib/seed-data";

seedCourses()
  .then((results) => {
    console.log(`Seeded ${results.length} courses:`);
    for (const id of results) console.log("  -", id);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
