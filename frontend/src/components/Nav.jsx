import React, { useRef, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import Loading from "./Loading";

const Nav = () => {
  const menuRef = useRef();
  const starRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const menuStartAnimation = () => {
    // Responsive menu width based on screen size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let menuWidth = "40%"; // Default for desktop
    if (isMobile) {
      menuWidth = "100%";
    } else if (isTablet) {
      menuWidth = "60%";
    }

    gsap.to(menuRef.current, {
      duration: 0.5,
      width: menuWidth,
      height: "100%",
      opacity: 1,
      display: "flex",
      ease: "expo.inOut",
    });
  };

  const menuEndAnimation = () => {
    gsap.to(menuRef.current, {
      duration: 0.3,
      width: "0",
      height: "0",
      opacity: 0,
      display: "flex",
      onComplete: () => {
        menuRef.current.style.display = "none";
      },
    });
  };

  const starrotate = () => {
    gsap.to(starRef.current, {
      duration: 0.3,
      delay: 0.1,
      rotation: "+=90",
    });
  };

  const handleLoading = () => {
    setIsLoading(true);
    menuEndAnimation();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="w-full z-[100]">
      {isLoading && <Loading />}
      <div>
        <h3
          className="p-3 sm:p-5 text-2xl sm:text-3xl md:text-4xl font-bold top-0 right-0 absolute flex gap-1 sm:gap-2 cursor-pointer text-[#DD523F] z-[100]"
          onMouseEnter={menuStartAnimation}
        >
          <span className="mt-0.5 sm:mt-1 text-[#DD523F] text-xl sm:text-2xl md:text-3xl">
            <CgMenuRightAlt />
          </span>
          <span className="text-[#DD523F] font-menu">Menu</span>
        </h3>
      </div>
      <div
        ref={menuRef}
        onMouseLeave={menuEndAnimation}
        style={{ width: "0%", height: "0%", opacity: 0, overflow: "hidden" }}
        className="box bg-[#DD523F] absolute top-0 right-0 rounded-lg flex flex-col font-[#F2EDE7] items-center justify-center z-[100]"
      >
        {/* Star Image - Responsive positioning and sizing */}
        <div className="w-[25%] sm:w-[30%] md:w-[35%] lg:w-[40%] h-[15%] sm:h-[20%] md:h-[30%] lg:h-[40%] left-2 sm:left-4 lg:left-0 top-2 sm:top-4 lg:top-0 p-1 sm:p-2 absolute">
          <img
            ref={starRef}
            className="w-full h-full object-cover mt-[-10%] sm:mt-[-20%] lg:mt-[-30%]"
            src="files/1.png"
            alt="Image"
          />
        </div>

        {/* Navigation Links - Responsive spacing and text sizes */}
        <div className="w-full flex items-center justify-center mt-[15%] sm:mt-[20%] lg:mt-[25%]">
          <NavLink to="/">
            <h3
              onClick={handleLoading}
              onMouseEnter={starrotate}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl tracking-tighter font-menu text-[#F2EDE7] px-4 py-2"
            >
              Home
            </h3>
          </NavLink>
        </div>

        <div className="w-full flex items-center justify-center">
          <NavLink to="/about">
            <h3
              onClick={handleLoading}
              onMouseEnter={starrotate}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl tracking-tighter font-menu text-[#F2EDE7] px-4 py-2"
            >
              About
            </h3>
          </NavLink>
        </div>

        <div className="w-full flex items-center justify-center">
          <NavLink to="/product">
            <h3
              onClick={handleLoading}
              onMouseEnter={starrotate}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl tracking-tighter font-menu text-[#F2EDE7] px-4 py-2"
            >
              Product
            </h3>
          </NavLink>
        </div>

        <div className="w-full flex items-center justify-center">
          <NavLink to="/contect">
            <h3
              onClick={handleLoading}
              onMouseEnter={starrotate}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl tracking-tighter font-menu text-[#F2EDE7] px-4 py-2"
            >
              Contact
            </h3>
          </NavLink>
        </div>

        <div className="w-full flex items-center justify-center">
          <NavLink to="/login">
            <h3
              onClick={handleLoading}
              onMouseEnter={starrotate}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-8xl tracking-tighter font-menu text-[#F2EDE7] px-4 py-2"
            >
              User Login
            </h3>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Nav;
