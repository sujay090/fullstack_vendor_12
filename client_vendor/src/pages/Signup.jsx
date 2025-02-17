import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit signup only
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const uri = "https://fullstack-vendor-12.onrender.com";
    const url = `${uri}/api/users/signup`; // Only signup URL

    const data = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    }; // Only signup data

    try {
      const response = await axios.post(url, data);
      setLoading(false);

      if (response.data.token) {
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("userEmail", response.data.user.email);
        alert("Successfully user created!");
        // navigate("/admin-dashboard");
        setFormData({
          email: "",
          password: "",
          fullName: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage("");
    setError("");

    try {
      const response = await axios.post('https://fullstack-vendor-12.onrender.com/api/users/forgot-password', {
        email: forgotPasswordEmail,
      });
      setForgotPasswordMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {forgotPasswordMessage && <p className="text-green-500 text-center mb-4">{forgotPasswordMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Render only sign-up fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-lg hover:bg-blue-700 transition-all duration-300`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Forgot Password Section */}
        {isLogin && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Forgot Password?</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email to reset password"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
