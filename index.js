const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Database
let isConnected = false;
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "Ecommerce" });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
app.use((req, res, next) => {
  if (!isConnected) connectDB();
  next();
});

// Middlewares
const allowedOrigins = ["http://localhost:5173", "https://mern-ecommerce-frontend-cyan.vercel.app/"];
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => res.send("Server running fine 🚀"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;