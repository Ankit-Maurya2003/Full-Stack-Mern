import express from "express";
import { login, signup , update,fetch,deletes } from "../controller/users.js";
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update",auth, admin, update);
router.get("/fetch",auth, admin, fetch);
router.delete("/delete",auth, admin, deletes);

export default router;