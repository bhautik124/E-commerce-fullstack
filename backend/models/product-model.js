const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    dimensions: {
      type: [
        {
          depth: { type: String, required: true },
          width: { type: String, required: true },
          height: { type: String, required: true },
          seatHeight: { type: String, required: true },
        },
      ],
      trim: true,
    },
    materials: {
      type: [String],
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String], // URL of the image
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
