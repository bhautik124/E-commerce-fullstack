import React, { useState } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

const Contact = () => {
  const [formdata, setFormData] = useState({
    name: "",
    surname: "",
    company: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = [];
    
    if (!formdata.name || formdata.name.trim().length < 2) {
      validationErrors.push("Name must be at least 2 characters long");
    }
    if (!formdata.surname || formdata.surname.trim().length < 2) {
      validationErrors.push("Surname must be at least 2 characters long");
    }
    if (!formdata.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email)) {
      validationErrors.push("Please enter a valid email format");
    }
    if (!formdata.telephone || formdata.telephone.length < 10) {
      validationErrors.push("Please enter a valid phone number");
    }
    if (!formdata.message || formdata.message.trim().length < 10) {
      validationErrors.push("Message must be at least 10 characters long");
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => showErrorToast(error));
      return;
    }

    try {
      showInfoToast("Submitting form...");
      
      const response = await axios.post(
        "https://e-commerce-fullstack-backend-vevk.onrender.com/contect/contectform",
        {
          ...formdata,
          name: formdata.name.trim(),
          surname: formdata.surname.trim(),
          email: formdata.email.trim().toLowerCase(),
          telephone: formdata.telephone.trim(),
          company: formdata.company?.trim() || "",
          message: formdata.message.trim()
        },
        { withCredentials: true }
      );
      
      if (response.status === 201) {
        showSuccessToast("Thank you! Your message has been sent successfully");
        setFormData({
          name: "",
          surname: "",
          company: "",
          email: "",
          telephone: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            showErrorToast(data.message || "Invalid information provided");
            break;
          case 429:
            showErrorToast("Too many messages sent. Please try again later");
            break;
          case 500:
            showErrorToast("Server error. Please try again later");
            break;
          default:
            showErrorToast(data.message || "Failed to submit form");
        }
      } else if (error.request) {
        showErrorToast("Check your internet connection and try again");
      } else {
        showErrorToast("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3EF] flex flex-col items-center justify-between font-home">
      <div className="w-full max-w-2xl mx-auto p-8 mt-10 lg:mt-0">
        <h1 className="text-[#D94E3B] text-4xl font-semibold mb-4 text-center">
          CONTACT US
        </h1>
        <h2 className="text-[#D94E3B] text-2xl mb-8 text-center">
          ABC@GMAIL.COM
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600">Name</label>
              <input
                name="name"
                type="text"
                className="border-b-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700"
                placeholder="Name"
                onChange={handleChange}
                value={formdata.name}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600">Surname</label>
              <input
                name="surname"
                type="text"
                className="border-b-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700"
                placeholder="Surname"
                onChange={handleChange}
                value={formdata.surname}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600">Company</label>
              <input
                name="company"
                type="text"
                className="border-b-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700"
                placeholder="Company"
                onChange={handleChange}
                value={formdata.company}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                className="border-b-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700"
                placeholder="Email"
                onChange={handleChange}
                value={formdata.email}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600">Telephone</label>
              <input
                name="telephone"
                type="tel"
                className="border-b-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700"
                placeholder="Telephone"
                onChange={handleChange}
                value={formdata.telephone}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600">Message</label>
            <textarea
              className="border-2 border-[#D94E3B] bg-transparent p-2 focus:outline-none focus:border-[#D94E3B] text-gray-700 h-32 resize-none"
              name="message"
              placeholder="Message"
              onChange={handleChange}
              value={formdata.message}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-2 border-2 rounded-lg border-[#D94E3B] text-[#D94E3B] hover:bg-[#D94E3B] hover:text-white transition duration-300"
            >
              CONTACT US
            </button>
          </div>
        </form>
      </div>
      <footer className="w-full text-center text-gray-500 p-6">
        <div className="text-[#D94E3B] text-lg font-bold mb-4">
          <a href="mailto:abc@gmail.com">ABC@GMAIL.COM</a>
        </div>
        <div className="mb-4">
          <a href="/" className="mx-4 text-gray-500">
            Home
          </a>
          <a href="/product" className="mx-4 text-gray-500">
            Products
          </a>
          <a href="/about" className="mx-4 text-gray-500">
            About
          </a>
        </div>
        <p className="text-sm">
          ©2024 Sièdo
          <br />
          abb-124 xyz soc.
          <br />
          Surat | Gujarat
        </p>
      </footer>
    </div>
  );
};

export default Contact;
