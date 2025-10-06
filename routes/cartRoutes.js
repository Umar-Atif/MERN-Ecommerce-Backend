const { addToCart, getCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/:userId", protect, getCart);
router.post("/remove", protect, removeFromCart);
router.post("/clear", protect, clearCart);

module.exports = router;
