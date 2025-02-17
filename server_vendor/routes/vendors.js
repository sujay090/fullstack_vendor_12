// routes/vendors.js
const express = require("express");
const Vendor = require("../models/Vendor");
const router = express.Router();

// Add a new vendor
router.post("/", async (req, res) => {
  try {
    const { name, location, department, email, phone } = req.body;
    // console.log(req.body)
    const newVendor = new Vendor({ name, location, department, email, phone });
    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (err) {
    res.status(500).json({ message: "Error adding vendor" });
  }
});

// Get all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendors" });
  }
});

// Edit a vendor by ID
router.put("/:vendorId", async (req, res) => {
  try {
    const { name, location, department, email, phone } = req.body;
    // console.log(req.body)
    // Find the vendor by ID and update their details
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.vendorId,
      { name, location, department, email, phone },
      { new: true } // Return the updated document
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(updatedVendor);
  } catch (err) {
    res.status(500).json({ message: "Error updating vendor" });
  }
});

// Delete a vendor by ID
router.delete("/:vendorId", async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.vendorId);
    res.status(200).send("Vendor deleted successfully");
  } catch (err) {
    res.status(500).json({ message: "Error deleting vendor" });
  }
});

module.exports = router;
