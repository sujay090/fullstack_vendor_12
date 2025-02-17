// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model("Vendor", vendorSchema);
    