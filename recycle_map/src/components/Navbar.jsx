import React, { useEffect, useState } from "react";
import "../styles/style.css";

const Navbar = () => {
  const [addBackground, setAddBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const slice = document.querySelector(".hero-section");
      if (!slice) return;

      const sliceBottom = slice.offsetTop + slice.offsetHeight;

      if (window.scrollY >= sliceBottom - 80) {
        setAddBackground(true);
      } else {
        setAddBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${addBackground ? "scrolled" : ""}`}>
      <h1 className="logo">RecycleMap</h1>
      <nav>
        <a href="#home">Home</a>
        <a href="#map">Mapa</a>
        <a href="#about">Sobre Nosotros</a>
      </nav>
    </header>
  );
};

export default Navbar;
