import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CodeBlockSchema = new Schema(
  {
    language: { type: String, default: "text" },
    code: { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["reading", "video", "code", "assignment"],
      default: "reading",
    },
    content: { type: String, default: "" },
    codeBlocks: { type: [CodeBlockSchema], default: [] },
    objectives: { type: [String], default: [] },
  },
  { _id: false }
);

const ModuleSchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    lessons: { type: [LessonSchema], default: [] },
    handsOnProject: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    assignment: {
      title: { type: String, default: "" },
      instructions: { type: String, default: "" },
    },
  },
  { _id: false }
);

const EvaluationCriterionSchema = new Schema(
  {
    criterion: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const CourseSchema = new Schema({
  courseId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
  authorName: { type: String, default: "" },
  price: { type: Number, default: 0, min: 0 },
  badge: { type: String, default: "" },
  totalDays: { type: Number, default: 14, min: 1, max: 60 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalLessons: { type: Number, default: 0 },
  modules: { type: [ModuleSchema], default: [] },
  evaluationCriteria: { type: [EvaluationCriterionSchema], default: [] },
  active: { type: Boolean, default: true },
  activeStudentCount: { type: Number, default: 0 },
  createdAt: { type: Number, default: () => Date.now() },
});

export type Course = InferSchemaType<typeof CourseSchema>;
export type CourseModule = Course["modules"][number];
export type CourseLesson = CourseModule["lessons"][number];
export type EvaluationCriterion = Course["evaluationCriteria"][number];

export default mongoose.models.Course ?? mongoose.model("Course", CourseSchema);
