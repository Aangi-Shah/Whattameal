import mongoose from "mongoose";
import { getAllStates } from "../constants/data.js";

const parentSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, enum: getAllStates(), default: "INIT" },
    phone: { type: String, default: "" },
    name: { type: String, default: "" },
    surName: { type: String, default: "" },
    email: { type: String, default: "" },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
  },
  { timestamps: true }
);

export const Parent = mongoose.model("Parent", parentSchema);
