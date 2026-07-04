import React, { useState } from "react";
import axios from "axios";
import PublicLayout from "../../components/PublicLayout";
import {
  FaFacebookF,
  FaGoogle,
  FaApple,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      return "Please fill all required fields";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (formData.password !== formData.password2) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/user/register/",
        formData
      );

      setSuccess("Registration successful!");

      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
      });
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = Object.values(err.response.data)
          .flat()
          .join(" ");

        setError(backendErrors);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-2">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl font-bold text-[#1e293b] mb-1">
            Create an Account
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-600 text-sm px-3 py-2 rounded-xl mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            
            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-13 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-13 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-13 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-13 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm password"
                value={formData.password2}
                onChange={handleChange}
                className="w-full h-13 px-4 rounded-xl border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              >
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-55 h-12 rounded-xl bg-[#29b07d] hover:bg-[#23986c] text-white font-medium text-sm transition duration-300 shadow"
            >
              {loading ? "Registering..." : "Submit & Register"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="space-y-4">
            
            {/* Facebook */}
            <button className="w-full h-13 rounded-xl bg-[#1877F2] hover:bg-[#1669d8] text-white font-medium text-sm flex items-center justify-center gap-2 transition">
              <FaFacebookF />
              Continue with Facebook
            </button>

            {/* Google */}
            <button className="w-full h-13 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center justify-center gap-2 transition">
              <FaGoogle />
              Continue with Google
            </button>

            {/* Apple */}
            <button className="w-full h-13 rounded-xl bg-black hover:bg-gray-900 text-white font-medium text-sm flex items-center justify-center gap-2 transition">
              <FaApple />
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-gray-500 text-sm text-center leading-6">
            Create your account securely using
            <br />
            email and password.
          </p>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
};

export default SignUp;