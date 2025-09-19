const express = require("express");
const {
  createCart,
  getCartProduct,
  removeProductFromCart,
  updateCartItemQuantity,
} = require("../controllers/cartController.js");
const isAuth = require("../middleware/isAuth.js");
const router = express.Router();

router.post("/createCart", isAuth, createCart); // Cart create karne ke liye POST
router.get("/getCart", isAuth, getCartProduct); // Cart fetch karne ke liye GET
router.delete("/remover", isAuth, removeProductFromCart); // Product remove karne ke liye DELETE
router.patch("/updatequantity", isAuth, updateCartItemQuantity); // Quantity update karne ke liye PATCH

module.exports = router;
