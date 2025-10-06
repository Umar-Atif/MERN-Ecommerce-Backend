const jwt = require("jsonwebtoken");

const generateToken = (id, isAdmin) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
