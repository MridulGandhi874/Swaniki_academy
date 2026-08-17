import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  displayName: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  coverURL: { type: String, default: "" },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  enrolledCourses: { type: [String], default: [] },
  completedLessons: { type: [String], default: [] },

  // Settings page profile fields
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  username: { type: String, default: "" },
  phone: { type: String, default: "" },
  occupation: { type: String, default: "" },
  timezone: { type: String, default: "" },
  bio: { type: String, default: "" },
  publicDisplayName: { type: String, default: "" },

  // Induction Wizard — captured on first login, editable later from My Profile
  fieldOfStudy: { type: String, default: "" },
  yearStage: { type: String, default: "" },
  specializations: { type: [String], default: [] },
  skillLevel: { type: String, default: "" },
  primaryGoal: { type: String, default: "" },
  onboardingCompleted: { type: Boolean, default: false },
  onboardingSkipped: { type: Boolean, default: false },

  createdAt: { type: Number, default: () => Date.now() },
});

export type User = InferSchemaType<typeof UserSchema>;

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
