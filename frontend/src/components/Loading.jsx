import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loading = () => {
  let animeRef = useRef();
  let textAnimeRef = useRef();

  useEffect(() => {
    var tl = gsap.timeline();

    tl.from(textAnimeRef.current, {
      y: "100%",
      duration: 0.5,
      delay: 0.5,
      ease: "power3.out",
    });

    tl.to(
      textAnimeRef.current,
      {
        y: "-100%",
        delay: 0.6,
        duration: 1,
        ease: "power3.out",
      },
      "a1"
    );

    tl.to(
      animeRef.current,
      {
        y: "-100%",
        delay: 0.7,
        duration: 0.6,
        ease: "sine.in",
      },
      "a1"
    );
  }, []);

  return (
    <div
      ref={animeRef}
      className="w-full h-screen bg-[#DD523F] overflow-hidden fixed top-0 left-0 z-50"
    >
      <div className="w-full md:w-[50%] h-[30%] md:h-[40%] absolute bottom-0 left-0 overflow-hidden flex items-end">
        <h3
          ref={textAnimeRef}
          className="text-[25vw] md:text-[15vw] lg:text-[15vw] p-4 md:p-6 lg:p-8 xl:p-10 opacity-1 text-[#F2EDE7] font-menuBold absolute bottom-[-5%] left-0"
        >
          Siedo
        </h3>
      </div>
    </div>
  );
};

export default Loading;
