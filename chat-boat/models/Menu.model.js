import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: "" },
    meal: { type: String, required: true, default: "" },
    price: { type: Number, required: true, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, default: null },
    createdByName: { type: String, required: true, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, default: null },
    updatedByName: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

export const Menu = mongoose.model("Menu", menuSchema);
