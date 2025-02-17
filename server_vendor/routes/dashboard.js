// routes/dashboard.js
const express = require("express");
const Vendor = require("../models/Vendor");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router();

// Dashboard summary route
router.get("/", async (req, res) => {
  try {
    // Get the number of vendors
    const totalVendors = await Vendor.countDocuments();
    // Get the number of categories
    const totalCategories = await Category.countDocuments();
    // Get the number of products
    const totalProducts = await Product.countDocuments();

    // Get total price of all products
    const totalItemPrice = await Product.aggregate([
      {
        $match: { 
          price: { $exists: true, $ne: null },
          quantity: { $exists: true, $ne: null }
        }
      },
      {
        $addFields: {
          numericPrice: { $toDouble: "$price" },
          numericQuantity: { $toDouble: "$quantity" }
        }
      },
      {
        $match: {
          numericPrice: { $gt: 0 },
          numericQuantity: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$numericPrice", "$numericQuantity"] } }
        }
      }
    ]);
    
    const finalTotal = totalItemPrice.length > 0 ? totalItemPrice[0].total : 0;

    // Get the number of active users
    const activeUsers = await User.countDocuments();

    res.json({
      totalVendors,
      totalCategories,
      totalProducts,
      totalItemPrice: finalTotal,
      activeUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

module.exports = router;
