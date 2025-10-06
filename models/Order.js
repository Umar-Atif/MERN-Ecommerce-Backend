const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
