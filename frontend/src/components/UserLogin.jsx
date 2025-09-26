import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { asynchFetchUserDetails } from "../store/actions/FetchUserApi";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

const UserLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      showErrorToast("Please enter email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErrorToast("Please enter a valid email format");
      return;
    }

    try {
      showInfoToast("Logging in...");
      
      const res = await axios.post(
        "http://localhost:8000/user/loginUser",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        showSuccessToast(`Welcome ${res.data.user.username}! Login successful`);
        dispatch(getUser(res.data.user));
        
        setTimeout(() => {
          navigate("/product");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            showErrorToast(data.message || "User does not exist");
            break;
          case 401:
            showErrorToast("Incorrect password! Please enter the correct password");
            break;
          case 404:
            showErrorToast("This email is not registered");
            break;
          case 429:
            showErrorToast("Too many attempts! Please try again later");
            break;
          case 500:
            showErrorToast("Server error. Please try again later");
            break;
          default:
            showErrorToast(data.message || "Login failed. Please try again");
        }
      } else if (error.request) {
        showErrorToast("Check your internet connection and try again");
      } else {
        showErrorToast("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEBE5]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8 lg:py-0 lg:min-h-[70vh] mt-24">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 md:p-8 mx-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-center text-[#D94E3B]">
              Login
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-l border-r p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-4 md:mb-5 text-base md:text-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-l border-r p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-6 md:mb-10 text-base md:text-lg"
            />

            <button className="w-full border border-[#DD523F] text-[#DD523F] rounded-full px-4 py-2 hover:bg-[#DD523F] hover:text-white transition duration-300 text-base md:text-lg">
              Login
            </button>
            <p className="mt-4 text-center md:text-left text-sm md:text-base">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#DD523F] underline">
                Register an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
