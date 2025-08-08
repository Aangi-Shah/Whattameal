import express from "express";
import { auth } from "./../middleware/auth.js";
import { createParentHandle, deleteParentHandle, getParentByChildIDHandle, getParentByIDHandle, getParentHandle, getParentsFeedbacksHandle, updateParentHandle } from "../controllers/parent.controller.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get", getParentHandle);
router.get("/get/feedback", getParentsFeedbacksHandle);
router.get("/get/:parentID", getParentByIDHandle);
router.get("/get/child/:childID", getParentByChildIDHandle);
router.post("/new", createParentHandle);
router.put("/update/:parentID", updateParentHandle);
router.delete("/delete/:parentID", deleteParentHandle);

export default router;
