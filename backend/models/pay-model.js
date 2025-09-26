const mongoose = require("mongoose");

const paySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^\+?[\d\s\-\(\)]{10,}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      minlength: [2, 'Country must be at least 2 characters']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters'],
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    apartmentNo: {
      type: String,
      required: false,
      trim: true,
      maxlength: [20, 'Apartment number cannot exceed 20 characters']
    },
    postalCode: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\w\s\-]{2,10}$/.test(v);
        },
        message: 'Please enter a valid postal code (2-10 characters)'
      }
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be at least 2 characters'],
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["COD", "UPI", "CreditCard"],
        message: 'Payment method must be COD, UPI, or CreditCard'
      },
      required: [true, 'Payment method is required']
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "cancelled"],
        message: 'Invalid payment status'
      },
      default: "pending"
    },
    couponCode: {
      type: String,
      required: false,
      default: null,
      trim: true,
      uppercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[A-Z0-9]{3,20}$/.test(v);
        },
        message: 'Coupon code can only contain uppercase letters and numbers'
      }
    },
    originalAmount: {
      type: Number,
      required: [true, 'Original amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      max: [10000, 'Amount cannot exceed $10,000'],
      validate: {
        validator: function(v) {
          return Number.isFinite(v) && v > 0;
        },
        message: 'Amount must be a valid positive number'
      }
    },
    discountedAmount: {
      type: Number,
      required: [true, 'Discounted amount is required'],
      min: [0.01, 'Discounted amount must be greater than 0'],
      max: [10000, 'Discounted amount cannot exceed $10,000'],
      default: function() { return this.originalAmount; }
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User ID is required']
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for performance
paySchema.index({ userId: 1, createdAt: -1 });
paySchema.index({ couponCode: 1 });
paySchema.index({ paymentStatus: 1 });

// Virtual for calculating savings
paySchema.virtual('savings').get(function() {
  return this.originalAmount - this.discountedAmount;
});

// Pre-save middleware to validate discounted amount
paySchema.pre('save', function(next) {
  if (this.discountedAmount > this.originalAmount) {
    next(new Error('Discounted amount cannot be greater than original amount'));
  }
  next();
});

module.exports = mongoose.model("Payment", paySchema);
