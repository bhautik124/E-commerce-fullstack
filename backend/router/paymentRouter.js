const express = require("express");
const {
  processPayment,
  createCoupon,
  getCouponDetails,
} = require("../controllers/paymentController");
const isAuth = require("../middleware/isAuth.js");
const router = express.Router();

router.post("/coupons", createCoupon);
router.post("/paymentdetail", isAuth , processPayment);
router.get("/coupons/:code", getCouponDetails);

module.exports = router;
