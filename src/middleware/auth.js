const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const useAuth = async (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthorized!");
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded._id);
    console.log(user);
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = { useAuth };
