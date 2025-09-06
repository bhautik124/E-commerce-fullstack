const Coupon = require("../models/coupon-model.js");
const Payment = require("../models/pay-model.js");

module.exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, isActive } = req.body;
    const newCoupon = await Coupon.create({
      code,
      discount,
      isActive,
    });
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating coupon", error });
  }
};

module.exports.getCouponDetails = async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive coupon",
        discount: 0,
      });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching coupon", error });
  }
};

module.exports.processPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { couponCode, amount, ...paymentDetails } = req.body;

    // Adding console logs for debugging
    console.log("Payment request body:", req.body);

    // Check if userId and amount are provided
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "User ID and amount are required",
      });
    }

    let discount = 0;
    let coupon;

    if (couponCode) {
      // Find the coupon by code
      coupon = await Coupon.findOne({ code: couponCode });

      if (
        !coupon ||
        !coupon.isActive ||
        coupon.expiryDate < new Date() ||
        coupon.usedBy.includes(userId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive coupon",
          discount: 0,
        });
      }

      // Get the discount value from the coupon
      discount = coupon.discount;
    }

    // Define the minimum amount required to apply the coupon
    const discountedPrice = 999;

    // If the amount is less than the required minimum, reject the coupon
    if (amount < discountedPrice) {
      console.log(`Amount ${amount} is less than required ${discountedPrice}`);
      return res.status(400).json({
        success: false,
        message: `You are not eligible to apply the coupon for ${amount}. Please order more than ${discountedPrice} to use this discount.`,
      });
    }

    // Apply discount to the amount
    const discountedAmount = amount - amount * (discount / 100);

    // If a coupon was used and the user is eligible, mark the coupon as used
    if (coupon) {
      coupon.usedBy.push(userId);
      await coupon.save();
    }

    // Adding console log for discount amount
    console.log("Discounted amount to charge:", discountedAmount);

    // Process payment with the discounted amount
    const payment = await Payment.create({
      ...paymentDetails,
      userId,
      couponCode,
      originalAmount: amount,
      discountedAmount,
    });

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    // Handle errors gracefully
    console.error("Error during payment processing:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
