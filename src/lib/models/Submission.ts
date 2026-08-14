import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RubricEntrySchema = new Schema(
  {
    criterion: { type: String, required: true },
    scoreObtained: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

const SubmissionSchema = new Schema({
  submissionId: { type: String, required: true, unique: true, index: true },
  uid: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  projectUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  score: { type: Number, default: 0, min: 0, max: 100 },
  rubricBreakdown: { type: [RubricEntrySchema], default: [] },
  evaluatedAt: { type: Number, default: 0 },
  createdAt: { type: Number, default: () => Date.now() },
});

SubmissionSchema.index({ uid: 1, courseId: 1 }, { unique: true });

export type Submission = InferSchemaType<typeof SubmissionSchema>;
export type RubricEntry = Submission["rubricBreakdown"][number];

export default mongoose.models.Submission ?? mongoose.model("Submission", SubmissionSchema);
