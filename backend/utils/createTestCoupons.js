const mongoose = require('mongoose');
const Coupon = require('../models/coupon-model.js');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create test coupons
const createTestCoupons = async () => {
  try {
    // Delete existing test coupons
    await Coupon.deleteMany({ code: { $in: ['SAVE10', 'WELCOME20', 'DISCOUNT15'] } });

    const testCoupons = [
      {
        code: 'SAVE10',
        discount: 10,
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: 'WELCOME20',
        discount: 20,
        isActive: true,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        code: 'DISCOUNT15',
        discount: 15,
        isActive: true,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      }
    ];

    const createdCoupons = await Coupon.insertMany(testCoupons);
    console.log('Test coupons created successfully:', createdCoupons);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test coupons:', error);
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(() => {
  createTestCoupons();
});