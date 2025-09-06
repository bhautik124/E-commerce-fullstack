const mongoose = require("mongoose");

const paySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    apartmentNo: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CreditCard"],
      required: true,
    },
    couponCode: {
      type: String,
      required: false,
      default: null,
    },
    originalAmount: {
      type: Number, // Store the original amount here
      required: true,
    },
    discountedAmount: {
      type: Number, // Amount after applying coupon discount
      required: false,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user making the payment
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paySchema);
