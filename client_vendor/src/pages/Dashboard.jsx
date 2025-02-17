// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVendors: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalItemPrice: 0,
    activeUsers: 0,
  });

  // Fetch the summary data for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("https://fullstack-vendor-12.onrender.com/api/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Vendors</h2>
          <p className="text-2xl">{dashboardData.totalVendors.toLocaleString()}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Categories</h2>
          <p className="text-2xl">{dashboardData.totalCategories.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Products</h2>
          <p className="text-2xl">{dashboardData.totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Item Price</h2>
          <p className="text-2xl">{dashboardData.totalItemPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
