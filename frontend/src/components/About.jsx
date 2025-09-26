import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const yellowDivRef = useRef();
  const redDivRef = useRef();
  const rightRef = useRef();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Kill any existing ScrollTriggers to avoid conflicts
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Set animation parameters based on screen size
    let yYellowValue, yRedValue, pinSetting, scrubValue;

    if (windowSize.width <= 768) {
      // Mobile settings
      yYellowValue = "-40%";
      yRedValue = "-80%";
      pinSetting = false;
      scrubValue = 0.5;
    } else if (windowSize.width <= 1024) {
      // Tablet settings
      yYellowValue = "-60%";
      yRedValue = "-120%";
      pinSetting = true;
      scrubValue = 1;
    } else {
      // Desktop settings
      yYellowValue = "-80%";
      yRedValue = "-150%";
      pinSetting = true;
      scrubValue = 1;
    }

    // First animation timeline
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#anime",
          start: "top top",
          end: "bottom bottom",
          pin: pinSetting,
          scrub: scrubValue,
        },
      })
      .to(yellowDivRef.current, {
        y: yYellowValue,
        duration: 1,
      })
      .to(redDivRef.current, {
        y: yRedValue,
        duration: 1,
      });

    // Second animation timeline
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#anime1",
          start: "top top",
          end: "bottom bottom",
          pin: pinSetting,
          scrub: scrubValue,
        },
      })
      .to(rightRef.current, {
        y: "0.1%",
      });

    // Refresh ScrollTrigger on resize
    return () => {
      ScrollTrigger.refresh();
    };
  }, [windowSize]);

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
    
    // Same validation as other contact forms
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
        "http://localhost:8000/contect/contectform",
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
    <>
      <div className="relative w-full lg:min-h-screen">
        <img
          className="w-full h-full object-cover"
          src="files/sofa.webp"
          alt="Sofa"
        />
        <div className="absolute top-[10%] md:top-[15%] left-[5%] md:left-[10%]">
          <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-home tracking-tight p-4 md:p-10 font-homeBold text-[#DD523F]">
            About SIèDO
          </h3>
        </div>
      </div>

      <div className="w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">
        <div
          id="anime1"
          className="w-full lg:w-[50%] min-h-screen bg-[#DD523F] overflow-hidden relative lg:sticky top-0"
        >
          <img
            ref={rightRef}
            src="files/chair2.png"
            alt="Chair"
            className="p-10 md:p-20 mt-36 object-cover w-full h-auto"
          />
          <div className="absolute top-28 p-4 md:p-10 left-4 md:left-10 text-white font-home text-lg md:text-2xl lg:text-3xl text-center font-bold">
            <p>IN WOOD, EVERY FIBER</p>
            <p>CONTAINS HISTORIES AND EMOTIONS</p>
          </div>
        </div>

        {/* Right-side div that scrolls */}
        <div id="anime" className="w-full lg:w-[50%] flex flex-col">
          <div className="w-full min-h-screen bg-[#FFFFFF]">
            <h3 className="font-home uppercase font-bold p-8 md:p-20 text-3xl md:text-5xl w-full text-[#DD523F]">
              DESIGN
            </h3>
            <p className="font-home uppercase font-bold p-4 md:p-10 text-base md:text-xl">
              Our expertise merges with architecture and design, creating
              international synergies from Europe to Asia and America.
              Specialized in the creation of contracts, our team collaborates
              with architects and designers to create unique products, from the
              first draft to the final production. Through the use of
              cutting-edge technologies, we create customized solutions that
              embody the perfection of detail. By offering 3D models and
              technical drawings, we facilitate design and visual integration,
              making each space a functional work of art.
            </p>
          </div>
          <div ref={yellowDivRef} className="w-full min-h-screen bg-[#F4F4F4]">
            <h3 className="font-home uppercase font-bold p-8 md:p-20 text-3xl md:text-5xl text-[#DD523F]">
              Upholstery
            </h3>
            <p className="font-home uppercase font-bold p-4 md:p-10 text-base md:text-xl">
              The art of upholstery, performed with meticulous attention by
              hand, embodies craftsmanship excellence and detail. We love to
              weave the elegance of traditional Italian techniques with
              contemporary touches of luxury, celebrating the fusion between
              past and present. The careful selection of fabrics, available in
              our showroom and within our catalog, reflects our commitment to
              the unceasing search for beauty and quality.
            </p>
          </div>
          <div ref={redDivRef} className="w-full min-h-screen bg-[#F2EDE7]">
            <h3 className="font-home uppercase font-bold p-8 md:p-20 text-3xl md:text-5xl text-[#DD523F]">
              LABORATORY
            </h3>
            <p className="font-home uppercase font-bold p-4 md:p-10 text-base md:text-xl">
              Precious woods adapt to every vision, transformed by advanced
              technologies into tailor-made creations. In each fiber, wood tells
              stories and emotions, combining design and nature in light
              harmony.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-red-500 flex items-center justify-center py-10">
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-4">
            A DOUBT?
          </h1>
          <h2 className="text-white text-xl md:text-2xl mb-8">
            As easy to ask on a Sièdo.
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  className="border-b-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white"
                  placeholder="Name"
                  onChange={handleChange}
                  value={formdata.name}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white">Surname</label>
                <input
                  type="text"
                  name="surname"
                  className="border-b-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white"
                  placeholder="Surname"
                  onChange={handleChange}
                  value={formdata.surname}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col md:col-span-1">
                <label className="text-white">Company</label>
                <input
                  type="text"
                  name="company"
                  className="border-b-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white"
                  placeholder="Company"
                  onChange={handleChange}
                  value={formdata.company}
                />
              </div>
              <div className="flex flex-col md:col-span-1">
                <label className="text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  className="border-b-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white"
                  placeholder="Email"
                  onChange={handleChange}
                  value={formdata.email}
                />
              </div>
              <div className="flex flex-col md:col-span-1">
                <label className="text-white">Telephone</label>
                <input
                  type="tel"
                  name="telephone"
                  className="border-b-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white"
                  placeholder="Telephone"
                  onChange={handleChange}
                  value={formdata.telephone}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-white">Message</label>
              <textarea
                className="border-2 border-white bg-transparent p-2 focus:outline-none focus:border-blue-400 text-white h-32 resize-none"
                placeholder="Message"
                name="message"
                onChange={handleChange}
                value={formdata.message}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 md:px-8 md:py-2 border-2 rounded-lg border-white text-white hover:bg-white hover:text-red-500 transition duration-300"
              >
                CONTACT US
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default About;
