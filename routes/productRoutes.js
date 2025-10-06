const { addProduct, getProducts, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const upload = require("../middleware/uploadMiddleware");

const express = require("express");
const router = express.Router();

router.get("/", getProducts);
router.get('/:id', getSingleProduct);

// Admin
// Add product with image upload
router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    [
        body("name").notEmpty().withMessage("Product name required"),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
        body("description").notEmpty().withMessage("Description required")
    ],
    addProduct
);

router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
