import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Categories from "./pages/Categories";
import Products from "./pages/Products.jsx";
import Navbar from "./pages/Navbar";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Signup from "./pages/Signup.jsx";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

// Separate component to handle routes and conditional Navbar
const AppRoutes = () => {
  const location = useLocation();

  // Define routes where Navbar should not appear
  const noNavbarRoutes = ["/admin","/admin-dashboard",'/',"/reset-password/:token"];

  return (
    <div className="App">
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/user-create" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashBoard />} />
        <Route path="/reset-password/:token/:id" element={<ResetPassword/>} /> {/* Add this route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;

