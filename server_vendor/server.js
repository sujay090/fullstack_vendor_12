const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();    
const vendorsRoutes = require("./routes/vendors");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const userAuthRoutes = require("./routes/usersAuth");
const dashboardRoutes = require("./routes/dashboard");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Authentication routes
app.use("/api/admin-auth", require("./routes/adminAuth"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", userAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
