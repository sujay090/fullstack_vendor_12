import React, { useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate  = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`https://fullstack-vendor-12.onrender.com/api/users/reset-password/${token}`, { password: newPassword });
      setMessage(response.data.message);
      if(response.status===200){
        navigate("/")
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-700">Reset Password</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;