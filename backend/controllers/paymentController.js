const Coupon = require("../models/coupon-model.js");
const Payment = require("../models/pay-model.js");

module.exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, isActive, expiryDate } = req.body;

    // Validation
    const validationErrors = [];

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      validationErrors.push("Coupon code is required");
    } else if (code.trim().length < 3 || code.trim().length > 20) {
      validationErrors.push("Coupon code must be between 3 and 20 characters");
    } else if (!/^[A-Z0-9]+$/.test(code.trim())) {
      validationErrors.push("Coupon code can only contain uppercase letters and numbers");
    }

    if (discount === undefined || discount === null || isNaN(discount)) {
      validationErrors.push("Discount is required and must be a number");
    } else if (discount < 1 || discount > 100) {
      validationErrors.push("Discount must be between 1 and 100 percent");
    }

    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        validationErrors.push("Invalid expiry date format");
      } else if (expiry <= new Date()) {
        validationErrors.push("Expiry date must be in the future");
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ 
      code: { $regex: new RegExp(`^${code.trim()}$`, 'i') }
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const newCoupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discount: parseFloat(discount),
      isActive: isActive !== undefined ? isActive : true,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    });

    res.status(201).json({ 
      success: true, 
      coupon: {
        id: newCoupon._id,
        code: newCoupon.code,
        discount: newCoupon.discount,
        isActive: newCoupon.isActive,
        expiryDate: newCoupon.expiryDate,
        createdAt: newCoupon.createdAt,
      }
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    
    let errorMessage = "Error creating coupon";
    let statusCode = 500;

    if (error.code === 11000) {
      errorMessage = "Coupon code already exists";
      statusCode = 409;
    } else if (error.name === 'ValidationError') {
      errorMessage = "Coupon data validation failed";
      statusCode = 400;
    }

    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports.getCouponDetails = async (req, res) => {
  try {
    const { code } = req.params;

    // Validate coupon code format
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
        discount: 0,
      });
    }

    if (code.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is too long",
        discount: 0,
      });
    }

    // Find coupon (case-insensitive)
    const coupon = await Coupon.findOne({ 
      code: { $regex: new RegExp(`^${code.trim()}$`, 'i') }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
        discount: 0,
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
        discount: 0,
      });
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
        discount: 0,
      });
    }

    // Check if user has already used this coupon (if user is authenticated)
    if (req.user && coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already used this coupon",
        discount: 0,
      });
    }

    // Return coupon details without sensitive information
    res.status(200).json({ 
      success: true, 
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        isActive: coupon.isActive,
        expiryDate: coupon.expiryDate,
      }
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching coupon details", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports.processPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      couponCode, 
      amount, 
      email, 
      phoneNumber, 
      country, 
      firstName, 
      lastName, 
      address, 
      city, 
      paymentMethod,
      ...paymentDetails 
    } = req.body;

    // Adding console logs for debugging
    console.log("Payment request body:", req.body);

    // Comprehensive validation
    const validationErrors = [];

    // Check required fields
    if (!userId) validationErrors.push("User authentication required");
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      validationErrors.push("Valid amount is required and must be greater than 0");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("Valid email address is required");
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      validationErrors.push("Valid phone number is required (minimum 10 digits)");
    }
    if (!country || country.trim().length === 0) {
      validationErrors.push("Country is required");
    }
    if (!firstName || firstName.trim().length < 2) {
      validationErrors.push("First name is required (minimum 2 characters)");
    }
    if (!lastName || lastName.trim().length < 2) {
      validationErrors.push("Last name is required (minimum 2 characters)");
    }
    if (!address || address.trim().length < 5) {
      validationErrors.push("Valid address is required (minimum 5 characters)");
    }
    if (!city || city.trim().length < 2) {
      validationErrors.push("City is required (minimum 2 characters)");
    }
    if (!paymentMethod || !['COD', 'UPI', 'CreditCard'].includes(paymentMethod)) {
      validationErrors.push("Valid payment method is required (COD, UPI, or CreditCard)");
    }

    // Check amount limits
    const minAmount = 1;
    const maxAmount = 10000;
    if (parseFloat(amount) < minAmount) {
      validationErrors.push(`Minimum order amount is $${minAmount}`);
    }
    if (parseFloat(amount) > maxAmount) {
      validationErrors.push(`Maximum order amount is $${maxAmount}`);
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    let discount = 0;
    let coupon;
    let finalAmount = parseFloat(amount);

    // Coupon validation and processing
    if (couponCode) {
      // Validate coupon code format
      if (typeof couponCode !== 'string' || couponCode.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code format",
          discount: 0,
        });
      }

      // Find the coupon by code (case-insensitive)
      coupon = await Coupon.findOne({ 
        code: { $regex: new RegExp(`^${couponCode.trim()}$`, 'i') }
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon not found. Please check the code and try again.",
          discount: 0,
        });
      }

      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "This coupon is no longer active",
          discount: 0,
        });
      }

      if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: "This coupon has expired",
          discount: 0,
        });
      }

      if (coupon.usedBy.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
          discount: 0,
        });
      }

      // Validate discount value
      if (!coupon.discount || coupon.discount < 0 || coupon.discount > 100) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon discount configuration",
          discount: 0,
        });
      }

      // Get the discount value from the coupon
      discount = coupon.discount;
      
      // Define the minimum amount required to apply the coupon
      const minimumAmount = 50;

      // If the amount is less than the required minimum, reject the coupon
      if (finalAmount < minimumAmount) {
        console.log(`Amount ${finalAmount} is less than required ${minimumAmount}`);
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of $${minimumAmount} required to use this coupon. Your current order is $${finalAmount}.`,
        });
      }

      // Calculate discount amount
      const discountAmount = (finalAmount * (discount / 100));
      const maxDiscountAmount = 500; // Maximum discount cap
      
      const appliedDiscountAmount = Math.min(discountAmount, maxDiscountAmount);
      finalAmount = finalAmount - appliedDiscountAmount;

      // Ensure final amount is not negative
      if (finalAmount < 0) {
        finalAmount = 0.01; // Minimum charge
      }

      // Mark the coupon as used by this user
      coupon.usedBy.push(userId);
      await coupon.save();

      console.log(`Coupon applied: ${discount}% off, Discount amount: $${appliedDiscountAmount.toFixed(2)}`);
    }

    // Additional payment method specific validation
    if (paymentMethod === 'CreditCard') {
      // Add credit card validation if needed
      // This is a placeholder for credit card specific validation
    } else if (paymentMethod === 'UPI') {
      // Add UPI validation if needed
      // This is a placeholder for UPI specific validation
    }

    // Validate final amount before processing
    if (finalAmount < 0.01) {
      return res.status(400).json({
        success: false,
        message: "Invalid final amount calculation",
      });
    }

    // Adding console log for final amount
    console.log("Final amount to charge:", finalAmount);

    // Prepare payment data
    const paymentData = {
      userId,
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      country: country.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      paymentMethod,
      couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
      originalAmount: parseFloat(amount),
      discountedAmount: parseFloat(finalAmount.toFixed(2)),
      discount: discount,
      paymentStatus: 'pending',
      paymentDate: new Date(),
      ...paymentDetails
    };

    // Process payment with the final amount
    const payment = await Payment.create(paymentData);

    if (!payment) {
      // Rollback coupon usage if payment creation failed
      if (typeof coupon !== 'undefined' && coupon && coupon.usedBy && coupon.usedBy.includes(userId)) {
        try {
          coupon.usedBy = coupon.usedBy.filter(id => !id.equals(userId));
          await coupon.save();
        } catch (rollbackError) {
          console.error("Failed to rollback coupon usage:", rollbackError);
        }
      }
      
      return res.status(500).json({
        success: false,
        message: "Failed to create payment record",
      });
    }

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Payment processed successfully",
      payment: {
        id: payment._id,
        originalAmount: payment.originalAmount,
        finalAmount: payment.discountedAmount,
        discount: payment.discount,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        couponCode: payment.couponCode,
      },
      finalAmount: payment.discountedAmount,
      discount: payment.discount,
    });
  } catch (error) {
    // Handle specific error types
    console.error("Error during payment processing:", error);
    
    let errorMessage = "Something went wrong during payment processing";
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      // Extract specific validation errors
      const validationErrors = Object.values(error.errors).map(err => err.message);
      errorMessage = validationErrors.length > 0 ? validationErrors[0] : "Payment data validation failed";
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = "Duplicate payment record detected";
      statusCode = 409;
    } else if (error.name === 'CastError') {
      errorMessage = "Invalid data format provided";
      statusCode = 400;
    }

    // Rollback coupon usage if there was an error after marking it as used
    if (typeof coupon !== 'undefined' && coupon && coupon.usedBy && coupon.usedBy.includes(userId)) {
      try {
        coupon.usedBy = coupon.usedBy.filter(id => !id.equals(userId));
        await coupon.save();
        console.log("Coupon usage rolled back due to payment error");
      } catch (rollbackError) {
        console.error("Failed to rollback coupon usage:", rollbackError);
      }
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
