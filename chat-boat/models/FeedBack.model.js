import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    feedback: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
