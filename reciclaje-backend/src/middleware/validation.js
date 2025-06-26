const validateCoordinates = (req, res, next) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitud y longitud son requeridas'
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      message: 'Coordenadas deben ser números válidos'
    });
  }

  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({
      success: false,
      message: 'Latitud debe estar entre -90 y 90'
    });
  }

  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({
      success: false,
      message: 'Longitud debe estar entre -180 y 180'
    });
  }

  next();
};

module.exports = { validateCoordinates };