const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const router = express.Router();
// User Signup
router.post("/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ fullName, email, password });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }
    // console.log(error.message)
    res.status(500).json({ message: "Error creating user." });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//get user 
router.get("/get", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
// set permison 
router.put("/:id/permissions", async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    // console.log("Received permissions:", permissions);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { permissions } }, // Replace only permissions field
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("Updated User:", updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating permissions:", err);
    res.status(500).json({ message: "Error updating permissions" });
  }
});


// User Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user." });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });
    // Generate a password reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Send email with reset link including user ID and token
    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`; // Include user ID
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error sending reset link:", error);
    res.status(500).json({ message: "Error sending reset link." });
  }
});

// Reset Password Route
router.post('/reset-password/:userId', async (req, res) => {
  const { password } = req.body;
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's password
    user.password = password; // Make sure to hash the password before saving
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
});

module.exports = router;
