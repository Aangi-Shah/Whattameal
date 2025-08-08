import mongoose from "mongoose";
import { classes, mealTypes, schools, schoolShifts, divisons } from "../constants/data.js";

const childSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    name: { type: String, required: true, default: "" },
    dob: { type: String, required: true, default: "" },
    school: { type: String, required: true, enum: schools, default: "" },
    className: { type: String, required: true, enum: classes, default: "" },
    divison: { type: String, required: true, enum: divisons, default: "" },
    mealType: { type: String, required: true, enum: mealTypes, default: "" },
    shift: { type: String, required: true, enum: schoolShifts, default: "" },
  },
  { timestamps: true }
);

export const Child = mongoose.model("Child", childSchema);
