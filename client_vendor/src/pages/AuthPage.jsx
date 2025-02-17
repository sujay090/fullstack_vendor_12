import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit login only
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const uri = "https://fullstack-vendor-12.onrender.com";
    const url = `${uri}/api/users/login`; // Only login URL

    const data = { email: formData.email, password: formData.password }; // Only login data

    try {
      const response = await axios.post(url, data);
      setLoading(false);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", response.data.user.email);
        alert("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isLogin ? ( // Only render login fields
            <>
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
            </>
          ) : (
            // Removed sign-up fields
            <></>
          )}
          <button
            type="submit"
            className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-lg hover:bg-blue-700 transition-all duration-300`}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* <div className="flex justify-center mb-6 mt-4">
          <button
            className={`w-full py-2 text-lg font-medium bg-blue-600 text-white rounded-lg transition-all duration-300`} // Only Login button
            onClick={() => setIsLogin(true)}
          >
            Login2
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AuthPage;
