const Slice = ({ slice, onClick, isSelected }) => {
  const handleClick = () => {
    onClick(slice);
  };

  return (
    <div className="hero-section">
        <h1 className="title-recycle2">Recycle map</h1>
      <h1 className="title-recycle">Tu punto de reciclaje mas cercano </h1>
    </div>
  );
}
export default Slice;