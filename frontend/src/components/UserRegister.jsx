import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { asynchFetchUserDetails } from "../store/actions/FetchUserApi";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateInputs = () => {
    const errors = [];

    if (!username || username.trim().length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email format");
    }

    if (!phone || phone.length < 10) {
      errors.push("Phone number must be at least 10 digits long");
    }

    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
      errors.forEach(error => showErrorToast(error));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    try {
      showInfoToast("Creating account...");
      
      const res = await axios.post(
        "http://localhost:8000/user/createUser",
        { 
          username: username.trim(), 
          email: email.trim().toLowerCase(), 
          phone: phone.trim(), 
          password 
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        // Save token
        if (res.data.token) {
          document.cookie = `token=${res.data.token}`;
        }

        // Update Redux store immediately
        dispatch(getUser(res.data.user));

        showSuccessToast(`Welcome ${res.data.user.username}! Account created successfully`);

        // Clear form
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");

        setTimeout(() => {
          navigate("/product");
        }, 1500);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response) {
        const { status, data } = err.response;
        
        switch (status) {
          case 400:
            if (data.message.includes("email")) {
              showErrorToast("This email is already registered");
            } else if (data.message.includes("phone")) {
              showErrorToast("This phone number is already registered");
            } else {
              showErrorToast(data.message || "Invalid information provided");
            }
            break;
          case 409:
            showErrorToast("This email or phone number is already in use");
            break;
          case 500:
            showErrorToast("Server error. Please try again later");
            break;
          default:
            showErrorToast(data.message || "Failed to create account");
        }
      } else if (err.request) {
        showErrorToast("Check your internet connection and try again");
      } else {
        showErrorToast("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEBE5]">
      <div className="py-8 md:py-0 flex items-center justify-center min-h-[80vh] text-[#DD523F] font-home text-lg md:text-xl mt-10">
        <form
          onSubmit={handleSubmit}
          className="w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/4 max-w-md mx-auto px-4 md:px-0"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-center md:text-left">
            Register
          </h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-b border-l border-r p-3 md:p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-4 md:mb-5 rounded-md md:rounded-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-l border-r p-3 md:p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-4 md:mb-5 rounded-md md:rounded-none"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b border-l border-r p-3 md:p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-4 md:mb-5 rounded-md md:rounded-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-l border-r p-3 md:p-2 border-[#D94E3B] bg-transparent focus:outline-none w-full mb-8 md:mb-10 rounded-md md:rounded-none"
          />
          <button
            type="submit"
            className="w-full border border-[#DD523F] text-[#DD523F] rounded-full px-4 py-3 md:py-2 hover:bg-[#DD523F] hover:text-white transition duration-300 text-lg md:text-base"
          >
            Register
          </button>
          <p className="mt-4 text-center md:text-left">
            Already have an account?{" "}
            <Link to="/login" className="text-[#DD523F] underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          input::placeholder {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        @media (max-width: 768px) {
          .font-home {
            font-size: 1rem; /* Adjust base font size for mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default UserRegister;
