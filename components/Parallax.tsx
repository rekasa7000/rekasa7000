"use client";

import React, { useEffect, useState } from "react";

const Parallax: React.FC<{
  backgroundImage: string;
  children: React.ReactNode;
}> = ({ backgroundImage, children }) => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        transform: `translateY(${offsetY * 0.025}px)`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default Parallax;
