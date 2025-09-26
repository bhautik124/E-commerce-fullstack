import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

const Buy = ({ cartItems, updateCartItems }) => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  // Local state
  const [localCart, setLocalCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // Discount in percentage
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [finalTotal, setFinalTotal] = useState(0); // For discounted total
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  // Fetch cart on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/cart/getCart", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const fetchedCartItems = response.data.cart.items.map((item) => ({
            ...item.productId,
            quantity: item.quantity,
          }));
          setLocalCart(fetchedCartItems);
          if (updateCartItems) updateCartItems(fetchedCartItems); // update parent state
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        showErrorToast("Failed to load cart items");
      }
    };

    // Only fetch if cartItems empty
    if (!cartItems || cartItems.length === 0) {
      fetchCartItems();
    } else {
      setLocalCart(cartItems);
    }
  }, [cartItems, updateCartItems]);

  // Calculate totals whenever cart or discount changes
  useEffect(() => {
    const total = localCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total.toFixed(2));
    setFinalTotal((total - (total * discount) / 100).toFixed(2));
  }, [localCart, discount]);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode || couponCode.trim().length === 0) {
      showErrorToast("Please enter a coupon code");
      return;
    }

    try {
      showInfoToast("Validating coupon...");
      
      const response = await axios.get(
        `http://localhost:8000/payment/coupons/${couponCode.trim()}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setDiscount(response.data.coupon.discount);
        showSuccessToast(`Congratulations! ${response.data.coupon.discount}% discount applied`);
      } else {
        showErrorToast(response.data.message || "Failed to apply coupon");
      }
    } catch (error) {
      console.error("Apply coupon error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            showErrorToast(data.message || "Invalid or expired coupon");
            break;
          case 404:
            showErrorToast("This coupon code does not exist");
            break;
          case 401:
            showErrorToast("You have already used this coupon");
            break;
          default:
            showErrorToast(data.message || "Failed to apply coupon");
        }
      } else {
        showErrorToast("Check your internet connection");
      }
    }
  };

  const handlePayment = async () => {
    // Validation before payment
    const validationErrors = [];
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("Please enter a valid email address");
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      validationErrors.push("Please enter a valid phone number");
    }
    if (!firstName || firstName.trim().length < 2) {
      validationErrors.push("First name must be at least 2 characters long");
    }
    if (!lastName || lastName.trim().length < 2) {
      validationErrors.push("Last name must be at least 2 characters long");
    }
    if (!address || address.trim().length < 5) {
      validationErrors.push("Please enter complete address");
    }
    if (!city || city.trim().length < 2) {
      validationErrors.push("Please enter city name");
    }
    if (!paymentMethod) {
      validationErrors.push("Please select a payment method");
    }
    if (!country) {
      validationErrors.push("Please select a country");
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showErrorToast(error));
      return;
    }

    if (localCart.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    try {
      showInfoToast("Processing payment...");
      
      const paymentData = {
        userId,
        amount: finalTotal,
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        country: country.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        apartmentNo: apartmentNo?.trim() || "",
        postalCode: postalCode?.trim() || "",
        city: city.trim(),
        paymentMethod,
        paymentDetails,
      };

      if (couponCode && couponCode.trim()) {
        paymentData.couponCode = couponCode.trim();
      }

      const response = await axios.post(
        "http://localhost:8000/payment/paymentdetail",
        paymentData,
        { withCredentials: true }
      );

      if (response.data.success) {
        showSuccessToast(`Congratulations! Payment of $${finalTotal} successful`);

        // Clear form
        setPaymentMethod("");
        setCouponCode("");
        setDiscount(0);
        setEmail("");
        setPhoneNumber("");
        setPaymentDetails({});
        setCountry("");
        setFirstName("");
        setLastName("");
        setAddress("");
        setApartmentNo("");
        setPostalCode("");
        setCity("");

        // Clear cart
        setLocalCart([]);
        if (updateCartItems) updateCartItems([]);

        setTimeout(() => {
          navigate("/product");
        }, 2000);
      } else {
        showErrorToast(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.errors && Array.isArray(data.errors)) {
              data.errors.forEach(err => showErrorToast(err));
            } else {
              showErrorToast(data.message || "Invalid information provided");
            }
            break;
          case 401:
            showErrorToast("Session expired! Please login again");
            break;
          case 409:
            showErrorToast("Coupon issue or duplicate order");
            break;
          case 500:
            showErrorToast("Server error. Please try again later");
            break;
          default:
            showErrorToast(data.message || "Payment processing failed");
        }
      } else if (error.request) {
        showErrorToast("Check your internet connection and try again");
      } else {
        showErrorToast("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 bg-[#F2EDE7] flex justify-center font-home">
      <div className="mt-10 lg:mt-0 w-full max-w-6xl bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
        {/* Left Side - Contact/Delivery/Payment */}
        <div className="flex-1">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-5">
            Contact
          </h3>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 text-sm sm:text-base"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <h3 className="text-2xl sm:text-3xl font-semibold mt-6 mb-4 sm:mb-5">
            Delivery
          </h3>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 text-sm sm:text-base"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Country/Region</option>
            <option value="USA">USA</option>
          </select>
          <div className="flex flex-col sm:flex-row sm:space-x-3 mb-3 gap-3 sm:gap-0">
            <input
              type="text"
              placeholder="First name"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Address"
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 text-sm sm:text-base"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apartment No"
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 text-sm sm:text-base"
            value={apartmentNo}
            onChange={(e) => setApartmentNo(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row sm:space-x-3 mb-5 gap-3 sm:gap-0">
            <input
              type="text"
              placeholder="Postal code"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full sm:w-1/2 border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex items-center mb-6 md:mb-10">
            <input type="checkbox" id="saveInfo" className="mr-2" />
            <label htmlFor="saveInfo" className="text-sm sm:text-base">
              Save this information for next time
            </label>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-5">
            Apply Coupon
          </h3>
          <div className="flex flex-col sm:flex-row sm:space-x-3 mb-6 md:mb-10 gap-3 sm:gap-0">
            <input
              type="text"
              placeholder="Enter Coupon Code (optional)"
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleApplyCoupon}
              className="py-2 sm:py-3 px-4 sm:px-6 bg-[#DD523F] text-white rounded text-sm sm:text-base whitespace-nowrap"
            >
              Apply
            </button>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-5">
            Payment Method
          </h3>
          <div className="flex flex-col space-y-3 mb-5">
            <label className="flex items-center text-sm sm:text-base">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Cash on Delivery (COD)
            </label>
            <label className="flex items-center text-sm sm:text-base">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              UPI
            </label>
            <label className="flex items-center text-sm sm:text-base">
              <input
                type="radio"
                name="payment"
                value="CreditCard"
                checked={paymentMethod === "CreditCard"}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              Credit Card
            </label>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-3 bg-[#DD523F] text-white rounded-lg text-sm sm:text-base"
          >
            Pay Now
          </button>
        </div>

        {/* Right Side - Cart Summary */}
        <div className="flex-1 lg:ml-0 mt-8 lg:mt-0">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-5">
            Your Cart
          </h3>
          <div className="space-y-4 sm:space-y-5 mb-5">
            {localCart.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-sm sm:text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4 sm:pt-5">
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <p>Subtotal ({localCart.length} items)</p>
              <p>${totalAmount}</p>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base">
              <p>Discount</p>
              <p>{discount}%</p>
            </div>
            <div className="flex justify-between mb-2 text-sm sm:text-base font-semibold">
              <p>Total (USD)</p>
              <p>${finalTotal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
