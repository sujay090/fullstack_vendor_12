import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    number: '',
    age: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userEmail = localStorage.getItem('userEmail'); // Get email from local storage

    if (storedUser) {
      setUser((prevUser) => ({
        ...prevUser,
        email: userEmail || prevUser.email, // Set email from local storage if available
        ...storedUser,
      }));
    } else if (userEmail) {
      setUser((prevUser) => ({
        ...prevUser,
        email: userEmail, // Set email if only email is available
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveChanges = () => {
    // Save updated user data (name, number, age) to local storage
    const { email, ...updatedUser } = user; // Exclude email from being saved
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800">{user.name || 'N/A'}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Number:</label>
        {isEditing ? (
          <input
            type="text"
            name="number"
            value={user.number}
            onChange={handleInputChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800">{user.number || 'N/A'}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Age:</label>
        {isEditing ? (
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleInputChange}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-800">{user.age || 'N/A'}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <p className="text-gray-800">{user.email}</p>
      </div>
      <button
        onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
        className={`bg-blue-500 text-white p-2 rounded w-full transition duration-300 ${
          isEditing ? 'bg-green-500' : ''
        } hover:bg-blue-600`}
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default ProfilePage;