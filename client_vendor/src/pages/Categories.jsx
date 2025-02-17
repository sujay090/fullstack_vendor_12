import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from '../components/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "Purchased",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const uri = "https://fullstack-vendor-12.onrender.com"; // Ensure the correct URI is being used

  useEffect(() => {
    const fetchUserAndCategories = async () => {
      try {
        const loggedInEmail = localStorage.getItem("userEmail");
        if (!loggedInEmail) {
          console.error("No logged-in email found in localStorage");
          setLoading(false);
          return;
        }

        // Fetch user data based on email
        const userRes = await axios.get(`${uri}/api/users/get`);
        const currentUser = userRes.data.find((user) => user.email === loggedInEmail);
        if (currentUser) {
          setUser(currentUser);
        }else{
          setUser(null)
        }

        // Fetch categories
        const categoriesRes = await axios.get(`${uri}/api/categories`);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCategories();
  }, []);

  // Check if user has permission for a specific action
  const checkPermission = (action) => {
    if (!user?.permissions?.[action]) {
      alert(`Permission Denied: You do not have permission to ${action} categories.`);
      return false;
    }
    return true;
  };

  // Handle input changes for adding or editing category
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setEditingCategory((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!checkPermission("add")) return;
    try {
      const res = await axios.post(`${uri}/api/categories`, newCategory);

      setCategories((prev) => [...prev, res.data]);  // Update categories list
      setNewCategory({ name: "", type: "Purchased" });  // Clear input fields
      setIsAddModalOpen(false);  // Close modal
    } catch (err) {
      console.error("Error adding category: ", err);  // Log error message
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    if (!checkPermission("delete")) return;

    try {
      await axios.delete(`${uri}/api/categories/${categoryId}`);
      setCategories((prev) => prev.filter((category) => category._id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Handle editing a category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!checkPermission("edit")) return;

    try {
      await axios.put(`${uri}/api/categories/${editingCategory._id}`, editingCategory);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === editingCategory._id ? editingCategory : cat))
      );
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Open edit modal with selected category
  const openEditModal = (category) => {
    if (checkPermission("edit")) {
      setEditingCategory(category);
      setIsEditModalOpen(true);
    }
  };

  // Filter categories by search query (case insensitive)
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let timeoutId;
    
    if (successMessage || error) {
      timeoutId = setTimeout(() => {
        setSuccessMessage('');
        setError(null);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [successMessage, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="text-blue-500 hover:text-blue-700 flex items-center text-lg p-2 border border-blue-500 rounded-lg"
      >
        <FontAwesomeIcon icon={faPlusCircle} size="lg" className="mr-2" />
        Add Category
      </button>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search categories by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Categories Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {["#", "Category Name", "Category Type", "Action"].map((col) => (
              <th key={col} className="border px-4 py-2 text-center">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={category._id}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2 text-center">{category.name}</td>
              <td className="border px-4 py-2 text-center">{category.type}</td>
              <td className="border px-4 py-2 space-x-2 text-center">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <FontAwesomeIcon icon={faEdit} size="lg" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <form onSubmit={handleEditCategory}>
              <input
                type="text"
                name="name"
                value={editingCategory.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full mb-4"
                required
              />
              <select
                name="type"
                value={editingCategory.type}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full"
                required
              >
                <option value="Purchased">Purchased</option>
                <option value="Rented">Rented</option>
              </select>
              <div className="mt-4 flex space-x-2">
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                  Save Changes
                </button>
                <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full mb-4"
                required
              />
              <select
                name="type"
                value={newCategory.type}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full"
                required
              >
                <option value="Purchased">Purchased</option>
                <option value="Rented">Rented</option>
              </select>
              <div className="mt-4 flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Add Category
                </button>
                <button onClick={() => setIsAddModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Notification message={successMessage} type="success" />
      <Notification message={error} type="error" />
    </div>
  );
};

export default CategoriesPage;
