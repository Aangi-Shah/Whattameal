import express from "express";
import { deleteUserHandle, getLoggedinUserHandle, getUserByIDHandle, getUserHandle, newUserHandle, updateUserHandle } from "../controllers/user.controller.js";
import { auth } from "./../middleware/auth.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get", getUserHandle);
router.get("/get/loggedin", getLoggedinUserHandle);
router.get("/get/:userID", getUserByIDHandle);
router.post("/new", newUserHandle);
router.put("/update/:userID", updateUserHandle);
router.delete("/delete/:userID", deleteUserHandle);

export default router;
