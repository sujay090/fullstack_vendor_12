import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-5xl font-bold text-gray-700 mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="text-lg text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
