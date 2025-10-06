const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const generateToken = require("../config/jwt");

// Register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    // set cookie
    res.cookie("token", generateToken(user._id, user.isAdmin), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in register" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // set cookie
    res.cookie("token", generateToken(user._id, user.isAdmin), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in login" });
  }
};

// Logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in logout" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getProfile };
