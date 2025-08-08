import express from "express";
import { auth } from "./../middleware/auth.js";
import { getClassesDDHandle, getDivisionsDDHandle, getMealTypesDDHandle, getSchoolsDDHandle, getSchoolShiftsDDHandle, getUserStateDDHandle } from "../controllers/dd.controller.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get/user-states", getUserStateDDHandle);
router.get("/get/schools", getSchoolsDDHandle);
router.get("/get/class", getClassesDDHandle);
router.get("/get/divisions", getDivisionsDDHandle);
router.get("/get/meal-types", getMealTypesDDHandle);
router.get("/get/shcool-shifts", getSchoolShiftsDDHandle);

export default router;
