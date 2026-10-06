import PRODUCT from "../models/product.js";

// =========================
// ADD PRODUCT
// =========================

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      weight,
      description,
      image,
      status,
    } = req.body;

    // Required fields check
    if (
      !name ||
      !category ||
      price === undefined ||
      stock === undefined ||
      !weight ||
      !image
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Create product
    const product = await PRODUCT.create({
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      weight: weight.trim(),
      description: description
        ? description.trim()
        : "",
      image,
      status: status || "Active",

      // Logged-in admin
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Product add failed",
      error: error.message,
    });
  }
};


// =========================
// FETCH PRODUCTS
// =========================

export const fetchProduct = async (req, res) => {
  try {
    const products = await PRODUCT.find()
      .populate(
        "category",
        "categoryName icon"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(
      "FETCH PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Product fetch failed",
      error: error.message,
    });
  }
};


// =========================
// UPDATE PRODUCT
// =========================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const {
      name,
      category,
      price,
      stock,
      weight,
      description,
      image,
      status,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (price !== undefined) {
      updateData.price = Number(price);
    }

    if (stock !== undefined) {
      updateData.stock = Number(stock);
    }

    if (weight !== undefined) {
      updateData.weight = weight.trim();
    }

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const product =
      await PRODUCT.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "category",
          "categoryName icon"
        )
        .populate(
          "createdBy",
          "name email"
        );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Product update failed",
      error: error.message,
    });
  }
};


// =========================
// DELETE PRODUCT
// =========================

export const deletesProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product =
      await PRODUCT.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Product delete failed",
      error: error.message,
    });
  }
};