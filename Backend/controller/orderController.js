import mongoose from "mongoose";
import ORDER from "../models/orderModel.js";


// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      pin,
      items,
      itemsTotal,
      handlingCharge,
      totalAmount,
      paymentMethod,
      paymentStatus,
    } = req.body;

    // Basic validation
    if (
      !customerName ||
      !phone ||
      !email ||
      !address ||
      !pin ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Required order details are missing",
      });
    }

    // Safe items
    const safeItems = items.map((item) => {
      let productId = null;

      if (
        item.productId &&
        mongoose.Types.ObjectId.isValid(
          item.productId
        )
      ) {
        productId = item.productId;
      }

      return {
        productId,

        name: item.name || "Product",

        price: Number(item.price) || 0,

        quantity: Number(item.quantity) || 1,

        image: item.image || "",
      };
    });

    const order = await ORDER.create({
      userId: req.user?.id || null,

      customerName,

      phone,

      email,

      address,

      pin,

      items: safeItems,

      itemsTotal:
        Number(itemsTotal) || 0,

      handlingCharge:
        Number(handlingCharge) || 150,

      totalAmount:
        Number(totalAmount) || 0,

      paymentMethod,

      paymentStatus:
        paymentStatus || "Pending",

      orderStatus: "Placed",
    });

    return res.status(201).json({
      success: true,

      message: "Order created successfully",

      order,
    });

  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Failed to create order",

      error: error.message,
    });
  }
};


// FETCH ALL ORDERS - ADMIN
export const fetchOrders = async (req, res) => {
  try {
    const orders = await ORDER.find()
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "FETCH ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// FETCH MY ORDERS
export const fetchMyOrders = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    const orders = await ORDER.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch my orders",
      error: error.message,
    });
  }
};


// GET SINGLE ORDER
export const getOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await ORDER.findById(id)
      .populate(
        "userId",
        "name email"
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


// UPDATE ORDER
export const updateOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      orderStatus,
      paymentStatus,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const updateData = {};

    if (orderStatus) {
      updateData.orderStatus =
        orderStatus;
    }

    if (paymentStatus) {
      updateData.paymentStatus =
        paymentStatus;
    }

    const order =
      await ORDER.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order updated successfully",
      order,
    });

  } catch (error) {
    console.error(
      "UPDATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};


// DELETE ORDER
export const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order =
      await ORDER.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};