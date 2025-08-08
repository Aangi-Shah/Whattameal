import express from "express";
import { auth } from "./../middleware/auth.js";
import { createChildHandle, deleteChildHandle, getChildByIDHandle, getChildrenByParentIDHandle, getChildrenByParentHandle, updateChildHandle } from "../controllers/child.controller.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get", getChildrenByParentHandle);
router.get("/get/:childID", getChildByIDHandle);
router.get("/get/parent/:parentID", getChildrenByParentIDHandle);
router.post("/new", createChildHandle);
router.put("/update/:childID", updateChildHandle);
router.delete("/delete/:childID", deleteChildHandle);

export default router;
