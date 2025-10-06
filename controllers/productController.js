const Product = require("../models/Product");

const { validationResult } = require("express-validator");

// Add Product
const addProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description, price, category } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            image: req.file ? req.file.path : null
        });

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

// Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const updateData = {
            name,
            description,
            price,
            category,
            stock,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};

module.exports = { addProduct, getProducts, getSingleProduct, updateProduct, deleteProduct };
