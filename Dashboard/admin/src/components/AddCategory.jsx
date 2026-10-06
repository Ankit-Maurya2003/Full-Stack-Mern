import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://full-stack-mern-qqdj.onrender.com/category";

const icons = [
  "🥬",
  "🍎",
  "🍞",
  "🍪",
  "🥤",
  "🧴",
  "🧹",
  "🥛",
];

const AddCategory = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🥬");
  const [uploadedIcon, setUploadedIcon] = useState(null);
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  // =========================
  // CHECK IMAGE URL
  // =========================

  const isImageUrl = (value) => {
    if (typeof value !== "string") return false;

    return (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:image/")
    );
  };

  // =========================
  // LOAD EDIT DATA
  // =========================

  useEffect(() => {
    if (initialData) {
      setName(
        initialData.name ||
          initialData.categoryName ||
          ""
      );

      const savedIcon = initialData.icon || "🥬";

      // Agar saved icon image URL/base64 hai
      if (isImageUrl(savedIcon)) {
        setIcon(savedIcon);

        // Sirf uploaded/base64 ko uploadedIcon mein rakho
        if (savedIcon.startsWith("data:image/")) {
          setUploadedIcon(savedIcon);
        } else {
          // Database se URL aaya hai
          setUploadedIcon(savedIcon);
        }
      } else {
        // Normal emoji
        setUploadedIcon(null);
        setIcon(savedIcon);
      }

      setStatus(
        initialData.status || "Active"
      );
    } else {
      setName("");
      setIcon("🥬");
      setUploadedIcon(null);
      setStatus("Active");
    }
  }, [initialData]);

  // =========================
  // UPLOAD ICON
  // =========================

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setUploadedIcon(imageData);
      setIcon(imageData);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SELECT DEFAULT ICON
  // =========================

  const handleDefaultIcon = (item) => {
    setIcon(item);
    setUploadedIcon(null);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin token not found. Please login again.");
        setLoading(false);
        return;
      }

      // =========================
      // UPDATE CATEGORY
      // =========================

      if (initialData) {
        const id =
          initialData.id ||
          initialData._id;

        if (!id) {
          alert("Category ID not found");
          setLoading(false);
          return;
        }

        console.log(
          "UPDATE CATEGORY ID:",
          id
        );

        const response = await axios.put(
          `${API}/update/${id}`,
          {
            categoryName: name.trim(),
            icon: icon,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "UPDATE RESPONSE:",
          response.data
        );

        alert(
          response.data.message ||
            "Category updated successfully"
        );

        if (onSave) {
          await onSave({
            ...initialData,
            id: id,
            name: name.trim(),
            categoryName: name.trim(),
            icon: icon,
            status: status,
          });
        }

        return;
      }

      // =========================
      // ADD CATEGORY
      // =========================

      const response = await axios.post(
        `${API}/add`,
        {
          categoryName: name.trim(),
          icon: icon,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ADD RESPONSE:",
        response.data
      );

      alert(
        response.data.message ||
          "Category added successfully"
      );

      if (onSave) {
        await onSave({
          name: name.trim(),
          categoryName: name.trim(),
          icon: icon,
          status: status,
        });
      }
    } catch (error) {
      console.error(
        "CATEGORY API ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Category save nahi hui"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

      {/* Back */}
      <button
        type="button"
        onClick={onCancel}
        className="mb-2 text-xs text-gray-500 hover:text-green-600"
      >
        ← Back to Categories
      </button>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {initialData
            ? "Edit Category"
            : "Add New Category"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {initialData
            ? "Update category details"
            : "Add a new category to organize your products"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2"
        >

          {/* Category Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Icon */}
          <div className="mb-6">

            <label className="mb-1 block text-sm font-medium text-gray-700">
              Icon
            </label>

            <p className="mb-3 text-xs text-gray-400">
              Choose an icon
            </p>

            <div className="flex flex-wrap gap-3">

              {/* Default Icons */}
              {icons.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    handleDefaultIcon(item)
                  }
                  className={`
                    flex h-11 w-11 items-center justify-center
                    rounded-lg text-xl
                    ${
                      icon === item &&
                      !uploadedIcon
                        ? "border-2 border-green-500 bg-green-50"
                        : "border border-gray-200 bg-white"
                    }
                  `}
                >
                  {item}
                </button>
              ))}

              {/* Existing / Uploaded Image */}
              <label
                htmlFor="iconUpload"
                title="Upload Icon"
                className={`
                  flex h-11 w-11 cursor-pointer
                  items-center justify-center
                  overflow-hidden
                  rounded-lg
                  ${
                    uploadedIcon
                      ? "border-2 border-green-500 bg-green-50"
                      : "border border-dashed border-green-500 bg-white hover:bg-green-50"
                  }
                `}
              >

                {uploadedIcon ? (
                  <img
                    src={uploadedIcon}
                    alt="Category Icon"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-light text-green-600">
                    +
                  </span>
                )}

                <input
                  id="iconUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconUpload}
                />

              </label>

            </div>
          </div>

          {/* Status */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-7 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Category"
                : "Save Category"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>

        </form>

        {/* PREVIEW */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="mb-6 text-sm font-semibold text-gray-700">
            Preview
          </h2>

          <div className="flex flex-col items-center justify-center py-8">

            {/* Preview Icon */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-green-100 bg-green-50 text-4xl">

              {isImageUrl(icon) ? (
                <img
                  src={icon}
                  alt="Category Icon"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                icon
              )}

            </div>

            <h3 className="text-base font-semibold text-gray-800">
              {name || "Category Name"}
            </h3>

            <span
              className={`
                mt-3 rounded-full px-3 py-1 text-xs font-medium
                ${
                  status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }
              `}
            >
              {status}
            </span>

            <p className="mt-5 text-center text-xs text-gray-400">
              This is how your category will appear
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AddCategory;