import React, { useState } from "react";

import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ChevronRight,
  Package,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "../Component/Supplier";

const Payment = () => {
  const navigate = useNavigate();

  const {
    emptyCart,
    totalPrice,
    cart,
    count,
  } = useCart();

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    last: "",
    phoneNo: "",
    address: "",
    pin: "",
    email: "",
    method: "",
    agree: false,
  });

  // =========================
  // STATES
  // =========================

  const [errors, setErrors] = useState({});
  const [showQR, setShowQR] = useState(false);
  const [paying, setPaying] = useState(false);

  // =========================
  // BILL DETAILS
  // =========================

  const itemsTotal = Number(totalPrice()) || 0;
  const handlingCharge = 150;
  const grandTotal = itemsTotal + handlingCharge;

  // =========================
  // UPI DETAILS
  // =========================

  const upiId = "ankit0087062@okaxis";
  const payeeName = "Blinkit";

  const upiUrl =
    `upi://pay?pa=${upiId}` +
    `&pn=${encodeURIComponent(payeeName)}` +
    `&am=${grandTotal}` +
    `&cu=INR`;

  // =========================
  // IMAGE HELPER
  // =========================

  const getImage = (item) => {
    if (
      typeof item?.image === "string" &&
      item.image.trim()
    ) {
      return item.image;
    }

    if (
      Array.isArray(item?.images) &&
      item.images.length > 0
    ) {
      return item.images[0];
    }

    if (
      typeof item?.images === "string" &&
      item.images.trim()
    ) {
      return item.images;
    }

    if (
      typeof item?.img === "string" &&
      item.img.trim()
    ) {
      return item.img;
    }

    if (
      typeof item?.imageUrl === "string" &&
      item.imageUrl.trim()
    ) {
      return item.imageUrl;
    }

    return "";
  };

  // =========================
  // MONGO ID CHECK
  // =========================

  const isMongoId = (value) => {
    return (
      typeof value === "string" &&
      /^[a-f\d]{24}$/i.test(value)
    );
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "First name is required";
    }

    if (!formData.last.trim()) {
      newErrors.last =
        "Last name is required";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.phoneNo
      )
    ) {
      newErrors.phoneNo =
        "Enter valid 10 digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    if (!formData.pin.trim()) {
      newErrors.pin =
        "PIN code is required";
    } else if (
      !/^\d{6}$/.test(formData.pin)
    ) {
      newErrors.pin =
        "Enter valid 6 digit PIN";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (
        !emailRegex.test(
          formData.email
        )
      ) {
        newErrors.email =
          "Enter valid email";
      }
    }

    if (!formData.method) {
      newErrors.method =
        "Please select payment method";
    }

    if (!formData.agree) {
      newErrors.agree =
        "Please accept terms and conditions";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================
  // CREATE ORDER
  // =========================

  const createOrder = async (
    paymentStatus = "Paid"
  ) => {
    try {
      setPaying(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        setPaying(false);
        navigate("/Login");
        return;
      }

      if (!cart || cart.length === 0) {
        alert("Your cart is empty.");
        setPaying(false);
        return;
      }

      // =========================
      // CART ITEMS
      // =========================

      const orderItems = cart.map(
        (item) => {
          const mongoId =
            item.productId ||
            item._id ||
            null;

          const quantity =
            Number(
              count?.[item.id] ||
              item.quantity ||
              item.count ||
              1
            );

          const price =
            Number(
              item.mrp ??
              item.price ??
              0
            );

          return {
            productId:
              isMongoId(mongoId)
                ? mongoId
                : null,

            name:
              item.name ||
              item.title ||
              "Product",

            price: price,

            quantity:
              quantity > 0
                ? quantity
                : 1,

            image:
              getImage(item),
          };
        }
      );

      console.log(
        "ORDER ITEMS:",
        orderItems
      );

      // =========================
      // ITEMS TOTAL
      // =========================

      const calculatedItemsTotal =
        orderItems.reduce(
          (sum, item) =>
            sum +
            Number(item.price) *
              Number(item.quantity),
          0
        );

      const calculatedGrandTotal =
        calculatedItemsTotal +
        handlingCharge;

      // =========================
      // BACKEND API
      // =========================

      const response =
        await axios.post(
          "https://full-stack-mern-qqdj.onrender.com/order/create",
          {
            customerName:
              `${formData.name} ${formData.last}`.trim(),

            phone:
              formData.phoneNo,

            email:
              formData.email,

            address:
              formData.address,

            pin:
              formData.pin,

            items:
              orderItems,

            itemsTotal:
              calculatedItemsTotal,

            handlingCharge:
              handlingCharge,

            totalAmount:
              calculatedGrandTotal,

            paymentMethod:
              formData.method,

            paymentStatus:
              paymentStatus,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      console.log(
        "ORDER CREATED:",
        response.data
      );

      // =========================
      // CLEAR CART
      // =========================

      emptyCart();

      // =========================
      // CLOSE QR
      // =========================

      setShowQR(false);

      setPaying(false);

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Order placed successfully!"
      );

      // =========================
      // ⭐ GO TO MY ORDERS
      // =========================

      navigate("/MyOrders");

    } catch (error) {
      console.log(
        "CREATE ORDER ERROR:",
        error.response?.data ||
          error.message ||
          error
      );

      setPaying(false);

      alert(
        error.response?.data?.message ||
          "Order create nahi hua."
      );
    }
  };

  // =========================
  // PAY BUTTON
  // =========================

  const handlePay = () => {
    if (!validate()) {
      return;
    }

    if (grandTotal <= 0) {
      alert("Your cart is empty.");
      return;
    }

    // =========================
    // UPI
    // =========================

    if (formData.method === "UPI") {
      const isMobile =
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        );

      if (isMobile) {
        setPaying(true);

        window.location.href =
          upiUrl;

        return;
      }

      // Desktop / Laptop
      setShowQR(true);

      return;
    }

    // =========================
    // COD
    // =========================

    if (
      formData.method === "COD"
    ) {
      createOrder("Pending");
      return;
    }

    // =========================
    // CARD
    // =========================

    if (
      formData.method === "CARD"
    ) {
      alert(
        "Card payment gateway is not connected yet."
      );

      return;
    }

    // =========================
    // NET BANKING
    // =========================

    if (
      formData.method ===
      "NETBANKING"
    ) {
      alert(
        "Net banking gateway is not connected yet."
      );

      return;
    }
  };

  // =========================
  // PAYMENT METHODS
  // =========================

  const paymentMethods = [
    {
      id: "UPI",
      title: "UPI",
      description:
        "Google Pay, PhonePe, Paytm & more",
      icon: (
        <Smartphone size={22} />
      ),
    },

    {
      id: "CARD",
      title:
        "Credit / Debit Card",
      description:
        "Visa, Mastercard, RuPay",
      icon: (
        <CreditCard size={22} />
      ),
    },

    {
      id: "NETBANKING",
      title: "Net Banking",
      description:
        "All major banks supported",
      icon: (
        <Banknote size={22} />
      ),
    },

    {
      id: "COD",
      title:
        "Cash on Delivery",
      description:
        "Pay when your order arrives",
      icon: (
        <Package size={22} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 mt-20 lg:mt-0 z-60 border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Checkout
              </h1>

              <p className="text-xs text-gray-500">
                Complete your order
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">

            <ShieldCheck
              size={18}
              className="text-green-600"
            />

            Secure Checkout

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-4 py-6  bg-white ">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ================= LEFT ================= */}

          <div className="space-y-5 lg:col-span-2">

            {/* ================= DELIVERY DETAILS ================= */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">

                  <MapPin
                    size={21}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <h2 className="font-bold text-gray-900">
                    Delivery Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Enter your delivery information
                  </p>

                </div>

              </div>

              {/* NAME */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}

                </div>

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last"
                    value={formData.last}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.last
                        ? "border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                  />

                  {errors.last && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.last}
                    </p>
                  )}

                </div>

              </div>

              {/* PHONE + EMAIL */}

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 digit phone number"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.phoneNo
                        ? "border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                  />

                  {errors.phoneNo && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phoneNo}
                    </p>
                  )}

                </div>

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}

                </div>

              </div>

              {/* ADDRESS */}

              <div className="mt-4">

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="House no, street, area..."
                  className={`w-full resize-none rounded-xl border px-4 py-3 outline-none ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />

                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.address}
                  </p>
                )}

              </div>

              {/* PIN */}

              <div className="mt-4">

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="6 digit PIN code"
                  className={`w-full rounded-xl border px-4 py-3 outline-none ${
                    errors.pin
                      ? "border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                />

                {errors.pin && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.pin}
                  </p>
                )}

              </div>

            </div>

            {/* ================= PAYMENT METHOD ================= */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="mb-5">

                <h2 className="font-bold text-gray-900">
                  Payment Method
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Choose how you want to pay
                </p>

              </div>

              <div className="space-y-3">

                {paymentMethods.map(
                  (method) => (

                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {

                        setFormData(
                          (prev) => ({
                            ...prev,
                            method:
                              method.id,
                          })
                        );

                        setErrors(
                          (prev) => ({
                            ...prev,
                            method: "",
                          })
                        );

                      }}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        formData.method ===
                        method.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            formData.method ===
                            method.id
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {method.icon}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {method.title}
                          </p>

                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>

                        </div>

                      </div>

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          formData.method ===
                          method.id
                            ? "border-green-600 bg-green-600"
                            : "border-gray-300"
                        }`}
                      >

                        {formData.method ===
                          method.id && (
                            <CheckCircle2
                              size={15}
                              className="text-white"
                            />
                          )}

                      </div>

                    </button>

                  )
                )}

              </div>

              {errors.method && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.method}
                </p>
              )}

              {/* TERMS */}

              <label className="mt-5 flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-green-600"
                />

                <span className="text-sm text-gray-600">
                  I agree to the terms and
                  conditions and confirm
                  that the delivery details
                  are correct.
                </span>

              </label>

              {errors.agree && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.agree}
                </p>
              )}

            </div>

          </div>

          {/* ================= BILL DETAILS ================= */}

          <div className="lg:col-span-1">

            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Bill Details
              </h2>

              <div className="space-y-4">

                {/* ITEMS TOTAL */}

                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2 text-gray-700">

                    <span>▣</span>

                    <span>
                      Items total
                    </span>

                  </div>

                  <span className="font-medium text-gray-800">
                    ₹{itemsTotal}
                  </span>

                </div>

                {/* DELIVERY */}

                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2 text-gray-700">

                    <span>▣</span>

                    <span>
                      Delivery charge
                    </span>

                    <span className="text-sm text-gray-400">
                      ⓘ
                    </span>

                  </div>

                  <div className="flex items-center gap-1">

                    <span className="text-gray-400 line-through">
                      ₹12
                    </span>

                    <span className="font-medium text-blue-600">
                      FREE
                    </span>

                  </div>

                </div>

                {/* HANDLING */}

                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2 text-gray-700">

                    <span>♟</span>

                    <span>
                      Handling charge
                    </span>

                    <span className="text-sm text-gray-400">
                      ⓘ
                    </span>

                  </div>

                  <span className="font-medium text-gray-800">
                    ₹{handlingCharge}
                  </span>

                </div>

                {/* GRAND TOTAL */}

                <div className="flex items-center justify-between border-t pt-4 text-base font-bold text-gray-900">

                  <div>
                    Grand total
                    <span className="ml-1 text-sm text-gray-500">
                      ⓘ
                    </span>
                  </div>

                  <span>
                    ₹{grandTotal}
                  </span>

                </div>

              </div>

              {/* PAY BUTTON */}

              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition ${
                  paying
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >

                {paying ? (
                  "Processing..."
                ) : (
                  <>
                    Pay ₹{grandTotal}

                    <ChevronRight
                      size={20}
                    />
                  </>
                )}

              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">

                <ShieldCheck
                  size={16}
                  className="text-green-600"
                />

                Secure payment

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ================= QR MODAL ================= */}

      {showQR && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">

          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowQR(false)
              }
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X size={20} />
            </button>

            {/* TITLE */}

            <h2 className="text-xl font-bold text-gray-900">
              Scan & Pay
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Scan this QR using Google Pay,
              PhonePe or Paytm
            </p>

            {/* QR */}

            <div className="mt-5 flex justify-center">

              <div className="rounded-2xl border bg-white p-4 shadow-sm">

                <QRCodeSVG
                  value={upiUrl}
                  size={230}
                  level="H"
                />

              </div>

            </div>

            {/* AMOUNT */}

            <div className="mt-5 rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Amount to Pay
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                ₹{grandTotal}
              </p>

            </div>

            {/* UPI ID */}

            <p className="mt-3 break-all text-xs text-gray-400">
              UPI ID: {upiId}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              Phone se QR scan karo aur UPI
              app se payment complete karo.
            </p>

            {/* I HAVE PAID */}

            <button
              type="button"
              onClick={() =>
                createOrder("Paid")
              }
              disabled={paying}
              className="mt-5 w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >

              {paying
                ? "Creating Order..."
                : "I Have Paid"}

            </button>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowQR(false)
              }
              disabled={paying}
              className="mt-3 w-full rounded-xl bg-gray-100 py-3 font-bold text-gray-800 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Payment;