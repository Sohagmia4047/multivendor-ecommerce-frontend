import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../../hooks/useCart";
import PublicLayout from "../../components/PublicLayout";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { refreshCart } = useCart();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login/`,
        credentials,
      );

      console.log(response.data);

      toast.success("Login successful");

      // Save user data if needed
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      await refreshCart();

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        const errorMessage = Object.values(err.response.data).flat().join(" ");

        toast.error(errorMessage);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            {/* HEADING */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-green-600 text-xl" />

                <h2 className="text-3xl font-bold text-gray-800">User Login</h2>
              </div>

              <p className="text-sm text-gray-500">
                Login to continue shopping
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#29b07d] hover:bg-[#23986c] text-white rounded-xl font-medium text-sm transition duration-300 disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER */}
            <p className="text-sm text-gray-600 mt-5 text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center justify-center bg-[#f8fafc] p-8">
            <img
              src="https://www.pngall.com/wp-content/uploads/15/Login-PNG-HD-Image.png"
              alt="Login"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </PublicLayout>
  );
};

export default Login;
