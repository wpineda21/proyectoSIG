import React from "react";
import "../styles/style.css";

const Slice = ({ slice, onClick, isSelected }) => {
  const handleClick = () => {
    onClick(slice);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="title-recycle2">Recycle map</h1>
        <h2 className="title-recycle">Tu punto de reciclaje más cercano</h2>
      </div>
    </div>
  );
};

export default Slice;