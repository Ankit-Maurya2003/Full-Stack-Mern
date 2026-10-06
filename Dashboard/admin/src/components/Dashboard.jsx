import React, { useEffect, useMemo, useState } from "react";

import {
  Grid2X2,
  Package,
  ShoppingCart,
  Users,
  Search,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

const API = "https://full-stack-mern-qqdj.onrender.com";

const Dashboard = ({ setActivePage }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // =====================================================
  // GET ARRAY FROM BACKEND RESPONSE
  // =====================================================
  const getArrayFromResponse = (response, keys = []) => {
    const data = response?.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== "object") {
      return [];
    }

    for (const key of keys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Admin token nahi mila. Please login again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const results = await Promise.allSettled([
        axios.get(`${API}/category/fetch`, config),
        axios.get(`${API}/product/fetch`, config),
        axios.get(`${API}/order/fetch`, config),
        axios.get(`${API}/users/fetch`, config),
      ]);

      // =================================================
      // CATEGORIES
      // =================================================
      if (results[0].status === "fulfilled") {
        const categoryData = getArrayFromResponse(
          results[0].value,
          [
            "categories",
            "categoryes",
            "category",
            "categoriesData",
          ]
        );

        setCategories(categoryData);
      } else {
        console.log(
          "Category API error:",
          results[0].reason?.response?.data ||
            results[0].reason?.message
        );

        setCategories([]);
      }

      // =================================================
      // PRODUCTS
      // =================================================
      if (results[1].status === "fulfilled") {
        const productData = getArrayFromResponse(
          results[1].value,
          [
            "products",
            "productes",
            "product",
            "productsData",
          ]
        );

        setProducts(productData);
      } else {
        console.log(
          "Product API error:",
          results[1].reason?.response?.data ||
            results[1].reason?.message
        );

        setProducts([]);
      }

      // =================================================
      // ORDERS
      // =================================================
      if (results[2].status === "fulfilled") {
        const orderData = getArrayFromResponse(
          results[2].value,
          [
            "orders",
            "orderes",
            "order",
            "ordersData",
          ]
        );

        setOrders(orderData);
      } else {
        console.log(
          "Order API error:",
          results[2].reason?.response?.data ||
            results[2].reason?.message
        );

        setOrders([]);
      }

      // =================================================
      // USERS
      // =================================================
      if (results[3].status === "fulfilled") {
        const userData = getArrayFromResponse(
          results[3].value,
          [
            "users",
            "useres",
            "user",
            "usersData",
          ]
        );

        setUsers(userData);
      } else {
        console.log(
          "User API error:",
          results[3].reason?.response?.data ||
            results[3].reason?.message
        );

        setUsers([]);
      }

      const allFailed = results.every(
        (result) => result.status === "rejected"
      );

      if (allFailed) {
        setError(
          "Dashboard data fetch nahi ho raha. Backend/API check karo."
        );
      }
    } catch (err) {
      console.log(
        "Dashboard fetch error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Dashboard data fetch nahi ho raha."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH ON PAGE LOAD
  // =====================================================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // CATEGORY ID
  // =====================================================
  const getCategoryId = (category) => {
    if (!category) return "";

    return String(
      category._id ||
        category.id ||
        category.categoryId ||
        ""
    );
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================
  const getCategoryName = (category) => {
    if (!category) return "Unknown";

    return (
      category.categoryName ||
      category.name ||
      category.title ||
      "Unknown"
    );
  };

  // =====================================================
  // CHECK PRODUCT CATEGORY
  // =====================================================
  const productBelongsToCategory = (
    product,
    category
  ) => {
    const categoryId = getCategoryId(category);

    const categoryName = getCategoryName(category)
      .trim()
      .toLowerCase();

    const values = [
      product?.category,
      product?.categoryName,
      product?.categoryId,
      product?.categoryID,
    ];

    for (const value of values) {
      if (!value) continue;

      // Object category
      if (
        typeof value === "object" &&
        value !== null
      ) {
        const objectId = String(
          value._id ||
            value.id ||
            value.categoryId ||
            ""
        );

        const objectName = String(
          value.categoryName ||
            value.name ||
            value.title ||
            ""
        )
          .trim()
          .toLowerCase();

        if (
          categoryId &&
          objectId &&
          objectId === categoryId
        ) {
          return true;
        }

        if (
          categoryName &&
          objectName &&
          objectName === categoryName
        ) {
          return true;
        }
      }

      // String / ObjectId category
      else {
        const stringValue = String(value)
          .trim()
          .toLowerCase();

        if (
          categoryId &&
          stringValue === categoryId.toLowerCase()
        ) {
          return true;
        }

        if (
          categoryName &&
          stringValue === categoryName
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // =====================================================
  // TOP CATEGORIES
  // =====================================================
  const topCategories = useMemo(() => {
    if (!categories.length) {
      return [];
    }

    const result = categories.map((category) => {
      const categoryName =
        getCategoryName(category);

      const matchingProducts = products.filter(
        (product) =>
          productBelongsToCategory(
            product,
            category
          )
      );

      let count = matchingProducts.length;

      if (
        count === 0 &&
        Array.isArray(category.products)
      ) {
        count = category.products.length;
      }

      return {
        id:
          category._id ||
          category.id ||
          categoryName,

        name: categoryName,

        icon:
          category.icon ||
          category.image ||
          "📦",

        count,
      };
    });

    return result
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [categories, products]);

  // =====================================================
  // RENDER CATEGORY ICON
  // =====================================================
  const renderCategoryIcon = (
    icon,
    categoryName
  ) => {
    if (!icon) {
      return (
        <span className="text-xl">
          📦
        </span>
      );
    }

    if (typeof icon !== "string") {
      return (
        <span className="text-xl">
          📦
        </span>
      );
    }

    const cleanIcon = icon.trim();

    // BASE64 IMAGE
    if (
      cleanIcon.startsWith("data:image/")
    ) {
      return (
        <img
          src={cleanIcon}
          alt={categoryName}
          className="w-7 h-7 object-contain rounded"
        />
      );
    }

    // RAW BASE64 PNG
    if (
      cleanIcon.startsWith("iVBOR")
    ) {
      return (
        <img
          src={`data:image/png;base64,${cleanIcon}`}
          alt={categoryName}
          className="w-7 h-7 object-contain rounded"
        />
      );
    }

    // URL IMAGE
    if (
      cleanIcon.startsWith("http://") ||
      cleanIcon.startsWith("https://") ||
      cleanIcon.startsWith("/")
    ) {
      return (
        <img
          src={cleanIcon}
          alt={categoryName}
          className="w-7 h-7 object-contain rounded"
          onError={(e) => {
            e.currentTarget.style.display =
              "none";
          }}
        />
      );
    }

    // EMOJI / TEXT
    return (
      <span className="text-xl">
        {cleanIcon}
      </span>
    );
  };

  // =====================================================
  // MONTHLY ORDER CHART
  // =====================================================
  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear =
      new Date().getFullYear();

    const monthlyData = months.map(
      (month) => ({
        month,
        sales: 0,
      })
    );

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(
        order.createdAt
      );

      if (isNaN(date.getTime())) return;

      if (
        date.getFullYear() !==
        currentYear
      ) {
        return;
      }

      const monthIndex =
        date.getMonth();

      monthlyData[
        monthIndex
      ].sales += 1;
    });

    return monthlyData;
  }, [orders]);

  // =====================================================
  // RECENT ORDERS
  // =====================================================
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  // =====================================================
  // SEARCH
  // =====================================================
  const filteredRecentOrders =
    useMemo(() => {
      if (!search.trim()) {
        return recentOrders;
      }

      const searchText =
        search.toLowerCase().trim();

      return recentOrders.filter(
        (order) => {
          const text = `
            ${order.customerName || ""}
            ${order.name || ""}
            ${order.email || ""}
            ${order.phone || ""}
            ${order._id || ""}
            ${order.orderNumber || ""}
            ${order.orderId || ""}
            ${order.orderStatus || ""}
          `.toLowerCase();

          return text.includes(
            searchText
          );
        }
      );
    }, [recentOrders, search]);

  // =====================================================
  // STATUS CLASS
  // =====================================================
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";

      case "Pending":
        return "bg-yellow-100 text-yellow-600";

      case "Confirmed":
        return "bg-blue-100 text-blue-600";

      case "Shipped":
        return "bg-purple-100 text-purple-600";

      case "Out for Delivery":
        return "bg-orange-100 text-orange-600";

      case "Cancelled":
        return "bg-red-100 text-red-600";

      case "Placed":
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  // =====================================================
  // ORDER ID
  // =====================================================
  const getOrderId = (order) => {
    if (order?.orderNumber) {
      return order.orderNumber;
    }

    if (order?.orderId) {
      return order.orderId;
    }

    if (order?._id) {
      return `ORD-${String(
        order._id
      )
        .slice(-6)
        .toUpperCase()}`;
    }

    return "ORD-0000";
  };

  // =====================================================
  // DATE
  // =====================================================
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(
      dateValue
    );

    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // AMOUNT
  // =====================================================
  const formatAmount = (amount) => {
    const value = Number(
      amount || 0
    );

    return value.toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    );
  };

  return (
    <div className="min-h-screen w-full">

      {/* =================================================
          HEADER
      ================================================== */}
      <div className="sm:flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your store
          </p>
        </div>

        <div className="sm:flex items-center gap-4">

          {/* SEARCH */}
          <div className="flex my-5 sm:my-0 items-center gap-2 bg-white border rounded-lg px-3 py-2 w-auto">

            <Search
              size={17}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="outline-none text-sm w-full"
            />

          </div>

          {/* ADMIN ONLY - LOGOUT REMOVED */}
          <div className="hidden sm:block">

            <div className="flex items-center gap-2">

              <div className="h-9 w-9 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Admin
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>
              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">

          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-xs"
          >
            <RefreshCw size={14} />
            Retry
          </button>

        </div>
      )}

      {/* =================================================
          STATISTICS CARDS
      ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* CATEGORIES */}
        <div
          onClick={() =>
            setActivePage("Categories")
          }
          className="bg-white border border-purple-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Categories
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {loading
                  ? "..."
                  : categories.length.toLocaleString(
                      "en-IN"
                    )}
              </h2>
            </div>

            <div className="h-11 w-11 rounded-lg bg-purple-100 flex items-center justify-center">

              <Grid2X2
                size={22}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>

        {/* PRODUCTS */}
        <div
          onClick={() =>
            setActivePage("Product")
          }
          className="bg-white border border-orange-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {loading
                  ? "..."
                  : products.length.toLocaleString(
                      "en-IN"
                    )}
              </h2>
            </div>

            <div className="h-11 w-11 rounded-lg bg-orange-100 flex items-center justify-center">

              <Package
                size={22}
                className="text-orange-500"
              />

            </div>

          </div>

        </div>

        {/* ORDERS */}
        <div
          onClick={() =>
            setActivePage("Orders")
          }
          className="bg-white border border-red-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {loading
                  ? "..."
                  : orders.length.toLocaleString(
                      "en-IN"
                    )}
              </h2>
            </div>

            <div className="h-11 w-11 rounded-lg bg-red-100 flex items-center justify-center">

              <ShoppingCart
                size={22}
                className="text-red-500"
              />

            </div>

          </div>

        </div>

        {/* USERS */}
        <div
          onClick={() =>
            setActivePage("Users")
          }
          className="bg-white border border-blue-100 rounded-xl p-5 cursor-pointer hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {loading
                  ? "..."
                  : users.length.toLocaleString(
                      "en-IN"
                    )}
              </h2>
            </div>

            <div className="h-11 w-11 rounded-lg bg-blue-100 flex items-center justify-center">

              <Users
                size={22}
                className="text-blue-500"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          MIDDLE SECTION
      ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

        {/* ORDERS OVERVIEW */}
        <div className="lg:col-span-2 bg-white rounded-xl overflow-x-auto border h-auto p-6 sm:p-10">

          <div className="sm:flex items-center justify-between mb-5">

            <div>
              <h2 className="font-bold text-gray-800">
                Orders Overview
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Monthly order statistics
              </p>
            </div>

            <select className="border rounded-lg px-3 sm:mt-0 mt-2 py-2 text-xs outline-none">

              <option>
                This Year
              </option>

              <option>
                This Month
              </option>

              <option>
                Last Month
              </option>

            </select>

          </div>

          {/* CHART */}
          <div className="w-full h-[300px]">

            {loading ? (

              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Loading chart...
              </div>

            ) : orders.length === 0 ? (

              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No order data available
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

        {/* TOP CATEGORIES */}
        <div className="bg-white rounded-xl border p-5">

          <div className="flex items-center justify-between mb-5">

            <h2 className="font-bold text-gray-800">
              Top Categories
            </h2>

            <button
              onClick={() =>
                setActivePage(
                  "Categories"
                )
              }
              className="text-xs text-gray-400 hover:text-blue-400"
            >
              View All
            </button>

          </div>

          <div className="space-y-5">

            {loading ? (

              <p className="text-sm text-gray-400">
                Loading categories...
              </p>

            ) : topCategories.length === 0 ? (

              <p className="text-sm text-gray-400">
                No categories found
              </p>

            ) : (

              topCategories.map(
                (category) => (

                  <div
                    key={category.id}
                    className="flex justify-between items-center"
                  >

                    <div className="flex gap-3 items-center min-w-0">

                      <div className="w-7 h-7 flex items-center justify-center shrink-0">

                        {renderCategoryIcon(
                          category.icon,
                          category.name
                        )}

                      </div>

                      <span className="text-sm truncate">
                        {category.name}
                      </span>

                    </div>

                    <span className="text-sm font-semibold ml-3">
                      {category.count.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================== */}
      <div className="bg-white border rounded-xl mt-6 p-3">

        <div className="flex items-center overflow-x-auto justify-between mb-5">

          <h2 className="font-bold text-gray-800">
            Recent Orders
          </h2>

          <button
            onClick={() =>
              setActivePage("Orders")
            }
            className="text-xs rounded-lg px-2 py-2 whitespace-nowrap"
          >
            View All Orders
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b text-left text-gray-400">

                <th className="px-5 py-4">
                  Order ID
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Amount
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-400"
                  >
                    Loading orders...
                  </td>

                </tr>

              ) : filteredRecentOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-400"
                  >
                    No orders found
                  </td>

                </tr>

              ) : (

                filteredRecentOrders.map(
                  (order, index) => (

                    <tr
                      key={
                        order._id ||
                        index
                      }
                      className="border-b last:border-b-0"
                    >

                      {/* ORDER ID */}
                      <td className="px-5 py-4 font-medium whitespace-nowrap">
                        #{getOrderId(order)}
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {order.customerName ||
                          order.name ||
                          "Unknown Customer"}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatAmount(
                          order.totalAmount
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span
                          className={`${getStatusClass(
                            order.orderStatus
                          )} px-3 py-1 rounded-full text-xs whitespace-nowrap`}
                        >
                          {order.orderStatus ||
                            "Placed"}
                        </span>

                      </td>

                      {/* DATE */}
                      <td className="text-gray-500 px-5 py-4 whitespace-nowrap">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;