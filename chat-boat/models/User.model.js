import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, default: "" },
    lastName: { type: String, required: true, default: "" },
    userName: { type: String, required: true, default: "" },
    password: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
