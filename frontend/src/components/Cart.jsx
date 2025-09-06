import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Cart = ({ cartItems, updateCartItems }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  // Fetch cart items from the backend when the component loads
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://e-commerce-fullstack-vkv8.onrender.com/cart/getCart", {
          withCredentials: true,
        });

        if (response.status === 200) {
          const fetchedCartItems = response.data.cart.items.map((item) => ({
            ...item.productId,
            quantity: item.quantity,
          }));
          updateCartItems(fetchedCartItems);
        }
      } catch (error) {
        console.log("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId, updateCartItems]);

  // Function to remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        "https://e-commerce-fullstack-vkv8.onrender.com/cart/remover",
        {
          data: {
            userId,
            productId,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        updateCartItems(
          response.data.cart.items.map((item) => ({
            ...item.productId,
            quantity: item.quantity,
          }))
        );
      }
    } catch (error) {
      console.log("Error removing product from cart:", error);
    }
  };

  // Update cart quantity function
  const updateCartQuantity = async (itemId, newQuantity) => {
    try {
      const response = await axios.patch(
        "https://e-commerce-fullstack-vkv8.onrender.com/cart/updatequantity",
        {
          userId,
          productId: itemId,
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        updateCartItems(
          response.data.cart.items.map((item) => ({
            ...item.productId,
            quantity: item.quantity,
          }))
        );
      }
    } catch (error) {
      console.log("Error updating cart quantity:", error.message);
    }
  };

  const handleIncrement = (itemId) => {
    const item = cartItems.find((item) => item._id === itemId);
    const newQuantity = item.quantity + 1;
    updateCartQuantity(itemId, newQuantity);
  };

  const handleDecrement = (itemId) => {
    const item = cartItems.find((item) => item._id === itemId);
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-10 bg-[#F2EDE7]">
      <h3 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-homeBold text-[#DD523F]">
        Cart
      </h3>

      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl md:text-2xl font-homeBold text-[#DD523F]">
            Your cart is empty :)
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 mt-6 md:mt-8">
          {/* Left Side - Cart Items */}
          <div className="w-full lg:w-2/3 space-y-4 md:space-y-5">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 md:p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full sm:w-[120px] md:w-[150px] h-auto max-h-[200px] md:max-h-[250px] object-cover"
                  />
                  <div className="p-3 md:p-5 font-home w-full">
                    <h3 className="text-xl md:text-2xl lg:text-3xl mb-2 font-semibold text-center sm:text-left">
                      {item.name}
                    </h3>
                    <p className="text-sm md:text-base mb-4 md:mb-6 text-center sm:text-left">
                      {item.description}
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold text-center sm:text-left">
                      Quantity
                    </h3>

                    <div className="flex items-center justify-center sm:justify-start space-x-3 mt-2">
                      <button
                        onClick={() => handleDecrement(item._id)}
                        className="px-3 py-1 border border-[#DD523F] text-[#DD523F] rounded-full hover:bg-[#DD523F] hover:text-white transition duration-300"
                      >
                        -
                      </button>
                      <span className="min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item._id)}
                        className="px-3 py-1 border border-[#DD523F] text-[#DD523F] rounded-full hover:bg-[#DD523F] hover:text-white transition duration-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-center sm:justify-start mt-4">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 text-sm md:text-base"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold mt-4 sm:mt-0 sm:pl-4">
                  ${item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Cart Summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg p-4 md:p-5 shadow-lg h-fit">
            <h3 className="text-xl font-bold mb-4 md:mb-5">Cart Total</h3>
            <div className="flex justify-between mb-3">
              <span>Total Price:</span>
              <span>${totalAmount}.00</span>
            </div>
            <div className="flex justify-between mb-3">
              <span>Shipping Cost:</span>
              <span>FREE</span>
            </div>
            <hr className="mb-3" />
            <div className="flex justify-between font-bold text-lg mb-5">
              <span>Total Cost:</span>
              <span>${totalAmount}.00</span>
            </div>
            <Link to="/buy">
              <button className="bg-[#DD523F] text-white w-full py-2 rounded-lg hover:bg-red-600 transition duration-300">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Back to Products button */}
      <div className="mt-8 md:mt-10 flex items-center justify-center">
        <button
          onClick={() => navigate("/product")}
          className="border border-[#DD523F] text-[#DD523F] rounded-full px-4 py-2 hover:bg-[#DD523F] hover:text-white transition duration-300"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default Cart;
