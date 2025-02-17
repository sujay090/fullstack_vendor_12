import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [user, setUser] = useState(null);
  const [newVendor, setNewVendor] = useState({
    name: "",
    location: "",
    department: "",
    email: "",
    phone: "",
  });
  const [editVendor, setEditVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Unified loading state
  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get("https://fullstack-vendor-12.onrender.com/api/users/get");
      const alluser  = response.data;
      const loggedInEmail = localStorage.getItem("userEmail");
      const currentUser = alluser.find(user => user.email === loggedInEmail);
      if (currentUser) {
        setUser(currentUser); // ✅ Set only the correct user
      } else {
        setUser(null);
        console.warn("No matching user found!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }, []);

  // Fetch vendor data
  const fetchVendors = useCallback(async () => {
    try {
      const res = await axios.get("https://fullstack-vendor-12.onrender.com/api/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchVendors();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchUserData, fetchVendors]);

  // Permission Check
  const checkPermission = (action) => {
    if (!user) return false;
    if (!user?.permissions?.[action]) {
      alert(`You do not have permission to ${action} vendors.`);
      return false;
    }
    return true;
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editVendor) {
      setEditVendor((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewVendor((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Add Vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://fullstack-vendor-12.onrender.com/api/vendors", newVendor);
      setVendors((prev) => [...prev, response.data]);
      setShowModal(false);
      setNewVendor({ name: "", location: "", department: "", email: "", phone: "" });
    } catch (err) {
      console.error("Error adding vendor:", err);
    }
  };

  // Handle Update Vendor
  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://fullstack-vendor-12.onrender.com/api/vendors/${editVendor._id}`, editVendor);
      setVendors((prev) =>
        prev.map((vendor) => (vendor._id === editVendor._id ? response.data : vendor))
      );
      setEditVendor(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating vendor:", err);
    }
  };

  // Handle Delete Vendor
  const handleDeleteVendor = async (vendorId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`https://fullstack-vendor-12.onrender.com/api/vendors/${vendorId}`);
      setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
    } catch (err) {
      console.error("Error deleting vendor:", err);
    }
  };0

  // Filter Vendors
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg md:text-xl font-bold mb-6">Vendors</h1>

      <input
        type="text"
        placeholder="Search vendors by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/2 mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Add Vendor Button */}
      <button
        onClick={() => {
          // console.log(user)
          if (checkPermission("add")) {
            setEditVendor(null);
            setShowModal(true);
          }
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        <FontAwesomeIcon icon={faPlusCircle} size="lg" />
      </button>

      {/* Vendors Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200">
              {["#", "Vendor Name", "Location", "Department", "Email", "Phone", "Action"].map(
                (col) => (
                  <th key={col} className="border px-2 md:px-4 py-2">{col}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, index) => (
              <tr key={vendor._id} className="hover:bg-gray-100">
                <td className="border px-2 md:px-4 py-2">{index + 1}</td>
                <td className="border px-2 md:px-4 py-2">{vendor.name}</td>
                <td className="border px-2 md:px-4 py-2">{vendor.location}</td>
                <td className="border px-2 md:px-4 py-2">{vendor.department}</td>
                <td className="border px-2 md:px-4 py-2">{vendor.email}</td>
                <td className="border px-2 md:px-4 py-2">{vendor.phone}</td>
                <td className="border px-2 md:px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      if (checkPermission("edit")) {
                        setEditVendor(vendor);
                        setShowModal(true);
                      }
                    }}
                    className="bg-yellow-500 text-white px-2 md:px-4 py-1 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} size="lg" />
                  </button>
                  <button
                    onClick={() => {
                      if (checkPermission("delete")) {
                        handleDeleteVendor(vendor._id);
                      }
                    }}
                    className="bg-red-500 text-white px-2 md:px-4 py-1 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editVendor ? "Edit Vendor" : "Add New Vendor"}</h2>
            <form onSubmit={editVendor ? handleUpdateVendor : handleAddVendor}>
              {["name", "location", "department", "email", "phone"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={editVendor ? editVendor[field] : newVendor[field]}
                  onChange={handleInputChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
              ))}
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editVendor ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
