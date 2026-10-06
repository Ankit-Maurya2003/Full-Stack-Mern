import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    pin: {
      type: String,
      required: true,
      trim: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    itemsTotal: {
      type: Number,
      required: true,
    },

    handlingCharge: {
      type: Number,
      default: 150,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // =========================
    // PAYMENT METHOD
    // =========================

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "COD"],
      required: true,
    },

    // =========================
    // PAYMENT STATUS
    // =========================

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // =========================
    // RAZORPAY DETAILS
    // =========================

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    // =========================
    // ORDER STATUS
    // =========================

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

const ORDER = mongoose.model("Order", orderSchema);

export default ORDER;