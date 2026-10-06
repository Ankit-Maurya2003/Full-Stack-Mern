import React, { useEffect, useState } from "react";
import axios from "axios";

const CATEGORY_API = "http://localhost:4005/category";
const PRODUCT_API = "http://localhost:4005/product";

const AddProduct = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    weight: "",
    description: "",
    image: "",
    status: "Active",
  });

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const token = getToken();

      if (!token) {
        alert("Admin token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${CATEGORY_API}/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CATEGORY RESPONSE:",
        response.data
      );

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.log(
        "CATEGORY ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Category fetch failed"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // EDIT DATA
  // ==========================================

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",

        category:
          initialData.category?._id ||
          initialData.category ||
          "",

        price: initialData.price ?? "",

        stock: initialData.stock ?? "",

        weight: initialData.weight || "",

        description:
          initialData.description || "",

        image: initialData.image || "",

        status:
          initialData.status || "Active",
      });
    } else {
      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        weight: "",
        description: "",
        image: "",
        status: "Active",
      });
    }
  }, [initialData]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE
  // ==========================================

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name");
      return;
    }

    if (!form.category) {
      alert("Please select category");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      alert("Please enter valid price");
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      alert("Please enter valid stock");
      return;
    }

    if (!form.weight.trim()) {
      alert("Please enter weight / quantity");
      return;
    }

    if (!form.image) {
      alert("Please upload product image");
      return;
    }

    const token = getToken();

    if (!token) {
      alert(
        "Admin token not found. Please login again."
      );
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      weight: form.weight.trim(),
      description: form.description.trim(),
      image: form.image,
      status: form.status,
    };

    console.log(
      "PRODUCT DATA:",
      productData
    );

    try {
      setSaving(true);

      let response;

      // ========================================
      // UPDATE PRODUCT
      // ========================================

      if (initialData) {
        const productId =
          initialData._id ||
          initialData.id;

        if (!productId) {
          alert("Product ID not found");
          return;
        }

        console.log(
          "UPDATE URL:",
          `${PRODUCT_API}/update/${productId}`
        );

        response = await axios.put(
          `${PRODUCT_API}/update/${productId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        console.log(
          "UPDATE RESPONSE:",
          response.data
        );

        alert(
          response.data.message ||
            "Product updated successfully"
        );
      }

      // ========================================
      // ADD PRODUCT
      // ========================================

      else {
        console.log(
          "ADD URL:",
          `${PRODUCT_API}/add`
        );

        response = await axios.post(
          `${PRODUCT_API}/add`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        console.log(
          "ADD RESPONSE:",
          response.data
        );

        alert(
          response.data.message ||
            "Product added successfully"
        );
      }

      // Parent refresh
      if (onSave) {
        onSave(
          response.data.product ||
            response.data.products ||
            response.data
        );
      }
    } catch (error) {
      console.log(
        "PRODUCT ERROR:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          (initialData
            ? "Product update failed"
            : "Product add failed")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SELECTED CATEGORY
  // ==========================================

  const selectedCategory =
    categories.find(
      (category) =>
        category._id === form.category
    );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen">

      {/* BACK */}

      <button
        onClick={onCancel}
        className="mb-2 text-xs text-gray-500 transition hover:text-green-600"
      >
        ← Back to Products
      </button>

      {/* HEADING */}

      <div className="mb-5">

        <h1 className="text-2xl font-bold text-gray-800">
          {initialData
            ? "Edit Product"
            : "Add New Product"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {initialData
            ? "Update your product details"
            : "Add a new product to your store"}
        </p>

      </div>

      {/* MAIN */}

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">

        {/* =====================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2"
        >

          {/* PRODUCT NAME */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
            />

          </div>

          {/* CATEGORY */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category *
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 disabled:bg-gray-100"
            >

              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categories
                .filter(
                  (category) =>
                    category.status ===
                    "Active"
                )
                .map((category) => (

                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.categoryName}
                  </option>

                ))}

            </select>

            {categories.length === 0 &&
              !loadingCategories && (
                <p className="mt-2 text-xs text-red-500">
                  No categories found
                </p>
              )}

          </div>

          {/* PRICE + STOCK */}

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* PRICE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price *
              </label>

              <div className="relative">

                <span className="absolute left-4 top-2.5 text-gray-500">
                  ₹
                </span>

                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-green-500"
                />

              </div>

            </div>

            {/* STOCK */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Stock *
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
              />

            </div>

          </div>

          {/* WEIGHT */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Weight / Quantity *
            </label>

            <input
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Example: 1 kg, 500 gm, 1 L"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter product description"
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
            />

          </div>

          {/* PRODUCT IMAGE */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Image *
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition hover:border-green-400 hover:bg-green-50">

              {form.image ? (

                <div className="flex flex-col items-center">

                  <img
                    src={form.image}
                    alt="Product Preview"
                    className="mb-3 h-24 w-24 rounded-xl object-cover shadow-sm"
                  />

                  <p className="mb-2 text-xs text-gray-500">
                    Image selected
                  </p>

                </div>

              ) : (

                <div className="mb-3 flex justify-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-3xl">
                    📦
                  </div>

                </div>

              )}

              <p className="text-sm font-medium text-gray-700">
                Upload product image
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or JPEG
              </p>

              <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-green-700">

                Choose Image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImage}
                  className="hidden"
                />

              </label>

            </div>

          </div>

          {/* STATUS */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : initialData
                ? "Update Product"
                : "Save Product"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>

        </form>

        {/* =====================================
            PREVIEW
        ====================================== */}

        <div className="h-fit w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-sm font-semibold text-gray-700">
            Product Preview
          </h2>

          <div className="flex flex-col items-center justify-center py-6">

            <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 text-5xl">

              {form.image ? (

                <img
                  src={form.image}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />

              ) : (
                "📦"
              )}

            </div>

            <h3 className="text-center text-base font-semibold text-gray-800">
              {form.name ||
                "Product Name"}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {selectedCategory
                ? selectedCategory.categoryName
                : "Category Name"}
            </p>

            <p className="mt-3 text-lg font-bold text-gray-900">
              ₹{form.price || "0"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {form.weight ||
                "Weight / Quantity"}
            </p>

            <span
              className={`
                mt-3 rounded-full px-3 py-1 text-xs font-medium
                ${
                  Number(form.stock) > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }
              `}
            >
              {Number(form.stock) > 0
                ? `${form.stock} In Stock`
                : "Out of Stock"}
            </span>

            <span
              className={`
                mt-2 rounded-full px-3 py-1 text-xs font-medium
                ${
                  form.status === "Active"
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }
              `}
            >
              {form.status}
            </span>

            <p className="mt-5 text-center text-xs text-gray-400">
              This is how your product will appear in the store
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddProduct;