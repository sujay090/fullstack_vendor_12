import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false); // Check token in localStorage
  const [showDropdown, setShowDropdown] = useState(false); // Controls user menu visibility
  const [menuOpen, setMenuOpen] = useState(false); // Controls mobile menu visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    // Delete token from localStorage or cookies
    localStorage.removeItem("token"); // or document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    setIsLoggedIn(false);
    setShowDropdown(false);
    alert("Logged out successfully");

    // Redirect to login page
    navigate("/");
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold">
          Vendor<span className="text-yellow-300">Manager</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-yellow-300 transition">
            Dashboard
          </Link>
          <Link to="/vendors" className="hover:text-yellow-300 transition">
            Vendors
          </Link>
          <Link to="/categories" className="hover:text-yellow-300 transition">
            Categories
          </Link>
          <Link to="/products" className="hover:text-yellow-300 transition">
            Products
          </Link>

          {/* Login or User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <img
                  src="https://media.gettyimages.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=gi&k=20&c=tC514mTG014_uspJnEeJeKrQDiBY2N9GFYKPqwmtBuo="
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-300 text-blue-800 px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-4 py-3 space-y-2">
          <Link
            to="/dashboard"
            className="block hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/vendors"
            className="block hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Vendors
          </Link>
          <Link
            to="/categories"
            className="block hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/products"
            className="block hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>

          {/* Login or User Menu in Mobile */}
          {isLoggedIn ? (
            <>
              <button
                onClick={handleProfile}
                className="block w-full text-left hover:text-yellow-300"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:text-yellow-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-yellow-300 text-blue-800 px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
