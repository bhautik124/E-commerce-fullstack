const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController.js");
const isAuth = require("../middleware/isAuth.js");
const router = express.Router();

router.post("/createUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", isAuth, (req, res) => {
  res.json({ sucess: true, user: req.user });
});

module.exports = router;
