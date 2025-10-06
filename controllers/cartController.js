const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Add / Update Cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(
            (i) => i.product._id.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity <= 0) {
                cart.items = cart.items.filter(
                    (i) => i.product._id.toString() !== productId
                );
            }
        } else if (quantity > 0) {
            cart.items.push({ product: productId, quantity });
        }

        // ✅ Recalculate total
        let total = 0;
        for (let item of cart.items) {
            const prod = await Product.findById(item.product._id || item.product);
            total += item.quantity * prod.price;
        }
        cart.totalPrice = total;

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate("items.product");
        res.json(updatedCart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Error adding to cart" });
    }
};

// ✅ Get Cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate(
            "items.product"
        );
        res.json(cart || { items: [], totalPrice: 0 });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Error fetching cart" });
    }
};

// ✅ Remove Item
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (i) => i.product._id.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (sum, i) => sum + i.quantity * i.product.price,
            0
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ message: "Error removing item" });
    }
};

// ✅ Clear Cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.json({ message: "Cart cleared", cart });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Error clearing cart" });
    }
};

module.exports = { addToCart, getCart, removeFromCart, clearCart };
