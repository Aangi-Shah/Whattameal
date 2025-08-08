import express from "express";
import { auth } from "./../middleware/auth.js";
import { createMealHandle, deleteMealHandle, getMealByIDHandle, getMealHandle, updateMealHandle } from "../controllers/meal.controller.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get", getMealHandle);
router.get("/get/:mealID", getMealByIDHandle);
router.post("/new", createMealHandle);
router.put("/update/:mealID", updateMealHandle);
router.delete("/delete/:mealID", deleteMealHandle);

export default router;
