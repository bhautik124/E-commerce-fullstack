const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  getProductWithSuggestions,
} = require("../controllers/productController.js");
const router = express.Router();

router.post("/create", addProduct);
router.get("/get", getProducts);
router.get("/get/:id", getProductById);
router.get("/get/:id/suggestions", getProductWithSuggestions);

module.exports = router;
