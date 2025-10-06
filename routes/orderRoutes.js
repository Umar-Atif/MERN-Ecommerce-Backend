const { placeOrder, getUserOrders, updateOrderStatus, getAllOrders } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// User
router.post("/place", protect, placeOrder);
router.get("/:userId", protect, getUserOrders);

// Admin
router.post("/status", protect, adminOnly, updateOrderStatus);
router.get("/", protect, adminOnly, getAllOrders); 

module.exports = router;
