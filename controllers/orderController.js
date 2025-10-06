const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Place Order (from cart)
const placeOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = cart.items.map(i => ({
            product: i.product._id,
            quantity: i.quantity,
            price: i.product.price
        }));

        const totalAmount = orderItems.reduce((sum, i) => sum + (i.quantity * i.price), 0);

        const order = new Order({
            user: userId,
            orderItems,
            totalAmount
        });

        await order.save();

        // clear cart after order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error placing order" });
    }
};

// Get User Orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate("orderItems.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
};

// Admin: Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all orders" });
    }
};

module.exports = { placeOrder, getUserOrders, updateOrderStatus, getAllOrders };
