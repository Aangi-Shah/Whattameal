import express from "express";
import { handleLogin, handleLogout } from "../controllers/auth.controller.js";
import { auth } from "./../middleware/auth.js";

const router = express.Router();

router.post("/login", handleLogin);
router.get("/logout", auth, handleLogout);

export default router;
