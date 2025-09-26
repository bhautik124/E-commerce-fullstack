const cartModel = require("../models/cart-model.js");
const mongoose = require("mongoose");

module.exports.createCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    // User ka cart find karte hain
    let cart = await cartModel.findOne({ userId });

    // Agar cart nahi hai, to naya create karenge
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Agar cart pehle se hai, to usme product add/update karenge
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Product pehle se hai, to quantity update karenge
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Naya product add karenge
        cart.items.push({ productId, quantity });
      }
    }

    // Cart ko save karenge
    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.getCartProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message);
  }
};

module.exports.removeProductFromCart = async (req, res) => {
  const userId = req.user._id;

  const { productId } = req.body;

  try {
    // User ka cart dhundte hain
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Cart se product remove karenge
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateCartItemQuantity = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ message: "Cart item quantity updated", cart });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
