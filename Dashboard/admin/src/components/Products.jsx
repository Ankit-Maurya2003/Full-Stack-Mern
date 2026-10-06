import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Search,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API = "http://localhost:4005/product";
const CATEGORY_API = "http://localhost:4005/category";

const Products = ({
  products: initialProducts = [],
  onAdd,
  onEdit,
}) => {
  const [products, setProducts] = useState(initialProducts);

  // DATABASE CATEGORIES
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const itemsPerPage = 10;

  // =========================
  // TOKEN
  // =========================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.log("Admin token not found");
        return;
      }

      const response = await axios.get(`${API}/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PRODUCT FETCH RESPONSE:", response.data);

      const backendProducts = response.data.products || [];

      const formattedProducts = backendProducts.map((product) => ({
        id: product._id,

        name: product.name,

        category:
          product.category?.categoryName ||
          product.category ||
          "No Category",

        categoryId:
          product.category?._id ||
          product.category ||
          "",

        price: product.price,

        stock: product.stock,

        weight: product.weight,

        description: product.description,

        image: product.image,

        status: product.status,

        createdBy: product.createdBy,
      }));

      setProducts(formattedProducts);
      setCurrentPage(1);
    } catch (error) {
      console.error(
        "FETCH PRODUCT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Products fetch nahi ho paye"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES FROM DATABASE
  // =========================
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const token = getToken();

      if (!token) {
        console.log("Admin token not found");
        return;
      }

      const response = await axios.get(`${CATEGORY_API}/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("CATEGORY FETCH RESPONSE:", response.data);

      const backendCategories =
        response.data.categories ||
        response.data.categoryes ||
        response.data.category ||
        [];

      const formattedCategories = backendCategories
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item.categoryName;
        })
        .filter(Boolean);

      setCategories([
        ...new Set(formattedCategories),
      ]);
    } catch (error) {
      console.error(
        "FETCH CATEGORY ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Categories fetch nahi ho payi"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================
  // FETCH ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Admin token nahi mila");
        return;
      }

      const response = await axios.delete(
        `${API}/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DELETE RESPONSE:", response.data);

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== id
        )
      );

      alert(
        response.data?.message ||
          "Product deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Product delete nahi hua"
      );
    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================
  const handleEdit = (product) => {
    if (onEdit) {
      onEdit(product);
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const searchText =
        search?.toLowerCase() || "";

      const matchSearch =
        productName.includes(searchText);

      const matchCategory =
        category === "All Categories" ||
        product.category === category;

      const matchStatus =
        status === "All Status" ||
        product.status === status;

      return (
        matchSearch &&
        matchCategory &&
        matchStatus
      );
    });
  }, [
    products,
    search,
    category,
    status,
  ]);

  // =========================
  // TOTAL PAGES
  // =========================
  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  // =========================
  // FIX PAGE WHEN FILTER
  // =========================
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // =========================
  // PAGINATION
  // =========================
  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredProducts,
    currentPage,
  ]);

  // =========================
  // VISIBLE PAGINATION
  // =========================
  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // CATEGORY FILTER
  // =========================
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // STATUS FILTER
  // =========================
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // PREVIOUS
  // =========================
  const handlePrevious = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  // =========================
  // NEXT
  // =========================
  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  // =========================
  // PAGE NUMBER
  // =========================
  const handlePageChange = (page) => {
    if (page === "...") return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // SHOWING START
  // =========================
  const showingStart =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  // =========================
  // SHOWING END
  // =========================
  const showingEnd = Math.min(
    currentPage * itemsPerPage,
    filteredProducts.length
  );

  return (
    <div className="min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Product Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <button
          onClick={onAdd}
          className="
            flex items-center justify-center gap-2
            rounded-lg
            bg-green-600
            px-5 py-2.5
            text-sm font-medium
            text-white
            transition
            hover:bg-green-700
          "
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* ================= CARD ================= */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* ================= FILTERS ================= */}
        <div className="border-b p-4 md:p-5">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}
            <div className="
              flex flex-1 items-center gap-2
              rounded-lg
              border border-gray-200
              bg-gray-50
              px-4 py-2.5
            ">

              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search product..."
                className="
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                "
              />

            </div>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={handleCategoryChange}
              className="
                rounded-lg
                border border-gray-200
                bg-gray-50
                px-4 py-2.5
                text-sm
                outline-none
                lg:w-52
              "
            >

              <option>
                All Categories
              </option>

              {categoryLoading ? (
                <option disabled>
                  Loading categories...
                </option>
              ) : (
                categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))
              )}

            </select>

            {/* STATUS */}
            <select
              value={status}
              onChange={handleStatusChange}
              className="
                rounded-lg
                border border-gray-200
                bg-gray-50
                px-4 py-2.5
                text-sm
                outline-none
                lg:w-40
              "
            >

              <option>
                All Status
              </option>

              <option>
                Active
              </option>

              <option>
                Inactive
              </option>

            </select>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-sm">

            <thead>
              <tr className="border-b bg-gray-50 text-left">

                <th className="px-5 py-4 text-gray-500">
                  Product Name
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Category
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Price
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Stock
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedProducts.map(
                (product) => (

                  <tr
                    key={product.id}
                    className="
                      border-b
                      transition
                      hover:bg-gray-50
                    "
                  >

                    {/* PRODUCT NAME */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="
                          flex h-10 w-10
                          shrink-0
                          items-center justify-center
                          overflow-hidden
                          rounded-lg
                          bg-gray-50
                          text-2xl
                        ">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            "📦"
                          )}

                        </div>

                        <div>

                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>

                          {product.weight && (
                            <p className="text-xs text-gray-400">
                              {product.weight}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-4 text-gray-600">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4 font-medium text-gray-700">
                      ₹{product.price}
                    </td>

                    {/* STOCK */}
                    <td className="px-5 py-4">

                      <span
                        className={
                          product.stock <= 10
                            ? "font-medium text-red-500"
                            : "text-gray-700"
                        }
                      >
                        {product.stock}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3 py-1
                          text-xs
                          font-medium
                          ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }
                        `}
                      >
                        {product.status}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="
                            rounded-md
                            p-1
                            text-gray-400
                            transition
                            hover:bg-green-50
                            hover:text-green-600
                          "
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          className="
                            rounded-md
                            p-1
                            text-gray-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                          "
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {/* NO PRODUCTS */}
          {paginatedProducts.length === 0 && (
            <div className="
              py-12
              text-center
              text-sm
              text-gray-400
            ">

              {loading
                ? "Loading products..."
                : "No products found"}

            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="
          flex flex-col gap-4
          border-t
          bg-white
          px-5 py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          {/* SHOWING COUNT */}
          <div className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-800">
              {showingStart}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-gray-800">
              {showingEnd}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>

            {" "}products

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="
              flex
              max-w-full
              items-center
              gap-2
              overflow-x-auto
              pb-1
            ">

              {/* PREVIOUS */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3 py-2
                  text-sm
                  font-medium
                  text-gray-600
                  transition
                  hover:border-green-500
                  hover:bg-green-50
                  hover:text-green-600
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <ChevronLeft size={16} />

                <span className="hidden sm:inline">
                  Previous
                </span>

              </button>

              {/* PAGE NUMBERS */}
              <div className="flex shrink-0 items-center gap-1">

                {getVisiblePages().map(
                  (page, index) => {

                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="
                            flex
                            h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            text-sm
                            font-medium
                            text-gray-400
                          "
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() =>
                          handlePageChange(page)
                        }
                        className={`
                          flex
                          h-9
                          min-w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          px-2
                          text-sm
                          font-medium
                          transition

                          ${
                            currentPage === page
                              ? "bg-green-600 text-white shadow-sm"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
                          }
                        `}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

              </div>

              {/* NEXT */}
              <button
                onClick={handleNext}
                disabled={
                  currentPage === totalPages
                }
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3 py-2
                  text-sm
                  font-medium
                  text-gray-600
                  transition
                  hover:border-green-500
                  hover:bg-green-50
                  hover:text-green-600
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <span className="hidden sm:inline">
                  Next
                </span>

                <ChevronRight size={16} />

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Products;