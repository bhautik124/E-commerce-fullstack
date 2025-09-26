import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Collection = () => {
  let imgRef = useRef();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Function to check if all images are loaded
  const checkImagesLoaded = () => {
    const images = imgRef.current.querySelectorAll("img");
    let loadedCount = 0;

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true); // Set to true when all images are loaded
          }
        };
      }
    });

    if (loadedCount === images.length) {
      setImagesLoaded(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if images are loaded
    checkImagesLoaded();
  }, []);

  useEffect(() => {
    if (imagesLoaded) {
      let totalWidth = imgRef.current.scrollWidth - imgRef.current.clientWidth;

      gsap.to(imgRef.current, {
        x: -totalWidth, // Move horizontally based on the total width of images
        ease: "none",
        scrollTrigger: {
          trigger: "#main",
          pin: true,
          scrub: 1,
          end: () => `+=${imgRef.current.scrollWidth}`, // Adjust scroll distance based on content width
        },
      });
    }
  }, [imagesLoaded]);

  return (
    <div className="w-full min-h-screen bg-[#F2EDE7]">
      {/* Outer wrapper for horizontal scroll */}
      <div
        id="main"
        className="w-full h-screen p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden mt-10 lg:mt-0"
      >
        <div>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl p-3 sm:p-4 md:p-5 tracking-tight font-home font-homeBold text-[#DD523F]">
            Explore all collection
          </h3>
        </div>
        <div
          ref={imgRef}
          className="flex flex-nowrap items-center mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
        >
          {/* Image containers */}
          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://plus.unsplash.com/premium_photo-1683133939183-edd5476e6200?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNoYWlyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1484301548518-d0e0a5db0fc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNoYWlyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1441984065492-ab5a050140d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNoYWilyfGVufDB8fDB8fHww"
              alt=""
            />
          </div>

          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://plus.unsplash.com/premium_photo-1683140513388-4344c8fc2778?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGNvZmZlJTIwdGFibGV8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
          </div>

          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://plus.unsplash.com/premium_photo-1661765778256-169bf5e561a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29mYXxlbnwwfHwwfHx8MA%3D%3D"
              alt=""
            />
          </div>

          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[35%] h-[40vh] sm:h-[45vh] md:h-[50%] bg-green-500 rounded-lg flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://plus.unsplash.com/premium_photo-1681046751108-a516bea00570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c29mYXxlbnwwfHwwfHx8MA%3D%3D"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="w-full h-auto py-10 sm:py-12 md:py-16 lg:py-20 mb-10 flex flex-col items-center justify-center px-4">
        <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl p-3 sm:p-4 md:p-5 tracking-tighter font-home font-homeBold text-[#DD523F] uppercase text-center">
          get it now!
        </h3>
        <Link to="/product">
          <button className="border border-[#DD523F] text-lg sm:text-xl md:text-2xl lg:text-3xl font-home font-homeBold text-[#DD523F] rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-4 hover:bg-[#DD523F] hover:text-white transition-colors duration-300 mt-4 sm:mt-6">
            start shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Collection;
