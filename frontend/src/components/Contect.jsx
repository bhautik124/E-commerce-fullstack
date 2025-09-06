import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    try {
      const response = await axios.post(
        "https://e-commerce-fullstack-vkv8.onrender.com/contect/contectform",
        formdata,
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success("Form submitted successfully" , {
          position: "top-center",
          autoClose: 2000,
          theme : "dark"
        });
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
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again." , {
        position: "top-center",
        autoClose: 2000,
        theme : "dark"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3EF] flex flex-col items-center justify-between font-home">
      <ToastContainer />
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
