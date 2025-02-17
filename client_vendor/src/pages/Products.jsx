import { useEffect, useState } from "react";
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
  const [user,setUser]=useState(null)
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [category,setCategory]=useState([]) // Track editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vendor: '',
    category: '',
    quantity: '',
    price: '',
    serialBox: '',
    purchaseDate: '',
    warrantyPeriod: '',
    expiryDate: ''
  });
  const [selectedSerialBox, setSelectedSerialBox] = useState(null); // Track selected serial box
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [vendors, setVendors] = useState([]); // State to hold vendor options
  const [vendorInputType, setVendorInputType] = useState('select'); // Track input type for vendor

  // formate date
const formatDate=(date)=>{
    const newDate = new Date(date)
    return newDate.toLocaleDateString()
}

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fullstack-vendor-12.onrender.com/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }

      const loggedInEmail = localStorage.getItem("userEmail");
      if (!loggedInEmail) {
        console.error("No logged-in email found in localStorage");
        return;
      }

      try {
        const userRes = await axios.get(`https://fullstack-vendor-12.onrender.com/api/users/get`);
        const currentUser = userRes.data.find((user) => user.email === loggedInEmail);
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchProducts();
  }, []);

  // Add useEffect for fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fullstack-vendor-12.onrender.com/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategory(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch vendors from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://fullstack-vendor-12.onrender.com/api/vendors'); // Adjust the URL as needed
        setVendors(response.data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };

    fetchVendors();
  }, []);

// permision check
const checkPermission = (action) => {
  if (!user?.permissions?.[action]) {
    alert(`Permission Denied: You do not have permission to ${action}categories.`);
    return false;
  }
  return true;
};

  // new product add 

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: value,
      };

      // Calculate expiryDate if both purchaseDate and warrantyPeriod are provided
      if (name === 'purchaseDate' || name === 'warrantyPeriod') {
        const { purchaseDate, warrantyPeriod } = updatedFormData;
        if (purchaseDate && warrantyPeriod) {
          updatedFormData.expiryDate = calculateExpiryDate(purchaseDate, warrantyPeriod);
        }
      }
      
      return updatedFormData;
    });
  };

  const calculateExpiryDate = (purchaseDate, warranty) => {
    if (!purchaseDate || !warranty) return '';
    const purchase = new Date(purchaseDate);
    purchase.setMonth(purchase.getMonth() + parseInt(warranty));
    return purchase.toISOString().split('T')[0]; // This will return YYYY-MM-DD format
  };

  const handleAddProduct = () => {
    if (!checkPermission('add')) {
        alert('You do not have permission to add products.'); // Alert user if no permission
        return; // Exit if the user does not have permission
    }
    setEditingProduct(null);
    setShowModal(true); // Open the modal to add a new product
  };

  const handleEditProduct = (product) => {
    if (!checkPermission('edit')) return;
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!checkPermission('delete')) return;
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await axios.delete(`https://fullstack-vendor-12.onrender.com/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Basic validation
        if (!formData.name || !formData.name.trim()) {
            alert('Product name is required');
            return;
        }

        // Update validation to check for vendor input
        const vendorInput = formData.vendorInput || ''; // Default to empty string if undefined
        const vendor = formData.vendor || ''; // Default to empty string if undefined

        if (!vendor.trim() && !vendorInput.trim()) {
            alert('Vendor is required');
            return;
        }

        // Use vendorInput if vendor is not selected
        const vendorToSubmit = vendorInput.trim() ? vendorInput : vendor;

        if (parseInt(formData.quantity) < 0) {
            alert('Quantity cannot be negative');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            alert('Price must be greater than 0');
            return;
        }

        // Prepare formData for submission
        const dataToSubmit = {
            ...formData,
            vendor: vendorToSubmit, // Use the selected or input vendor
        };

        console.log('Submitting data:', dataToSubmit); // Debugging statement

        // No need to transform data, just send formData directly
        const response = editingProduct
            ? await axios.put(`https://fullstack-vendor-12.onrender.com/api/products/${editingProduct._id}`, dataToSubmit)
            : await axios.post('https://fullstack-vendor-12.onrender.com/api/products', dataToSubmit);

        if (editingProduct) {
            setProducts(products.map((p) => 
                p._id === response.data._id ? response.data : p
            ));
        } else {
            setProducts([...products, response.data]);
        }
        
        setShowModal(false);
        resetForm(); // Reset form after submission
    } catch (err) {
        console.error('Error:', err); // Log the error for debugging
        alert(err.response?.data?.message || 'Error saving product'); // Provide specific error message
    } finally {
        setIsLoading(false);
    }
};

  // Add this new function to handle barcode scanning
  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      const newSerial = e.target.value.trim();
      if (newSerial) {
        // Here's where the separation happens
        setFormData(prev => ({
          ...prev,
          serialBox: prev.serialBox 
            ? `${prev.serialBox},${newSerial}`  // Adds comma between values
            : newSerial
        }));
        e.target.value = '';
      }
    }
  };

  // Add function to format serial numbers for display
  const formatSerialNumbers = (serialBox) => {
    if (!serialBox) return '';
    const serials = serialBox.split(',');
    if (serials.length <= 2) return serialBox;
    return `${serials[0]}, ${serials[1]}... +${serials.length - 2} more`;
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      vendor: '',
      category: '',
      quantity: '',
      price: '',
      serialBox: '',
      purchaseDate: '',
      warrantyPeriod: '',
      expiryDate: ''
    });
    setError(null);
    setSuccessMessage('');
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the other input based on the selected input type
    if (name === 'vendor') {
      setFormData((prevState) => ({
        ...prevState,
        vendorInput: '', // Clear vendor input if vendor is selected
      }));
    } else if (name === 'vendorInput') {
      setFormData((prevState) => ({
        ...prevState,
        vendor: '', // Clear vendor select if vendor input is used
      }));
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <button
        onClick={() => {
            if (!checkPermission('add')) {
                 // Alert user if no permission
                return; // Exit if the user does not have permission
            }
            setEditingProduct(null);
            setShowModal(true); // Open the modal to add a new product
        }}
        className="text-blue-500 hover:text-blue-700 flex items-center text-lg p-2 border border-blue-500 rounded-lg"
      >
        <FontAwesomeIcon icon={faPlusCircle} size="lg" className="mr-2" />
        Add Product
      </button>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-4"
        />

        {/* Modal with improved responsiveness */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start z-50">
            <div className="relative bg-white rounded-lg shadow-xl m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Vendor</label>
                      <select
                        name="vendor"
                        value={formData.vendor}
                        onChange={handleVendorChange}
                        className="w-full border p-2 rounded mb-2"
                      >
                        <option value="">Select a vendor</option>
                        {vendors.map((vendor) => (
                          <option key={vendor._id} value={vendor.name}>
                            {vendor.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="vendorInput"
                        value={formData.vendorInput || ''}
                        onChange={handleVendorChange}
                        placeholder="Or enter a new vendor name"
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select a category</option>
                        {category.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full border p-2 rounded"
                          placeholder="Enter quantity"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full border p-2 rounded"
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Serial Numbers</label>
                      <textarea
                        name="serialBox"
                        value={formData.serialBox}
                        onChange={handleInputChange}
                        onKeyDown={handleBarcodeInput}
                        className="w-full border p-2 rounded h-24"
                        placeholder="Scan or enter serial numbers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Purchase Date</label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Warranty Period (Months)</label>
                      <input
                        type="number"
                        name="warrantyPeriod"
                        value={formData.warrantyPeriod}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full border p-2 rounded"
                        placeholder="Enter warranty period"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        disabled
                        className="w-full border p-2 rounded bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Form Buttons - Full Width */}
                  <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {editingProduct ? 'Update' : 'Add'} Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Responsive Table */}
        <div className="mt-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Numbers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warranty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.price * product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-[200px]">
                        <div className="flex items-center">
                          <span className="truncate">{formatSerialNumbers(product.serialBox)}</span>
                          {product.serialBox && product.serialBox.includes(',') && (
                            <button
                              onClick={() => setSelectedSerialBox(product.serialBox)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <FontAwesomeIcon icon={faEye} size="lg" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(product.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.warrantyPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(product.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FontAwesomeIcon icon={faEdit} size="lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-500 hover:text-red-700 ml-2"
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
        </div>

        {/* Modal to View Full Serial Numbers */}
        {selectedSerialBox && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-screen-md w-11/12">
              <h3 className="text-lg font-semibold mb-4">Serial Numbers</h3>
              <div className="overflow-y-auto max-h-64">
                {selectedSerialBox.split(',').map((serial, index) => (
                  <p key={index} className="p-1">
                    {index + 1}. {serial}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setSelectedSerialBox(null)}
                className="bg-gray-500 text-white p-2 rounded mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

      </div>
    </>
  );    
};

export default Products;
