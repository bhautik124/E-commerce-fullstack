import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { useSelector } from "react-redux";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

const DiscoverProduct = ({ cartItems, updateCartItems }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const isLoggedIn = user && Object.keys(user).length > 0;

  // Fetch product data from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        showInfoToast("Loading product...");
        
        const response = await fetch(`http://localhost:8000/product/get/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setProduct(data);
          showSuccessToast(`${data.name} loaded successfully`);
        } else {
          throw new Error(data.message || "Product not found");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        showErrorToast("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Suggest the product
  useEffect(() => {
    const fetchSuggestProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/product/get/${id}/suggestions`
        );
        const data = await response.json();
        
        if (response.ok) {
          setSuggestions(data.suggestions);
        } else {
          console.warn("No suggestions available");
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error);
        showErrorToast("Failed to load suggestions");
      }
    };

    fetchSuggestProduct();
  }, [id]);

  const addToCart = async () => {
    if (!isLoggedIn) {
      showErrorToast("Please login first to add items to cart");
      return;
    }

    if (!product || !product._id) {
      showErrorToast("Invalid product information");
      return;
    }

    try {
      showInfoToast("Adding to cart...");
      
      const response = await axios.post(
        "http://localhost:8000/cart/createCart",
        {
          userId,
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        updateCartItems(
          response.data.cart.items.map((item) => ({
            ...item.productId,
            quantity: item.quantity,
          }))
        );
        showSuccessToast(`${product.name} added to cart successfully`);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            showErrorToast(data.message || "Failed to add to cart");
            break;
          case 401:
            showErrorToast("Session expired! Please login again");
            break;
          case 404:
            showErrorToast("Product not found");
            break;
          case 409:
            showErrorToast("This product is already in your cart");
            break;
          case 500:
            showErrorToast("Server error. Please try again later");
            break;
          default:
            showErrorToast(data.message || "Failed to add product to cart");
        }
      } else if (error.request) {
        showErrorToast("Check your internet connection");
      } else {
        showErrorToast("Something went wrong. Please try again");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F2EDE7] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#F2EDE7] flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#F2EDE7]">
      <div className="bg-[#F2EDE7] p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-24 mt-10 lg:mt-0">
        {/* Product Images */}
        <div className="w-full lg:w-[45%]">
          {/* Main Image */}
          <div className="w-full">
            <img
              src={product.imageUrl[activeImage]}
              alt={product.name}
              className="w-full h-auto max-h-[400px] md:max-h-[500px] lg:max-h-[650px] rounded-lg object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center space-x-4 mt-4">
            {product.imageUrl.slice(0, 2).map((image, index) => (
              <div key={index} className="w-16 h-16 md:w-20 md:h-20">
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className={`w-full h-full object-cover rounded-lg cursor-pointer ${
                    activeImage === index ? "border-4 border-[#DD523F]" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-[40%] text-center space-y-4 border-2 border-[#DD523F] p-6 md:p-8 lg:p-10 rounded-lg flex flex-col justify-between min-h-[500px] md:min-h-[600px] lg:min-h-[650px]">
          <h1 className="text-xl md:text-2xl font-bold text-[#DD523F]">
            {product.name}
          </h1>
          <p className="text-black text-sm md:text-base">
            {product.longDescription}
          </p>

          {/* BUY NOW Button */}
          <Link to="/cart" className="mt-4">
            <button
              onClick={addToCart}
              className="py-2 px-4 rounded-md text-base md:text-lg border border-[#DD523F] text-[#DD523F] hover:bg-[#DD523F] hover:text-white"
            >
              BUY NOW
            </button>
          </Link>

          {/* Dimensions */}
          <div className="text-center mt-4">
            <h2 className="text-lg md:text-xl font-semibold">DIMENSIONS</h2>
            <ul className="text-black mt-2 space-y-1 text-sm md:text-base">
              <li>Height: {product.dimensions?.height || "N/A"} cm</li>
              <li>Width: {product.dimensions?.width || "N/A"} cm</li>
              <li>Depth: {product.dimensions?.depth || "N/A"} cm</li>
              <li>Seat height: {product.dimensions?.seatHeight || "N/A"} cm</li>
            </ul>
          </div>

          {/* Materials */}
          <div className="text-center mt-4">
            <h2 className="text-lg md:text-xl font-semibold">MATERIALS</h2>
            <p className="text-black text-sm md:text-base">
              {product.materials || "Material information not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="w-full p-4 md:p-6 lg:p-10">
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-wider underline font-homeBold text-[#DD523F] text-center">
            Recommended for you
          </h3>
          <Link to="/product" className="mt-4">
            <h3 className="text-lg md:text-xl font-homeBold underline">
              View all products
            </h3>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {suggestions.map((suggest, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 border border-[#DD523F] rounded-lg p-4 md:p-6"
            >
              <img
                src={suggest.imageUrl[0]}
                alt={suggest.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
              <h3 className="text-base md:text-lg font-bold text-center">
                {suggest.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 text-center">
                {suggest.shortDescription}
              </p>
              <p className="text-[#DD523F] font-semibold">${suggest.price}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                {isLoggedIn && (
                  <button className="bg-[#DD523F] text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm md:text-base">
                    Add to Cart
                  </button>
                )}
                <Link to={`/discover/${suggest._id}`} onClick={scrollToTop}>
                  <button className="bg-gray-200 text-[#DD523F] px-3 py-2 rounded-md hover:bg-gray-300 text-sm md:text-base">
                    Discover
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverProduct;
