import mongoose from "mongoose";
import { mealBookingTypes } from "../constants/data.js";

const mealSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    bookingType: { type: String, required: true, enum: mealBookingTypes, default: "" },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    price: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdByName: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedByName: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Meal = mongoose.model("Meal", mealSchema);
