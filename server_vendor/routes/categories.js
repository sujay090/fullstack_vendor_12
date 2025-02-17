const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

// Add a new category
router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;
    const newCategory = new Category({ name, type });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Error adding category" });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// ✅ Update (Edit) a category by ID
router.put("/:categoryId", async (req, res) => {
  try {
    const { name, type } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name, type },
      { new: true } // Return the updated category
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "Error updating category" });
  }
});

// Delete a category by ID
router.delete("/:categoryId", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).send("Category deleted successfully");
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

module.exports = router;
