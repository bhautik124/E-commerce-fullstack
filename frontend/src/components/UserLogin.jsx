import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../store/reducers/userReducer";
import { useDispatch } from "react-redux";

const UserLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please enter email and password", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    try {
      const res = await axios.post(
        "https://e-commerce-fullstack-backend-0y06.onrender.com/user/loginUser",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 400) {
        toast.error("Invalid Credentials", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
        return;
      }

      if (res.status === 200) {
        // Save token
        document.cookie = `token=${res.data.token}`;

        // Update Redux store immediately
        dispatch(getUser(res.data.user));

        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });

        setTimeout(() => {
          navigate("/product");
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Invalid Credentials", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEBE5]">
      <div className="container mx-auto px-4 py-8">
        <ToastContainer />
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
