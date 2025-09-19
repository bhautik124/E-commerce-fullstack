import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
        console.log("Error fetching cart items:", error);
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
    try {
      const response = await axios.get(
        `http://localhost:8000/payment/coupons/${couponCode}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setDiscount(response.data.coupon.discount);
        toast.success("Coupon applied successfully!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Error applying coupon", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        userId,
        amount: finalTotal,
        email,
        phoneNumber,
        country,
        firstName,
        lastName,
        address,
        apartmentNo,
        postalCode,
        city,
        paymentMethod,
        paymentDetails,
      };

      if (couponCode) {
        paymentData.couponCode = couponCode;
      }

      const response = await axios.post(
        "http://localhost:8000/payment/paymentdetail",
        paymentData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Payment processed successfully!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });

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
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error during payment request:", error.response?.data);
      toast.error("Error processing payment", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
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
            <ToastContainer />
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
