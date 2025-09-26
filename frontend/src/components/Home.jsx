import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toast.jsx";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Select the h3 element and wrap each word in a span
    const h3Element = document.querySelector("#animated-text");
    if (h3Element) {
      const words = h3Element.textContent.split(" ");
      h3Element.innerHTML = words
        .map((word) => `<span>${word}</span>`)
        .join(" ");

      // Apply GSAP animation to each span
      gsap.to("#animated-text span", {
        scrollTrigger: {
          trigger: "#section-2",
          start: "top top", // Start when Section 2 reaches the top
          end: "bottom top", // End when Section 2 finishes scrolling
          pin: true, // Pin Section 2 during the animation
          scrub: 0.5,
          onEnter: () => {
            // Allow scrolling, we need scroll for animation
            document.body.style.overflow = "auto";
          },
          onLeave: () => {
            // Re-enable scrolling after animation
            document.body.style.overflow = "auto";
          },
        },
        stagger: 0.2,
        color: "black",
        ease: "power1.inOut",
      });
    }
  }, []);

  const imgRefs = useRef([]);

  const images = [
    {
      className:
        "w-[40%] md:w-[25%] h-[20%] md:h-[35%] absolute left-[10%] md:left-[20%] top-[55%]",
      src: "https://images.unsplash.com/photo-1489269637500-aa0e75768394?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className:
        "w-[40%] md:w-[20%] h-[15%] md:h-[25%] absolute left-[20%] md:left-[30%] top-[20%]",
      src: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYWlyfGVufDB8fDB8fHww",
    },
    // {
    //   className:
    //     "w-[10%] md:w-[15%] h-[10%] md:h-[15%] absolute left-[45%] md:left-[55%] top-[30%]",
    //   src: "https://images.unsplash.com/photo-1484301548518-d0e0a5db0fc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNoYWlyfGVufDB8fDB8fHww",
    // },
    {
      className:
        "w-[30%] md:w-[25%] h-[15%] md:h-[25%] absolute left-[55%] md:left-[65%] top-[50%]",
      src: "https://images.unsplash.com/photo-1441984065492-ab5a050140d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className: "w-[0%] h-[0%] absolute",
      src: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className: "w-[0%] h-[0%] absolute left-[40%] md:left-[50%] top-[40%]",
      src: "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className:
        "w-[5%] md:w-[8%] h-[5%] md:h-[8%] absolute left-[45%] md:left-[53%] top-[30%] opacity-0",
      src: "https://plus.unsplash.com/premium_photo-1705479742912-79af0f068803?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className:
        "w-[20%] md:w-[8%] h-[5%] md:h-[8%] absolute left-[50%] md:left-[50%] top-[30%] opacity-0",
      src: "https://plus.unsplash.com/premium_photo-1681558314333-fb036f1df542?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className:
        "w-[33%] md:w-[5%] h-[5%] md:h-[8%] absolute left-[55%] md:left-[50%] top-[55%] md:top-[45%] opacity-0",
      src: "https://plus.unsplash.com/premium_photo-1668046135207-061641d36b13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGNoYWlyfGVufDB8fDB8fHww",
    },
    {
      className:
        "w-[30%] md:w-[5%] h-[3%] md:h-[5%] absolute left-[35%] md:left-[35%] top-[50%] opacity-0",
      src: "https://images.unsplash.com/photo-1554941829-fcef7b298d5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGNoYWlyfGVufDB8fDB8fHww",
    },
  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#helloji",
        start: "top top",
        end: "bottom top",
        scrub: 4,
        pin: true,
        ease: "power4.inOut",
      },
    });

    const animations = [
      {
        ref: imgRefs.current[0],
        x: isMobile ? "-150%" : "-200%",
        y: isMobile ? "40%" : "50%",
        height: isMobile ? "30%" : "40%",
        width: isMobile ? "25%" : "30%",
        duration: 3,
        delay: "a1",
      },
      {
        ref: imgRefs.current[1],
        x: isMobile ? "-200%" : "-300%",
        y: isMobile ? "-90%" : "-110%",
        height: isMobile ? "25%" : "35%",
        width: isMobile ? "20%" : "25%",
        duration: 3,
        delay: "a1",
      },
      {
        ref: imgRefs.current[2],
        x: isMobile ? "250%" : "150%",
        y: isMobile ? "-190%" : "-200%",
        height: isMobile ? "20%" : "30%",
        width: isMobile ? "20%" : "25%",
        duration: 3,
        delay: "a1+=1",
      },
      {
        ref: imgRefs.current[3],
        x: isMobile ? "150%" : "200%",
        y: isMobile ? "150%" : "200%",
        height: isMobile ? "45%" : "60%",
        width: isMobile ? "50%" : "65%",
        duration: 4,
        delay: "a1+=2",
      },
      {
        ref: imgRefs.current[4],
        x: isMobile ? "-200%" : "-300%",
        y: isMobile ? "300%" : "400%",
        height: isMobile ? "80%" : "100%",
        width: isMobile ? "85%" : "105%",
        duration: 7,
        delay: "a1+=2.5",
      },
      {
        ref: imgRefs.current[5],
        x: isMobile ? "150%" : "200%",
        y: isMobile ? "-150%" : "-200%",
        height: isMobile ? "35%" : "45%",
        width: isMobile ? "30%" : "35%",
        duration: 8,
        delay: "a1+=3",
      },
      {
        ref: imgRefs.current[6],
        y: isMobile ? "-30%" : "-40%",
        height: isMobile ? "30%" : "45%",
        width: isMobile ? "40%" : "35%",
        duration: 5,
        opacity: 1,
        delay: "a1+=3.5",
      },
      {
        ref: imgRefs.current[7],
        x: isMobile ? "-60%" : "-80%",
        y: isMobile ? "40%" : "50%",
        height: isMobile ? "20%" : "35%",
        width: isMobile ? "45%" : "25%",
        duration: 5,
        opacity: 1,
        delay: "a1+=4",
      },
      {
        ref: imgRefs.current[8],
        x: isMobile ? "-100%" : "-130%",
        y: isMobile ? "-90%" : "-120%",
        height: isMobile ? "25%" : "35%",
        width: isMobile ? "30%" : "25%",
        duration: 5,
        opacity: 1,
        delay: "a1+=4.5",
      },
      {
        ref: imgRefs.current[9],
        x: isMobile ? "5%" : "10%",
        y: isMobile ? "25%" : "30%",
        height: isMobile ? "25%" : "35%",
        width: isMobile ? "20%" : "25%",
        duration: 5,
        opacity: 1,
        delay: "a1+=5",
      },
    ];

    animations.forEach((anim) => {
      tl1.to(
        anim.ref,
        {
          x: anim.x,
          y: anim.y,
          height: anim.height,
          width: anim.width,
          duration: anim.duration,
          opacity: anim.opacity,
        },
        anim.delay
      );
    });
  }, []);

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
    
    // Same validation as Contact component
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
    <div className="w-full min-h-screen bg-[#F2EDE7]">
      {/* Section 1: Video background */}
      <div className="w-full h-screen relative">
        <div className="w-full h-[70%] md:h-[80%] overflow-hidden mt-10 md:mt-0">
          <video
            src="files/video.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
        </div>
        <div className="w-full h-[30%] md:h-[20%] flex items-center justify-center px-4">
          <h3 className="text-[#DD523F] text-[8vw] font-black tracking-tight uppercase md:font-bold text-center">
            Italian way of seating
          </h3>
        </div>
      </div>

      {/* Section 2: Animated text and button */}
      <div
        id="section-2"
        className="w-full h-screen relative bg-[#F2EDE7] flex items-center justify-center"
      >
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 px-4">
          <h3
            id="animated-text"
            className="text-xl md:text-3xl lg:text-4xl xl:text-6xl tracking-tight text-[#999999] font-home uppercase font-bold text-center p-4 md:p-10"
          >
            Sièdo tells the essence of Italian comfort, a history of trust and
            quality that sinks in roots in a family history and experience deep
            and consolidated in the sector of sessions. Every creation is a
            dialogue between art craftsmanship and contemporaneity.
          </h3>
          <div>
            <Link to="about">
              <button className="border-2 border-solid px-4 py-2 md:px-6 md:py-3 rounded-lg uppercase font-bold text-home border-[#DD523F] hover:bg-[#DD523F] hover:text-white transition duration-300">
                About us
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full h-screen relative">
        <img
          src="files/sofa.webp"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute top-[-10%] md:top-[-20%] left-0 w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 px-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-[#DD523F] tracking-tight font-home uppercase">
            See our <br /> collections!
          </h3>
          <Link to="collection">
            <button className="border-2 text-[#DD523F] border-solid px-6 py-4 md:px-8 md:py-5 rounded-lg uppercase font-bold font-home border-[#DD523F] hover:bg-[#DD523F] hover:text-white transition duration-300">
              Explore
            </button>
          </Link>
        </div>
      </div>

      <div className="w-full min-h-screen bg-[#F2EDE7]">
        <div
          id="helloji"
          className="w-full h-screen relative flex items-center justify-center overflow-hidden"
        >
          {images.map((img, index) => (
            <div
              ref={(el) => {
                imgRefs.current[index] = el;
              }}
              key={index}
              className={img.className}
            >
              <img
                className="w-full h-full object-cover"
                src={img.src}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-screen bg-red-500 flex items-center justify-center py-10">
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            A DOUBT?
          </h1>
          <h2 className="text-white text-lg md:text-xl lg:text-2xl mb-6 md:mb-8">
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
    </div>
  );
};

export default Home;
