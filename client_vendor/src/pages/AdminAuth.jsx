import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate=useNavigate()
  const uri = `https://fullstack-vendor-12.onrender.com`
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? `${uri}/api/admin-auth/login` : `${uri}/api/admin-auth/signup`;
      const response = await axios.post(endpoint, formData);

      if (response.data) {
        alert(
          isLogin
            ? "Login successful! Welcome back."
            : "Signup successful! You can now log in."
        );
        setFormData({ name: "", email: "", password: "" });
        navigate("/admin-dashboard")
        if (!isLogin) setIsLogin(true); // Switch to login after signup
      }
    } catch (err) {
        console.log(err.message)
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Admin Login" : "Admin Signup"}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isLogin ? "Signup" : "Login"} here
          </button>
        </p>
      </div>
    </div>
  );
}

export default AdminAuth;
