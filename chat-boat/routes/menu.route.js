import express from "express";
import { uploadAndParseXlsx } from "../middleware/multer.middleware.js";
import { auth } from './../middleware/auth.js';
import { handleDeleteMenuItem, handleFileUpload, handleGetallMenuDataReq, handleGetMenuItemDataByIDReq, handleGetNextMealMenuItemDataByIDReq, handleNewMenuItem, handleUpdateMenuItem } from "../controllers/menu.controller.js";

const router = express.Router();

// [Authentication]
router.use(auth);

router.get("/get", handleGetallMenuDataReq);
router.get("/get/next", handleGetNextMealMenuItemDataByIDReq);
router.get("/get/:itemID", handleGetMenuItemDataByIDReq);
router.post("/upload", uploadAndParseXlsx, handleFileUpload);
router.post("/new", handleNewMenuItem);
router.put("/update/:itemID", handleUpdateMenuItem);
router.delete("/delete/:itemID", handleDeleteMenuItem);

export default router;
