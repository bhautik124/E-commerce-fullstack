const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model.js");

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "Unauthorized" });
  }
};
module.exports = auth;
