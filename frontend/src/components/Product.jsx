import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Product = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const isLoggedIn = user && Object.keys(user).length > 0;

  const handleCategoryClick = (category) => {
    setFilteredCategory(category);
    setIsMenuOpen(false);
  };

  const filteredProducts = products
    ? products.filter(
        (product) =>
          filteredCategory === "All" || product.category === filteredCategory
      )
    : [];

  // Function to add item to cart and call the backend API
  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        "https://e-commerce-fullstack-vkv8.onrender.com/cart/createCart",
        {
          userId,
          productId: product._id,
          quantity: 1, // You can adjust this quantity based on user selection
          createdAt: Date.now(),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedCart = response.data.cart;
        // Update the frontend cart state with the updated cart from the backend
        setCartItems(updatedCart.items);
        toast.success("Product added to cart", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Error adding to cart", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // Scroll to top when the component is rendered
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("https://e-commerce-fullstack-vkv8.onrender.com/product/get", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setProducts(response.data); // Ensure response.data.products is correct
        }
      } catch (error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    };
    fetchProduct();
  }, []);

  const categories = [
    "All",
    "Chair",
    "Head of the Table",
    "Armchair",
    "Sofa",
    "Table",
    "Coffee Table",
  ];

  return (
    <div className="w-full min-h-screen bg-[#F2EDE7]">
      <ToastContainer />
      <div className="w-full px-4 py-6 md:p-5 mt-10 md:mt-0">
        <h3 className="text-4xl md:text-6xl lg:text-8xl tracking-tighter font-homeBold text-[#DD523F] text-center md:text-left">
          Products
        </h3>

        {/* Mobile menu button */}
        <div className="md:hidden flex justify-between items-center mt-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="border border-[#DD523F] rounded-full px-4 py-2 text-[#DD523F]"
          >
            {isMenuOpen ? "Close Menu" : "Categories"}
          </button>
          <Link to="/cart">
            <button className="border border-[#DD523F] text-[#DD523F] rounded-full px-4 py-2 hover:bg-[#DD523F] hover:text-white">
              Cart ({cartItems.length})
            </button>
          </Link>
        </div>

        {/* Category Buttons */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:block mt-4 md:mt-10`}
        >
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-4 space-y-2 md:space-y-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`border border-[#DD523F] rounded-full px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-[#DD523F] hover:bg-[#DD523F] hover:text-white ${
                  filteredCategory === category ? "bg-[#DD523F] text-white" : ""
                }`}
              >
                {category}
              </button>
            ))}

            {/* Cart Button for larger screens */}
            <div className="hidden md:flex md:ml-5 md:items-center">
              <Link to="/cart">
                <button className="border border-[#DD523F] text-[#DD523F] rounded-full px-4 py-2 hover:bg-[#DD523F] hover:text-white">
                  Cart ({cartItems.length})
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen bg-[#F2EDE7] p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-[#F2EDE7] p-4 md:p-5 rounded-lg shadow-lg flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto md:h-[250px] lg:h-[300px] object-cover"
              />
              <h3 className="text-xl md:text-2xl flex justify-center font-bold mt-4 md:mt-5">
                {product.name}
              </h3>
              <p className="text-gray-700 flex font-homeBold justify-center mt-3 md:mt-5">
                Price: {product.price}$
              </p>
              <p className="text-gray-700 flex justify-center mt-3 md:mt-5 text-sm md:text-base">
                {product.shortDescription}
              </p>

              <div className="mt-4 md:mt-5 flex justify-center space-x-2 md:space-x-4">
                <Link to={`/discover/${product._id}`}>
                  <button className="border border-[#DD523F] text-[#DD523F] rounded-full px-3 py-1 md:px-4 md:py-2 text-sm md:text-base hover:bg-[#DD523F] hover:text-white">
                    Discover
                  </button>
                </Link>
                {isLoggedIn && (
                  <button
                    onClick={() => addToCart(product)}
                    className="border border-[#DD523F] text-[#DD523F] rounded-full px-3 py-1 md:px-4 md:py-2 text-sm md:text-base hover:bg-[#DD523F] hover:text-white"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
