import express from 'express';
import {hello, send,update,deleting} from '../controller/controller.js'
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
const router = express.Router();
router.get('/fetch',auth, admin,hello)
router.post('/send',auth,admin, send)
router.put('/update/:id',auth,admin, update)
router.delete('/delete/:id',auth,admin, deleting)

export default router;