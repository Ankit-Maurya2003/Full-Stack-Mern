import express from "express";

import {
  createOrder,
  fetchOrders,
  fetchMyOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controller/orderController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();


// ===============================
// CREATE ORDER
// ===============================
router.post(
  "/create",
  auth,
  createOrder
);


// ===============================
// MY ORDERS - USER
// ===============================
router.get(
  "/my-orders",
  auth,
  fetchMyOrders
);


// ===============================
// ALL ORDERS - ADMIN
// ===============================
router.get(
  "/fetch",
  auth,
  admin,
  fetchOrders
);


// ===============================
// SINGLE ORDER
// ===============================
router.get(
  "/:id",
  auth,
  getOrderById
);


// ===============================
// UPDATE ORDER - ADMIN
// ===============================
router.put(
  "/update/:id",
  auth,
  admin,
  updateOrder
);


// ===============================
// DELETE ORDER - ADMIN
// ===============================
router.delete(
  "/delete/:id",
  auth,
  admin,
  deleteOrder
);


export default router;