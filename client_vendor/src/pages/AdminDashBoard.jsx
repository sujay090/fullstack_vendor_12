import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom"

const AdminDashBoard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVendors: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalItemPrice: 0,
    activeUsers: 0,
  });

  const [users, setUsers] = useState([]); // Store user data

  // Fetch dashboard summary data
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

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://fullstack-vendor-12.onrender.com/api/users/get");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle permission change
  const handlePermissionChange = async (userId, permission, value) => {
    try {
      // Find the user whose permissions need to be updated
      const user = users.find((user) => user._id === userId);
      if (!user) return;
  
      // Preserve existing permissions and update the changed one
      const updatedPermissions = {
        ...user.permissions, // Keep existing permissions
        [permission]: value, // Update only the changed permission
      };
  
      // Send full permissions object to backend
      const res = await axios.put(`https://fullstack-vendor-12.onrender.com/api/users/${userId}/permissions`, {
        permissions: updatedPermissions, // Send full permissions object
      });
  
      if (res.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, permissions: updatedPermissions } : user
          )
        );
      }
    } catch (err) {
      console.error("Error updating permissions:", err);
    }
  };

  // Handle user deletion
  const handleUserDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await axios.delete(`https://fullstack-vendor-12.onrender.com/api/users/${userId}`);
        if (res.status === 200) {
          // Remove the deleted user from the state
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
          alert("User deleted successfully.");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Error deleting user.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
      <Link className="px-3 py-2 bg-green-500 rounded text-white" to={"/user-create"}>Create User</Link>
      </div>
      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Vendors</h2>
          <p className="text-2xl">{dashboardData.totalVendors}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Categories</h2>
          <p className="text-2xl">{dashboardData.totalCategories}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Products</h2>
          <p className="text-2xl">{dashboardData.totalProducts}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Total Item Price</h2>
          <p className="text-2xl">{dashboardData.totalItemPrice}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg">Active Users</h2>
          <p className="text-2xl">{dashboardData.activeUsers}</p>
        </div>
      </div>

      {/* User Management Table */}
      <div>
        <h2 className="text-lg font-bold mb-4">User Management</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">S.No.</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Name</th>
              <th className="border border-gray-200 p-2">Add</th>
              <th className="border border-gray-200 p-2">Edit</th>
              <th className="border border-gray-200 p-2">Delete</th>
              <th className="border border-gray-200 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="text-center">
                <td className="border border-gray-200 p-2">{index + 1}</td>
                <td className="border border-gray-200 p-2">{user.email}</td>
                <td className="border border-gray-200 p-2">{user.fullName}</td>
                <td className="border border-gray-200 p-2">
                  <input
                    type="checkbox"
                    checked={user.permissions?.add || false}
                    onChange={(e) => handlePermissionChange(user._id, "add", e.target.checked)}
                  />
                </td>
                <td className="border border-gray-200 p-2">
                  <input
                    type="checkbox"
                    checked={user.permissions?.edit || false}
                    onChange={(e) => handlePermissionChange(user._id, "edit", e.target.checked)}
                  />
                </td>
                <td className="border border-gray-200 p-2">
                  <input
                    type="checkbox"
                    checked={user.permissions?.delete || false}
                    onChange={(e) => handlePermissionChange(user._id, "delete", e.target.checked)}
                  />
                </td>
                <td className="border border-gray-200 p-2">
                  <button
                    className="text-red-500"
                    onClick={() => handleUserDelete(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashBoard;
