// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  vendor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  serialBox: {
    type: String,
    required: false
  },
  purchaseDate: {
    type: String,
    required: true
  },
  warrantyPeriod: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);
