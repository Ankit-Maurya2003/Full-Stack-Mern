import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./Supplier";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    cart,
    totalCount,
    item,
    logout,
    token,
    search,
    addToCart,
    showLogoutModal,
    setShowLogoutModal,
    setSearch,
    setVisible,
    count,
    totalPrice,
    visible,
    setName,
    name,
    setMyCart,
    myCart,
    increase,
    decrease,
  } = useCart();

  const handlingCharge = 10;
  const grandTotal = Number(totalPrice()) + handlingCharge;

  const [error, setError] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    agree: false,
  });

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    let newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.tel.trim() === "") {
      newErrors.tel = "Number is required";
    }

    if (!formData.agree) {
      newErrors.agree = "Please accept terms";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // LOGIN POPUP SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log(formData);

      setFormData({
        name: "",
        tel: "",
        agree: false,
      });

      setVisible(false);
      setShowLogoutModal(false);
      setName(formData.name);
    }
  };

  return (
    <>
      {/* =====================================================
          MOBILE LOGIN / SIGNUP POPUP
      ====================================================== */}

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[500] flex h-auto items-end justify-center bg-black/50 md:hidden"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-auto max-w-xl bg-white p-5">
              <form onSubmit={handleSubmit} className="mx-10 mt-10">
                <h1>
                  <strong className="md:text-3xl">
                    Login
                  </strong>{" "}
                  Or{" "}
                  <strong className="md:text-3xl">
                    Signup
                  </strong>
                </h1>

                {/* NAME */}
                <div className="relative mt-5 md:mt-10">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    id="floating1"
                    className="peer w-full px-1.5 pb-1 pt-4 text-sm outline focus:outline-blue-400"
                    placeholder=""
                  />

                  <label
                    htmlFor="floating1"
                    className="absolute left-3 top-2 bg-white px-2 text-body duration-300 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5.5 peer-focus:px-2 peer-focus:text-blue-500"
                  >
                    Name
                  </label>

                  <p className="flex justify-start text-red-500">
                    {error.name}
                  </p>
                </div>

                {/* PHONE */}
                <div className="mt-5 border p-0.5 md:mt-7 md:p-2">
                  <label className="border-r pr-3">
                    +91
                  </label>

                  <input
                    type="tel"
                    className="pl-3 outline-none"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                  />
                </div>

                <p className="flex justify-start text-red-500">
                  {error.tel}
                </p>

                {/* TERMS */}
                <div className="mt-8 grid grid-cols-2">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="peer mt-1 h-3 w-3"
                  />

                  <label className="-mt-5 col-span-2 mx-5 text-sm md:mx-7 md:h-10">
                    <strong>By Continuing</strong>, I agree
                    to the{" "}
                    <strong>
                      Terms Use & Privacy Policy
                    </strong>{" "}
                    and I am above 18 years old.
                  </label>

                  <p className="col-span-2 mt-2 flex justify-start text-red-500">
                    {error.agree}
                  </p>

                  <button
                    type="submit"
                    className="col-span-2 mt-7 w-full bg-gray-500 p-1 text-2xl text-white peer-checked:bg-green-400"
                  >
                    Continue
                  </button>
                </div>

                <p className="mt-5">
                  Have trouble logging in?{" "}
                  <strong>Get help</strong>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MY CART SIDEBAR
      ====================================================== */}

      {myCart && (
        <div
          onClick={() => setMyCart(false)}
          className="fixed inset-0 z-[300] h-auto bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 z-50 h-screen w-full overflow-y-auto bg-white shadow-lg sm:w-90"
          >
            <div className="rounded-2xl bg-white">

              {/* CART HEADER */}
              <div className="flex items-center justify-between gap-4 bg-blue-200 p-2">
                <button
                  onClick={() => setMyCart(false)}
                  className="flex items-center text-4xl text-gray-800"
                >
                  <span>←</span>

                  <h2 className="mt-1 text-sm font-bold text-gray-900">
                    My Cart
                  </h2>
                </button>

                <button className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <span className="text-lg">🛒</span>
                  Share
                </button>
              </div>

              {/* CART ITEMS */}
              <div className="flex-1 bg-white px-3 py-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-1 py-3.5"
                  >
                    {/* IMAGE */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1 self-start pt-0.5">
                      <p className="line-clamp-2 text-sm font-medium text-gray-800">
                        {item.title || item.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.weight}
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        ₹{item.mrp}
                      </p>
                    </div>

                    {/* QUANTITY */}
                    {!count[item.id] ? (
                      <button
                        onClick={() => {
                          increase(item.id);
                          addToCart(item);
                        }}
                        className="rounded-lg border border-green-400 bg-green-50 px-4 py-2 text-green-600"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex h-10 w-20 items-center justify-around rounded-xl border border-green-400 bg-green-300 text-green-800">
                        <div
                          onClick={() => decrease(item.id)}
                          className="cursor-pointer text-xl"
                        >
                          -
                        </div>

                        <div className="text-xl">
                          {count[item.id] || 0}
                        </div>

                        <div
                          onClick={() => increase(item.id)}
                          className="cursor-pointer text-xl"
                        >
                          +
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CART BILL */}
              {cart.length <= 0 ? (
                <div className="flex h-full w-full items-center justify-center bg-white text-md font-bold">
                  No Item Select
                </div>
              ) : (
                <div>
                  <div className="mt-4 rounded-2xl bg-white px-3 py-3">
                    <h3 className="mb-4 text-sm font-bold text-gray-900">
                      Bill details
                    </h3>

                    <div className="space-y-3">

                      {/* ITEMS */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>▣</span>
                          <span>Items total</span>
                        </div>

                        <span className="text-gray-800">
                          ₹{totalPrice()}
                        </span>
                      </div>

                      {/* DELIVERY */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>▣</span>
                          <span>Delivery charge</span>
                          <span className="text-gray-400">
                            ⓘ
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">
                            ₹12
                          </span>

                          <span className="text-blue-600">
                            FREE
                          </span>
                        </div>
                      </div>

                      {/* HANDLING */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>♟</span>
                          <span>Handling charge</span>
                          <span className="text-gray-400">
                            ⓘ
                          </span>
                        </div>

                        <span className="text-gray-800">
                          ₹{handlingCharge}
                        </span>
                      </div>

                      {/* GRAND TOTAL */}
                      <div className="flex items-center justify-between pt-1 text-sm font-bold text-gray-900">
                        <div>
                          Grand total
                          <span className="ml-1 text-gray-500">
                            ⓘ
                          </span>
                        </div>

                        <span>
                          ₹{grandTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CANCELLATION */}
                  <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">
                      Cancellation Policy
                    </h3>

                    <p className="text-sm text-gray-500">
                      Orders cannot be cancelled once packed
                      for delivery. In case of unexpected delays,
                      a refund will be provided, if applicable.
                    </p>
                  </div>

                  <div className="h-24" />

                  {/* PAY FOOTER */}
                  <div className="fixed bottom-0 flex h-20 w-full items-center justify-between bg-green-700 p-10 text-lg text-white sm:w-90">
                    <div>
                      <p>₹{grandTotal}</p>
                      <span>TOTAL</span>
                    </div>

                    {name ? (
                      <Link
                        to="/Pay"
                        onClick={() => setMyCart(false)}
                      >
                        <div>Pay</div>
                      </Link>
                    ) : (
                      <div
                        onClick={() => {
                          setVisible(true);
                          setMyCart(false);
                        }}
                        className="cursor-pointer text-lg"
                      >
                        Login To Proceed
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DESKTOP NAVBAR
      ====================================================== */}

      <div className="relative">

        <div className="fixed top-0 z-50 hidden w-full lg:block">

          <div className="flex h-20 w-full items-center justify-between border-b bg-white px-6">

            {/* LOGO + LOCATION */}
            <div className="flex items-center">

              <div className="border-r pr-8">
                <h1 className="text-5xl font-extrabold">
                  <Link to="/">
                    <span className="text-yellow-400">
                      blink
                    </span>

                    <span className="text-green-600">
                      it
                    </span>
                  </Link>
                </h1>
              </div>

              <div className="pl-8">
                <h2 className="text-xs font-bold">
                  Delivery in 22 minutes
                </h2>

                <p className="flex items-center gap-1 text-xs text-gray-700">
                  D329, Ghazipur, Sector 51, Faridabad

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="mx-10 max-w-3xl flex-1">
              <div className="flex items-center rounded-xl bg-gray-100 px-4 py-3">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  />
                </svg>

                <Link to="/FindCart" className="w-full">
                  <input
                    type="text"
                    placeholder='Search "chocolate"'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-3 w-full truncate bg-transparent text-lg outline-none placeholder-gray-500"
                  />
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

              {/* USER */}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-gray-400 px-3 py-2 text-2xl font-medium text-white"
                >
                  {name}
                </button>
              ) : (
                <Link to="/Login">
                  <button className="text-2xl font-medium">
                    Login
                  </button>
                </Link>
              )}

              {/* MY ORDERS */}
              {token && (
                <button
                  onClick={() => navigate("/MyOrders")}
                  className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                >
                  My Orders
                </button>
              )}

              {/* CART */}
              {totalCount() > 0 ? (
                <button
                  onClick={() => setMyCart(true)}
                  className="flex items-center gap-2 rounded-xl bg-green-800 px-4 py-1 font-semibold text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h14M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 000-2 1 1 0 000 2z"
                    />
                  </svg>

                  <div>
                    <p>{totalCount()} items</p>
                    <span>₹{totalPrice()}</span>
                  </div>
                </button>
              ) : (
                <button className="flex items-center gap-2 rounded-xl bg-gray-300 px-6 py-3 font-semibold text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h14M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 0 000-2 1 1 0 000 2z"
                    />
                  </svg>

                  My Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            PREMIUM MOBILE NAVBAR
        ====================================================== */}

        <div className="fixed top-0 z-50 w-full bg-white lg:hidden">

          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3">

            {/* LOCATION */}
            <div className="min-w-0 flex-1">

              <p className="text-xs font-medium text-gray-500">
                Delivery in
              </p>

              <div className="flex items-center gap-1">
                <h2 className="text-lg font-bold text-gray-900">
                  22 minutes
                </h2>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <p className="truncate text-xs text-gray-500">
                D329, Ghazipur, Sector 51, Faridabad
              </p>

            </div>

            {/* RIGHT SIDE */}
            <div className="ml-3 flex items-center gap-2">

              {/* PROFILE */}
              <button
                onClick={() => setMobileMenu(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50"
              >
                {name ? (
                  <span className="text-sm font-bold text-gray-700">
                    {name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </button>

              {/* CART */}
              <button
                onClick={() => {
                  if (totalCount() > 0) {
                    setMyCart(true);
                  }
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h14M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 000-2 1 1 0 000 2z"
                  />
                </svg>

                {totalCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {totalCount()}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* SEARCH */}
          <div className="px-4 pb-3">

            <Link to="/FindCart">

              <div className="flex items-center rounded-xl bg-gray-100 px-4 py-3">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  />
                </svg>

              
              
                  <input
                    type="text"
                    placeholder='Search "chocolate"'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-3 w-full truncate bg-transparent text-lg outline-none placeholder-gray-500"
                  />
         
              </div>

            </Link>

          </div>

          {/* =====================================================
              PROFILE BOTTOM SHEET
          ====================================================== */}

          {mobileMenu && (

            <div
              className="fixed inset-0 z-[200] bg-black/40"
              onClick={() => setMobileMenu(false)}
            >

              <div
                className="absolute bottom-0 w-full rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >

                {/* HANDLE */}
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

                {/* USER */}
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                    {name
                      ? name.charAt(0).toUpperCase()
                      : "G"}
                  </div>

                  <div className="flex-1">

                    {name ? (
                      <>
                        <p className="font-bold text-gray-900">
                          {name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Welcome back 👋
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-gray-900">
                          Welcome to Blinkit
                        </p>

                        <p className="text-xs text-gray-500">
                          Login to continue
                        </p>
                      </>
                    )}

                  </div>

                  <button
                    onClick={() => setMobileMenu(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600"
                  >
                    ✕
                  </button>

                </div>

                {/* LOGIN */}
                {!token && (
                  <Link
                    to="/Login"
                    onClick={() => setMobileMenu(false)}
                  >

                    <div className="flex items-center gap-4 border-b py-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        👤
                      </div>

                      <div className="flex-1">

                        <p className="font-semibold text-gray-800">
                          Login / Signup
                        </p>

                        <p className="text-xs text-gray-500">
                          Login to manage your account
                        </p>

                      </div>

                      <span className="text-xl text-gray-400">
                        ›
                      </span>

                    </div>

                  </Link>
                )}

                {/* MY ORDERS */}
                {token && (
                  <button
                    onClick={() => {
                      navigate("/MyOrders");
                      setMobileMenu(false);
                    }}
                    className="flex w-full items-center gap-4 border-b py-4 text-left"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      📦
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-gray-800">
                        My Orders
                      </p>

                      <p className="text-xs text-gray-500">
                        View your previous orders
                      </p>

                    </div>

                    <span className="text-xl text-gray-400">
                      ›
                    </span>

                  </button>
                )}

                {/* CART */}
                <button
                  onClick={() => {
                    setMyCart(true);
                    setMobileMenu(false);
                  }}
                  className="flex w-full items-center gap-4 border-b py-4 text-left"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    🛒
                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-gray-800">
                      My Cart
                    </p>

                    <p className="text-xs text-gray-500">
                      {totalCount() > 0
                        ? `${totalCount()} items • ₹${totalPrice()}`
                        : "Your cart is empty"}
                    </p>

                  </div>

                  <span className="text-xl text-gray-400">
                    ›
                  </span>

                </button>

                {/* LOGOUT */}
                {token && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenu(false);
                    }}
                    className="mt-2 flex w-full items-center gap-4 py-4 text-left"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                      🚪
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-red-600">
                        Logout
                      </p>

                      <p className="text-xs text-gray-500">
                        Sign out from this account
                      </p>

                    </div>

                  </button>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default Navbar;