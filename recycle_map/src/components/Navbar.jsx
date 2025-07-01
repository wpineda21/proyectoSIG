import React, { useEffect, useState } from "react";
import "../styles/style.css";

const Navbar = () => {
  const [addBackground, setAddBackground] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      // Cerrar el menú al cambiar a pantalla grande
      if (window.innerWidth >= 600) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`navbar ${addBackground ? "scrolled" : ""}`}>
      <h1 className="logo">RecycleMap</h1>
      
      {/* Menú Hamburguesa solo en móvil */}
      {isMobile && (
        <div 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </div>
      )}
      
      <nav className={`${isMenuOpen ? "active" : ""}`}>
        <a href="#home" onClick={() => isMobile && setIsMenuOpen(false)}>Home</a>
        <a href="#map" onClick={() => isMobile && setIsMenuOpen(false)}>Mapa</a>
        <a href="#about" onClick={() => isMobile && setIsMenuOpen(false)}>Sobre Nosotros</a>
      </nav>
    </header>
  );
};

export default Navbar;