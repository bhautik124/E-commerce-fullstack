import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "../store/reducers/userReducer";

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateInputs = () => {
    if (!username || !email || !phone || !password) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/user/createUser",
        { username, email, phone, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        // Save token
        document.cookie = `token=${res.data.token}`;

        // Update Redux store immediately
        dispatch(getUser(res.data.user));

        toast.success("User registration successful", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });

        setTimeout(() => {
          navigate("/product");
        }, 1000);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEBE5]">
      <ToastContainer />
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
