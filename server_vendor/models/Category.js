// backend/models/Category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Purchased', 'Rented'],
    required: true,
  },
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
