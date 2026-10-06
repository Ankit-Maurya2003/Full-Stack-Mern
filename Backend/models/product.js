import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
      

    // Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Stock
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // Weight / Quantity
    weight: {
      type: String,
      required: true,
      trim: true,
    },

    // Description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Product Image
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Product Status
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Product kis admin ne create kiya
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PRODUCT = mongoose.model(
  "Product",
  productSchema
);

export default PRODUCT;