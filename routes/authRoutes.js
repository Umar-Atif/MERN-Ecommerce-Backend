const { registerUser, loginUser, logoutUser, getProfile } = require("../controllers/authController");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

router.post("/logout", logoutUser);
router.get("/profile", protect, getProfile);

module.exports = router;
