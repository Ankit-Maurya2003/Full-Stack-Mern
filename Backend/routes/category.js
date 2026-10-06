import express from "express";
import { addCategory, updateCategory,fetchCategory,deletesCategory } from "../controller/category.js";
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
const router = express.Router();

router.post("/add",auth, admin,  addCategory);

router.put("/update/:id",auth, admin, updateCategory);
router.get("/fetch",auth, admin, fetchCategory);
router.delete("/delete/:id",auth, admin, deletesCategory);

export default router;