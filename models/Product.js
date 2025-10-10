const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: { type: Boolean, default: true },
    category: String,
    image: { type: String }
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
