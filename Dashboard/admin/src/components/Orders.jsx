import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Search,
  Eye,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
} from "lucide-react";

const API = "https://full-stack-mern-qqdj.onrender.com/order";

const statusOptions = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const itemsPerPage = 10;

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin token not found. Please login again.");
        return;
      }

      const response = await axios.get(`${API}/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ORDERS FROM BACKEND:", response.data);

      const backendOrders = response.data.orders || [];

      setOrders(backendOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Only admin can access orders.");
      } else {
        setError(
          err.response?.data?.message ||
            "Orders fetch nahi ho rahe hain."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase().trim();

      const orderId = order._id
        ? order._id.toLowerCase()
        : "";

      const customerName = order.customerName
        ? order.customerName.toLowerCase()
        : "";

      const phone = order.phone
        ? order.phone.toLowerCase()
        : "";

      const searchMatch =
        orderId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        phone.includes(searchValue);

      const statusMatch =
        status === "All" ||
        order.orderStatus === status;

      return searchMatch && statusMatch;
    });
  }, [orders, search, status]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredOrders.length / itemsPerPage
  );

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredOrders.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredOrders, currentPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const token = getToken();

      if (!token) {
        alert("Admin token not found.");
        return;
      }

      const response = await axios.put(
        `${API}/update/${orderId}`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATED ORDER:",
        response.data
      );

      const updatedOrder = response.data.order;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus:
                  updatedOrder?.orderStatus ||
                  newStatus,
              }
            : order
        )
      );

      if (
        selectedOrder &&
        selectedOrder._id === orderId
      ) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus:
            updatedOrder?.orderStatus ||
            newStatus,
        }));
      }
    } catch (err) {
      console.error(
        "Update order error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Order status update nahi hua."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const token = getToken();

      if (!token) {
        alert("Admin token not found.");
        return;
      }

      await axios.delete(
        `${API}/delete/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order._id !== orderId
        )
      );

      if (
        selectedOrder &&
        selectedOrder._id === orderId
      ) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error(
        "Delete order error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Order delete nahi hua."
      );
    }
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const statusStyle = (value) => {
    if (value === "Delivered") {
      return "bg-green-100 text-green-600";
    }

    if (value === "Placed") {
      return "bg-yellow-100 text-yellow-600";
    }

    if (value === "Confirmed") {
      return "bg-blue-100 text-blue-600";
    }

    if (value === "Shipped") {
      return "bg-indigo-100 text-indigo-600";
    }

    if (value === "Out for Delivery") {
      return "bg-purple-100 text-purple-600";
    }

    if (value === "Cancelled") {
      return "bg-red-100 text-red-500";
    }

    return "bg-gray-100 text-gray-600";
  };

  // =====================================================
  // PAYMENT STYLE
  // =====================================================

  const paymentStyle = (value) => {
    if (value === "Paid") {
      return "bg-green-100 text-green-600";
    }

    if (value === "Pending") {
      return "bg-yellow-100 text-yellow-600";
    }

    if (value === "Failed") {
      return "bg-red-100 text-red-500";
    }

    return "bg-gray-100 text-gray-600";
  };

  // =====================================================
  // ITEMS COUNT
  // =====================================================

  const getItemsCount = (order) => {
    if (!order.items) return 0;

    return order.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  // =====================================================
  // ITEM PRICE
  // =====================================================

  const getItemPrice = (item) => {
    return Number(
      item.price ||
        item.mrp ||
        0
    );
  };

  // =====================================================
  // ITEM TOTAL
  // =====================================================

  const getItemTotal = (item) => {
    const price = getItemPrice(item);

    const quantity = Number(
      item.quantity || 1
    );

    return price * quantity;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={35}
            className="animate-spin text-green-600"
          />

          <p className="text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen p-2 md:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Order Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track customer orders
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Placed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {orders.filter(
              (o) => o.orderStatus === "Placed"
            ).length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Out for Delivery
          </p>

          <h2 className="mt-2 text-2xl font-bold text-purple-600">
            {orders.filter(
              (o) =>
                o.orderStatus ===
                "Out for Delivery"
            ).length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Delivered
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {orders.filter(
              (o) =>
                o.orderStatus ===
                "Delivered"
            ).length}
          </h2>
        </div>

      </div>

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-xl border bg-white">

        {/* FILTER */}
        <div className="border-b p-4 md:p-5">

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="flex flex-1 items-center gap-2 rounded-lg border bg-gray-50 px-4 py-2.5">

              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search order, customer or phone..."
                className="w-full bg-transparent text-sm outline-none"
              />

            </div>

            <div className="relative">

              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full appearance-none rounded-lg border bg-gray-50 px-4 py-2.5 pr-10 text-sm outline-none md:w-52"
              >
                <option value="All">
                  All Status
                </option>

                {statusOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-3 text-gray-400"
              />

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-sm">

            <thead>
              <tr className="border-b bg-gray-50 text-left">

                <th className="px-5 py-4 text-gray-500">
                  Order ID
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Items
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-center text-gray-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {paginatedOrders.map(
                (order) => (

                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* ORDER ID */}
                    <td className="px-5 py-4 font-semibold">
                      #
                      {order._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-5 py-4">

                      <p className="font-medium">
                        {order.customerName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {order.phone}
                      </p>

                    </td>

                    {/* ITEMS */}
                    <td className="px-5 py-4">
                      {getItemsCount(order)}
                    </td>

                    {/* TOTAL AMOUNT */}
                    <td className="px-5 py-4 font-semibold">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">

                      <div className="relative w-fit">

                        <select
                          value={
                            order.orderStatus ||
                            "Placed"
                          }
                          disabled={
                            updatingId ===
                            order._id
                          }
                          onChange={(e) =>
                            updateOrderStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          className={`appearance-none rounded-full border-0 px-3 py-1 pr-8 text-xs font-medium outline-none ${statusStyle(
                            order.orderStatus
                          )}`}
                        >

                          {statusOptions.map(
                            (item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            )
                          )}

                        </select>

                        {updatingId ===
                        order._id ? (
                          <Loader2
                            size={13}
                            className="absolute right-2 top-1.5 animate-spin"
                          />
                        ) : (
                          <ChevronDown
                            size={13}
                            className="pointer-events-none absolute right-2 top-1.5"
                          />
                        )}

                      </div>

                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="text-gray-400 hover:text-green-600"
                          title="View Order"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() =>
                            deleteOrder(
                              order._id
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                          title="Delete Order"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {paginatedOrders.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No orders found
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {filteredOrders.length === 0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-700">
              {Math.min(
                currentPage * itemsPerPage,
                filteredOrders.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {filteredOrders.length}
            </span>{" "}
            orders
          </p>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center gap-1">

              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`min-w-9 rounded-md px-3 py-1.5 text-sm transition ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>

              ))}

              <button
                onClick={handleNext}
                disabled={
                  currentPage === totalPages
                }
                className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 md:p-6"
          >

            {/* MODAL HEADER */}
            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  #
                  {selectedOrder._id
                    ?.slice(-8)
                    .toUpperCase()}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* CUSTOMER INFORMATION */}
            <div className="mb-5 rounded-xl border bg-gray-50 p-4">

              <h3 className="mb-3 font-semibold text-gray-800">
                Customer Information
              </h3>

              <div className="grid gap-3 md:grid-cols-2">

                <div>
                  <p className="text-xs text-gray-400">
                    Customer Name
                  </p>

                  <p className="font-medium">
                    {selectedOrder.customerName ||
                      "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <Phone
                    size={16}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="font-medium">
                      {selectedOrder.phone ||
                        "-"}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <Mail
                    size={16}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p className="break-all font-medium">
                      {selectedOrder.email ||
                        "-"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-2">

                  <MapPin
                    size={16}
                    className="mt-1 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-400">
                      Address
                    </p>

                    <p className="font-medium">
                      {selectedOrder.address ||
                        "-"}
                    </p>

                    <p className="text-sm text-gray-500">
                      PIN:{" "}
                      {selectedOrder.pin ||
                        "-"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                ORDER ITEMS
            ================================================= */}

            <div className="mb-5">

              <div className="mb-3 flex items-center gap-2">

                <Package
                  size={18}
                  className="text-green-600"
                />

                <h3 className="font-semibold">
                  Order Items
                </h3>

              </div>

              <div className="space-y-3">

                {selectedOrder.items?.length > 0 ? (

                  selectedOrder.items.map(
                    (item, index) => {

                      const price =
                        getItemPrice(item);

                      const quantity =
                        Number(
                          item.quantity || 1
                        );

                      const itemTotal =
                        price * quantity;

                      return (
                        <div
                          key={
                            item.productId ||
                            index
                          }
                          className="flex items-center justify-between rounded-xl border p-3"
                        >

                          {/* LEFT */}
                          <div className="flex min-w-0 items-center gap-3">

                            {/* IMAGE */}

                            {item.image ? (

                              <img
                                src={item.image}
                                alt={
                                  item.name ||
                                  "Product"
                                }
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                <Package
                                  size={22}
                                  className="text-gray-400"
                                />
                              </div>

                            )}

                            {/* NAME + PRICE */}

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-gray-800">
                                {item.name ||
                                  "Product"}
                              </p>

                              <p className="mt-1 text-sm text-gray-400">

                                ₹
                                {price.toLocaleString(
                                  "en-IN"
                                )}

                                {" × "}

                                {quantity}

                              </p>

                            </div>

                          </div>

                          {/* ITEM TOTAL */}

                          <p className="ml-3 shrink-0 font-bold text-gray-800">

                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>
                      );
                    }
                  )

                ) : (

                  <div className="rounded-lg border p-5 text-center text-sm text-gray-400">
                    No items found
                  </div>

                )}

              </div>

            </div>

            {/* PAYMENT INFORMATION */}
            <div className="mb-5 rounded-xl border p-4">

              <div className="mb-3 flex items-center gap-2">

                <CreditCard
                  size={18}
                  className="text-green-600"
                />

                <h3 className="font-semibold">
                  Payment Information
                </h3>

              </div>

              <div className="flex justify-between">

                <div>

                  <p className="text-xs text-gray-400">
                    Payment Method
                  </p>

                  <p className="font-medium">
                    {selectedOrder.paymentMethod ||
                      "-"}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Payment Status
                  </p>

                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${paymentStyle(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus ||
                      "Pending"}
                  </span>

                </div>

              </div>

            </div>

            {/* AMOUNT */}
            <div className="mb-5 rounded-xl bg-gray-50 p-4">

              <div className="flex justify-between py-1 text-sm">

                <span className="text-gray-500">
                  Items Total
                </span>

                <span>
                  ₹
                  {Number(
                    selectedOrder.itemsTotal || 0
                  ).toLocaleString("en-IN")}
                </span>

              </div>

              <div className="flex justify-between py-1 text-sm">

                <span className="text-gray-500">
                  Handling Charge
                </span>

                <span>
                  ₹
                  {Number(
                    selectedOrder.handlingCharge || 0
                  ).toLocaleString("en-IN")}
                </span>

              </div>

              <div className="mt-2 flex justify-between border-t pt-3">

                <span className="font-semibold">
                  Grand Total
                </span>

                <span className="text-lg font-bold text-green-600">
                  ₹
                  {Number(
                    selectedOrder.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            {/* STATUS */}
            <div className="mb-5">

              <p className="mb-2 text-sm font-medium text-gray-500">
                Update Order Status
              </p>

              <div className="relative">

                <select
                  value={
                    selectedOrder.orderStatus ||
                    "Placed"
                  }
                  disabled={
                    updatingId ===
                    selectedOrder._id
                  }
                  onChange={(e) =>
                    updateOrderStatus(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                  className={`w-full appearance-none rounded-lg border px-4 py-3 text-sm font-medium outline-none ${statusStyle(
                    selectedOrder.orderStatus
                  )}`}
                >

                  {statusOptions.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-3.5"
                />

              </div>

            </div>

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedOrder(null)
              }
              className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Orders;