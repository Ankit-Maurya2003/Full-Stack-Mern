import Category from "../models/category.js";

// ==========================================
// ADD CATEGORY
// ==========================================

export const addCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { categoryName, status, icon } = req.body;

    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    let categoryIcon = icon || "";

    // Agar image upload hui hai
    if (req.file) {
      categoryIcon = `/uploads/${req.file.filename}`;
    }

    if (!categoryIcon) {
      return res.status(400).json({
        message: "Category icon is required",
      });
    }

    const category = await Category.create({
      categoryName: categoryName.trim(),
      icon: categoryIcon,
      status: status || "Active",
    });

    return res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("ADD CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Category add failed",
      error: error.message,
    });
  }
};

// ==========================================
// FETCH CATEGORY
// ==========================================

export const fetchCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("FETCH CATEGORY ERROR:", error);

    return res.status(500).json({
      message: "Category fetch failed",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (req, res) => {
  try {
    console.log("UPDATE PARAMS:", req.params);
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    const { id } = req.params;

    const {
      categoryName,
      status,
      icon,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Category name update
    if (categoryName && categoryName.trim()) {
      category.categoryName =
        categoryName.trim();
    }

    // Status update
    if (status) {
      category.status = status;
    }

    // ======================================
    // ICON UPDATE
    // ======================================

    // Agar new image upload hui hai
    if (req.file) {
      category.icon =
        `/uploads/${req.file.filename}`;
    }

    // Agar emoji/string icon aaya hai
    else if (icon) {
      category.icon = icon;
    }

    await category.save();

    console.log(
      "CATEGORY UPDATED:",
      category
    );

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Category update failed",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================

export const deletesCategory = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "DELETE CATEGORY ID:",
      id
    );

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category =
      await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Category delete failed",
      error: error.message,
    });
  }
};