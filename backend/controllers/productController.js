const Product = require("../models/product-model.js");

module.exports.addProduct = async (req, res) => {
  try {
    let {
      name,
      price,
      shortDescription,
      longDescription,
      dimensions,
      materials,
      category,
      imageUrl,
    } = req.body;
    const product = await Product.create({
      name,
      price,
      shortDescription,
      longDescription,
      dimensions,
      materials,
      category,
      imageUrl,
    });
    res.status(201).send({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).send("server error");
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return res.status(404).send("Product not found");
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error.message);
  }
};

module.exports.getProductWithSuggestions = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const suggestions = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);

    res.status(200).json({
      product,
      suggestions,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};
