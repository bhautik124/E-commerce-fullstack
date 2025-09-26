const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model.js");

const auth = async (req, res, next) => {
  console.log("Auth middleware - Cookies received:", req.cookies);
  console.log("Auth middleware - Headers:", req.headers.cookie);
  
  const token = req.cookies.token;
  if (!token) {
    console.log("Auth middleware - No token found");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    console.log("Auth middleware - Verifying token:", token.substring(0, 20) + "...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Auth middleware - Token decoded successfully for user:", decoded.id);
    
    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.log("Auth middleware - User not found in database");
      return res.status(401).send("User not found");
    }
    
    console.log("Auth middleware - User authenticated:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware - Token verification failed:", error.message);
    res.status(401).json({ msg: "Unauthorized" });
  }
};
module.exports = auth;
