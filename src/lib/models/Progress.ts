import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProgressSchema = new Schema({
  uid: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  currentDay: { type: Number, default: 1 },
  completedDays: { type: [Number], default: [] },
  isCompleted: { type: Boolean, default: false },
  updatedAt: { type: Number, default: () => Date.now() },
});

ProgressSchema.index({ uid: 1, courseId: 1 }, { unique: true });

export type Progress = InferSchemaType<typeof ProgressSchema>;

export default mongoose.models.Progress ?? mongoose.model("Progress", ProgressSchema);
