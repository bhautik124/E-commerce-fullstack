import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Contect from "./components/Contect";
import About from "./components/About";
import Product from "./components/Product";
import Collection from "./components/Collection";
import Cart from "./components/Cart";
import DiscoverProduct from "./components/DiscoverProduct";
import Buy from "./components/Buy";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import { useDispatch, useSelector } from "react-redux";
import { asynchFetchUserDetails } from "./store/actions/FetchUserApi";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// const App = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const location = useLocation();
//   const navSaw = location.pathname === "/userhome";

//   return (
//     <div className="w-full min-h-screen overflow-hidden bg-[#F2EDE7]">
//       {!navSaw && <Nav />}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/collection" element={<Collection />} />
//         <Route
//           path="/product"
//           element={
//             <Product cartItems={cartItems} setCartItems={setCartItems} />
//           }
//         />
//         <Route
//           path="/cart"
//           element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
//         />
//         <Route
//           path="/discover/:id"
//           element={
//             <DiscoverProduct
//               cartItems={cartItems}
//               setCartItems={setCartItems}
//             />
//           }
//         />
//         <Route path="/buy" element={<Buy cartItems={cartItems} />} />
//         <Route path="/contect" element={<Contect />} />
//       </Routes>
//     </div>
//   );
// };

// In App.js - Update the App component
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const navSaw = location.pathname === "/userhome";
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(asynchFetchUserDetails());
      setLoading(false);
    };
    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  // Function to update cart items
  const updateCartItems = (newItems) => {
    setCartItems(newItems);
  };

  return (
    <div className="w-full min-h-screen overflow-hidden bg-[#F2EDE7]">
      {!navSaw && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route
          path="/product"
          element={
            <Product
              cartItems={cartItems}
              setCartItems={setCartItems}
              updateCartItems={updateCartItems}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart cartItems={cartItems} updateCartItems={updateCartItems} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discover/:id"
          element={
            <DiscoverProduct
              cartItems={cartItems}
              updateCartItems={updateCartItems}
            />
          }
        />
        <Route
          path="/buy"
          element={
            <ProtectedRoute>
              {" "}
              <Buy cartItems={cartItems} />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/contect" element={<Contect />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
      </Routes>
    </div>
  );
};

export default App;
