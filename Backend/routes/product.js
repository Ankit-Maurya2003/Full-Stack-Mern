import {addProduct,fetchProduct,updateProduct,deletesProduct } from "../controller/product.js";
import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
const router = express.Router();

router.post("/add",auth, admin,  addProduct);
router.put("/update/:id",auth, admin, updateProduct);
router.get("/fetch",auth, admin, fetchProduct);
router.delete("/delete/:id",auth, admin, deletesProduct);

export default router;