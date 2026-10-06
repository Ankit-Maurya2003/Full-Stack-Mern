import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:4005/order";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH MY ORDERS
  // =========================
  const fetchMyOrders = useCallback(async (isRefresh = false) => {
    try {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(`${API}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data?.orders || []);
    } catch (err) {
      console.log("Fetch orders error:", err);

      setError(
        err.response?.data?.message ||
          "Orders fetch nahi ho rahe hain."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // =========================
  // PAGE LOAD PAR SIRF EK BAAR
  // =========================
  useEffect(() => {
    fetchMyOrders(false);
  }, [fetchMyOrders]);

  // =========================
  // STATUS INDEX
  // =========================
  const getStatusIndex = (status) => {
    const statuses = [
      "Placed",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    return statuses.indexOf(status);
  };

  // =========================
  // STATUS STEPS
  // =========================
  const statusSteps = [
    {
      name: "Placed",
      icon: Package,
      text: "Order placed",
    },
    {
      name: "Confirmed",
      icon: CheckCircle,
      text: "Order confirmed",
    },
    {
      name: "Shipped",
      icon: Package,
      text: "Order shipped",
    },
    {
      name: "Out for Delivery",
      icon: Truck,
      text: "Out for delivery",
    },
    {
      name: "Delivered",
      icon: MapPin,
      text: "Order delivered",
    },
  ];

  // =========================
  // IMAGE URL
  // =========================
  const getImage = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `http://localhost:4005${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Confirmed":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // INITIAL LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="animate-spin mx-auto mb-3 text-green-600"
            size={32}
          />

          <p className="text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN CHECK
  // =========================
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <Package
            size={50}
            className="mx-auto text-gray-400 mb-4"
          />

          <h2 className="text-xl font-bold">
            Please Login
          </h2>

          <p className="text-gray-500 mt-2">
            Login karke apne orders dekho.
          </p>

          <Link
            to="/Login"
            className="inline-block mt-5 bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* =========================
          HEADER
      ========================= */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft size={22} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                My Orders
              </h1>

              <p className="text-xs text-gray-500">
                Track your orders
              </p>
            </div>

          </div>

          {/* REFRESH BUTTON */}
          <button
            onClick={() => fetchMyOrders(true)}
            disabled={refreshing}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

        </div>
      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        {/* NO ORDERS */}
        {orders.length === 0 && !error ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <Package
              size={60}
              className="mx-auto text-gray-300 mb-4"
            />

            <h2 className="text-xl font-bold">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Aapne abhi tak koi order nahi kiya hai.
            </p>

            <Link
              to="/"
              className="inline-block mt-5 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="space-y-6">

            {/* =========================
                ORDERS
            ========================= */}
            {orders.map((order) => {

              const currentIndex = getStatusIndex(
                order.orderStatus
              );

              const isCancelled =
                order.orderStatus === "Cancelled";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                >

                  {/* =========================
                      ORDER HEADER
                  ========================= */}
                  <div className="p-4 border-b">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>
                        <p className="text-xs text-gray-500">
                          Order ID
                        </p>

                        <p className="font-semibold text-gray-900 break-all">
                          #{order._id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Clock size={15} />

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </div>

                  </div>

                  {/* =========================
                      PRODUCTS
                  ========================= */}
                  <div className="p-4">

                    <h3 className="font-bold text-gray-900 mb-3">
                      Items
                    </h3>

                    <div className="space-y-3">

                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3"
                          >

                            {/* IMAGE */}
                            <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">

                              {item.image ? (
                                <img
                                  src={getImage(
                                    item.image
                                  )}
                                  alt={
                                    item.name ||
                                    "Product"
                                  }
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <Package
                                  size={25}
                                  className="text-gray-400"
                                />
                              )}

                            </div>

                            {/* DETAILS */}
                            <div className="flex-1 min-w-0">

                              <p className="font-medium text-gray-900 truncate">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                ×{" "}
                                {item.quantity}
                              </p>

                            </div>

                            {/* ITEM TOTAL */}
                            <p className="font-bold text-gray-900">
                              ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* =========================
                      TRACKING
                  ========================= */}
                  {!isCancelled ? (
                    <div className="px-4 pb-5">

                      <h3 className="font-bold text-gray-900 mb-5">
                        Order Status
                      </h3>

                      <div className="relative">

                        {statusSteps.map(
                          (step, index) => {

                            const Icon = step.icon;

                            const completed =
                              currentIndex >= index;

                            const active =
                              currentIndex === index;

                            return (
                              <div
                                key={step.name}
                                className="relative flex gap-4 pb-6 last:pb-0"
                              >

                                {/* LINE */}
                                {index <
                                  statusSteps.length - 1 && (
                                  <div
                                    className={`absolute left-[15px] top-8 w-[2px] h-full ${
                                      currentIndex > index
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                )}

                                {/* ICON */}
                                <div
                                  className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                    completed
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-200 text-gray-400"
                                  } ${
                                    active
                                      ? "ring-4 ring-green-100"
                                      : ""
                                  }`}
                                >
                                  <Icon size={16} />
                                </div>

                                {/* TEXT */}
                                <div className="pt-0.5">

                                  <p
                                    className={`font-semibold ${
                                      completed
                                        ? "text-gray-900"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step.name}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {step.text}
                                  </p>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  ) : (
                    <div className="mx-4 mb-5 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">

                      <XCircle
                        className="text-red-500"
                        size={25}
                      />

                      <div>
                        <p className="font-bold text-red-700">
                          Order Cancelled
                        </p>

                        <p className="text-sm text-red-500">
                          This order has been cancelled.
                        </p>
                      </div>

                    </div>
                  )}

                  {/* =========================
                      DELIVERY ADDRESS
                  ========================= */}
                  <div className="border-t p-4">

                    <div className="flex gap-3">

                      <MapPin
                        size={20}
                        className="text-green-600 shrink-0"
                      />

                      <div>

                        <p className="font-semibold text-gray-900">
                          Delivery Address
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {order.address}
                        </p>

                        <p className="text-sm text-gray-500">
                          PIN: {order.pin}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      PAYMENT + TOTAL
                  ========================= */}
                  <div className="border-t bg-gray-50 p-4">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-gray-500">
                        Payment
                      </span>

                      <span className="font-medium">
                        {order.paymentMethod}
                      </span>

                    </div>

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-gray-500">
                        Payment Status
                      </span>

                      <span
                        className={`font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>

                    </div>

                    <div className="flex justify-between pt-3 border-t mt-3">

                      <span className="font-bold text-gray-900">
                        Grand Total
                      </span>

                      <span className="text-xl font-bold text-green-600">
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;