
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  LogIn,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error while typing
    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.agree) {
      newErrors.agree = "Please accept terms";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation fail hone par API call nahi hogi
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4005/users/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log(response.data);

      alert("Signup successful");

      // Form reset
      setFormData({
        name: "",
        email: "",
        password: "",
        agree: false,
      });

      // Login page
      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        <div className="grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden md:flex relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-700 p-10 text-white flex-col justify-between overflow-hidden">

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>

            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>

            <div className="relative z-10">

              {/* Logo */}
              <div className="flex items-center gap-3 mb-12">

                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🛒</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Blinkit
                  </h2>

                  <p className="text-green-100 text-xs">
                    Groceries delivered fast
                  </p>
                </div>

              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Create
                <br />
                Your Account
              </h1>

              <p className="mt-5 text-green-50 text-base leading-7 max-w-sm">
                Join Blinkit and enjoy fast delivery of groceries,
                fresh products and everyday essentials.
              </p>

            </div>

            {/* Features */}
            <div className="relative z-10 space-y-3">

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-xl">⚡</span>
                <span className="text-sm">
                  Lightning fast delivery
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-xl">🥬</span>
                <span className="text-sm">
                  Fresh groceries everyday
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-xl">🔒</span>
                <span className="text-sm">
                  Safe & secure account
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 sm:p-10 md:p-12">

            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🛒</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Blinkit
                  </h2>

                  <p className="text-xs text-gray-500">
                    Groceries delivered fast
                  </p>
                </div>

              </div>

            </div>

            {/* Heading */}
            <div className="mb-7">

              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <ShieldCheck size={15} />
                Create Account
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Get started
              </h1>

              <p className="text-gray-500 mt-2 text-sm">
                Create your account to start shopping
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="mb-4">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    error.name
                      ? "border-red-400 bg-red-50/30"
                      : "border-gray-200 bg-gray-50 focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100"
                  }`}
                >

                  <User
                    size={20}
                    className="absolute left-4 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none px-12 py-3.5 text-sm text-gray-800"
                    placeholder="Enter your full name"
                  />

                </div>

                {error.name && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">
                    {error.name}
                  </p>
                )}

              </div>

              {/* Email */}
              <div className="mb-4">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    error.email
                      ? "border-red-400 bg-red-50/30"
                      : "border-gray-200 bg-gray-50 focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100"
                  }`}
                >

                  <Mail
                    size={20}
                    className="absolute left-4 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none px-12 py-3.5 text-sm text-gray-800"
                    placeholder="Enter your email"
                  />

                </div>

                {error.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">
                    {error.email}
                  </p>
                )}

              </div>

              {/* Password */}
              <div className="mb-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    size={20}
                    className="absolute left-4 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none px-12 pr-12 py-3.5 text-sm text-gray-800"
                    placeholder="Create a password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 text-gray-400 hover:text-green-500 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                {error.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">
                    {error.password}
                  </p>
                )}

              </div>

              {/* Terms */}
              <div className="mb-6">

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 accent-green-500 cursor-pointer"
                  />

                  <label className="text-xs sm:text-sm text-gray-500 leading-5 cursor-pointer">
                    By continuing, I agree to the{" "}
                    <strong className="text-gray-700">
                      Terms of Use & Privacy Policy
                    </strong>{" "}
                    and I am above 18 years old.
                  </label>

                </div>

                {error.agree && (
                  <p className="text-red-500 text-xs mt-2 ml-7">
                    {error.agree}
                  </p>
                )}

              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-70 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all duration-300 hover:-translate-y-0.5"
              >

                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>

            {/* Login Divider */}
            <div className="relative my-6">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400">
                  Already registered?
                </span>
              </div>

            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="w-full border border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm transition"
            >
              <LogIn size={18} />
              Login to Your Account
            </Link>

            {/* Bottom */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
              <ShieldCheck size={14} />
              Your information is safe and secure
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
