const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, default: 0 }
});

const Cart = mongoose.model("Carts", cartSchema);
module.exports = Cart;
