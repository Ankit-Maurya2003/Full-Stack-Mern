import React, { useState } from "react";
import axios from "axios";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Login = ({ onLogin }) => {

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agree: false,
  });

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================
  // VALIDATION
  // =====================================

  const validate = () => {

    let newErrors = {};

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (!formData.agree) {
      newErrors.agree = "Please accept terms";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================
  // LOGIN
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "https://full-stack-mern-qqdj.onrender.com/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;
      const user = response.data.user;

      // =====================================
      // TOKEN CHECK
      // =====================================

      if (!token) {
        alert("Backend response me token nahi aa raha.");
        return;
      }

      // =====================================
      // ROLE CHECK
      // =====================================

      const role = user?.role;

      console.log("TOKEN:", token);
      console.log("USER:", user);
      console.log("ROLE:", role);

      // Agar sirf admin ko Dashboard access dena hai
      if (role !== "admin") {
        alert("Access denied. Only Admin can access Dashboard.");
        return;
      }

      // =====================================
      // SAVE TOKEN
      // =====================================

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      console.log(
        "ROLE SAVED:",
        localStorage.getItem("role")
      );

      alert("Admin Login Successful!");

      // =====================================
      // OPEN DASHBOARD
      // =====================================

      if (onLogin) {
        onLogin();
      }

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-3 py-4 sm:px-5 sm:py-8">

      {/* Main Card */}

      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="hidden md:flex relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-700 p-8 lg:p-10 text-white flex-col justify-between overflow-hidden min-h-[620px]">

            {/* Decorative circles */}

            <div className="absolute -top-20 -right-20 w-56 lg:w-64 h-56 lg:h-64 bg-white/10 rounded-full"></div>

            <div className="absolute -bottom-24 -left-20 w-64 lg:w-72 h-64 lg:h-72 bg-white/10 rounded-full"></div>

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-3 mb-10 lg:mb-12">

                <div className="w-11 h-11 lg:w-12 lg:h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">

                  <span className="text-2xl">
                    🛒
                  </span>

                </div>

                <div>

                  <h2 className="text-xl lg:text-2xl font-bold">
                    Blinkit
                  </h2>

                  <p className="text-green-100 text-xs">
                    Admin Dashboard
                  </p>

                </div>

              </div>

              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">

                Welcome
                <br />
                Admin!

              </h1>

              <p className="mt-5 text-green-50 text-sm lg:text-base leading-7 max-w-sm">

                Login to manage products, categories,
                orders and users from your dashboard.

              </p>

            </div>

            <div className="relative z-10">

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-5 border border-white/20">

                <div className="flex items-center gap-3">

                  <div className="bg-white/20 p-2 rounded-xl shrink-0">

                    <ShieldCheck size={24} />

                  </div>

                  <div>

                    <p className="font-semibold">
                      Secure Admin Login
                    </p>

                    <p className="text-xs text-green-100 mt-1">
                      Only authorized admins can access
                    </p>

                  </div>

                </div>

              </div>

              <p className="text-xs text-green-100 mt-5">
                © 2026 Blinkit Admin Dashboard
              </p>

            </div>

          </div>

          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <div className="p-5 xs:p-6 sm:p-8 md:p-10 lg:p-12">

            {/* Mobile Logo */}

            <div className="md:hidden flex justify-center mb-6 sm:mb-8">

              <div className="flex items-center gap-2.5 sm:gap-3">

                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md shrink-0">

                  <span className="text-xl sm:text-2xl">
                    🛒
                  </span>

                </div>

                <div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Blinkit
                  </h2>

                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Admin Dashboard
                  </p>

                </div>

              </div>

            </div>

            {/* Heading */}

            <div className="mb-6 sm:mb-8">

              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-600 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">

                <ShieldCheck size={14} />

                Admin Login

              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">

                Welcome back

              </h1>

              <p className="text-gray-500 mt-2 text-xs sm:text-sm">

                Login to access your admin dashboard

              </p>

            </div>

            {/* =====================================
                FORM
            ===================================== */}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="mb-4 sm:mb-5">

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">

                  Admin Email

                </label>

                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    error.email
                      ? "border-red-400 bg-red-50/30"
                      : "border-gray-200 bg-gray-50 focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100"
                  }`}
                >

                  <Mail
                    size={18}
                    className="absolute left-3 sm:left-4 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full min-w-0 bg-transparent outline-none pl-10 sm:pl-12 pr-3 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-800"
                    placeholder="Enter admin email"
                  />

                </div>

                {error.email && (
                  <p className="text-red-500 text-[11px] sm:text-xs mt-1.5 ml-1">
                    {error.email}
                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div className="mb-4 sm:mb-5">

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">

                  Password

                </label>

                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    error.password
                      ? "border-red-400 bg-red-50/30"
                      : "border-gray-200 bg-gray-50 focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100"
                  }`}
                >

                  <Lock
                    size={18}
                    className="absolute left-3 sm:left-4 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full min-w-0 bg-transparent outline-none pl-10 sm:pl-12 pr-11 py-3 sm:py-3.5 text-xs sm:text-sm text-gray-800"
                    placeholder="Enter admin password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 sm:right-4 text-gray-400 hover:text-green-500 transition p-1"
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

                {error.password && (
                  <p className="text-red-500 text-[11px] sm:text-xs mt-1.5 ml-1">
                    {error.password}
                  </p>
                )}

              </div>

              {/* TERMS */}

              <div className="mb-5 sm:mb-6">

                <div className="flex items-start gap-2.5 sm:gap-3">

                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-green-500 cursor-pointer shrink-0"
                  />

                  <label className="text-[11px] sm:text-xs md:text-sm text-gray-500 leading-5 cursor-pointer">

                    By continuing, I agree to the{" "}

                    <strong className="text-gray-700">
                      Admin Terms & Privacy Policy
                    </strong>

                    {" "}and confirm that I am authorized
                    to access this dashboard.

                  </label>

                </div>

                {error.agree && (
                  <p className="text-red-500 text-[11px] sm:text-xs mt-2 ml-6 sm:ml-7">
                    {error.agree}
                  </p>
                )}

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-70 text-white font-semibold rounded-xl py-3 sm:py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-green-200 transition-all duration-300 hover:-translate-y-0.5"
              >

                {loading ? (
                  <>

                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>

                    Logging in...

                  </>
                ) : (
                  <>

                    Login to Dashboard

                    <ArrowRight size={18} />

                  </>
                )}

              </button>

            </form>

            {/* Bottom text */}

            <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-5 sm:mt-7 leading-5">

              Secure admin access • Manage your store • Fast control

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;