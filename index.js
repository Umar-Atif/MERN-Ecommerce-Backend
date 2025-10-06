const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const dotenv = require("dotenv");
dotenv.config();

// // Connect DB 
// await mongoose.connect(process.env.MONGO_URI, { dbName: "Ecommerce" })
//     .then(() => {
//         console.log("MongoDB connected");
//         app.listen(process.env.PORT);
//     })
//     .catch(err => console.log(err));

const app = express();

// Connect DB
let isConnected = false;
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "Ecommerce" });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
// DB Middleware
app.use((req, res, next) => {
    if (!isConnected) {
        connectDB()
    }
    next();
})

app.get('/', (req, res) => {
    res.send("Hello World");
});

// Middlewares
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;