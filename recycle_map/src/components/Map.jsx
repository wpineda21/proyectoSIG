import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import './Map.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const Map = () => {
  const [puntos, setPuntos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [radio, setRadio] = useState(20000);
  const [usarUbicacion, setUsarUbicacion] = useState(false);
  const [coordenadas, setCoordenadas] = useState(null);

  // Obtener tipos disponibles
  useEffect(() => {
    fetch('http://localhost:3000/api/puntos/tipos-disponibles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTipos(data.data);
      });
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (usarUbicacion) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoordenadas({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => {
          alert("No se pudo obtener la ubicación.");
          setUsarUbicacion(false);
        }
      );
    } else {
      setCoordenadas(null);
    }
  }, [usarUbicacion]);

  // Obtener puntos según filtros
  useEffect(() => {
    let url = 'http://localhost:3000/api/puntos';

    if (usarUbicacion && coordenadas && tipoResiduo) {
      url = `http://localhost:3000/api/puntos/cercanos-por-tipo?lat=${coordenadas.lat}&lng=${coordenadas.lng}&tipo=${encodeURIComponent(tipoResiduo)}&radio=${radio}`;
    } else if (tipoResiduo || departamento) {
      const params = [];
      if (tipoResiduo) params.push(`tipo_residuo=${encodeURIComponent(tipoResiduo)}`);
      if (departamento) params.push(`departamento=${encodeURIComponent(departamento)}`);
      url = `http://localhost:3000/api/puntos/buscar-avanzada?${params.join('&')}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.features) setPuntos(data.features);
        else setPuntos([]);
      });
  }, [tipoResiduo, departamento, coordenadas, radio]);

  return (
    <>
      <h1 className="title-cards-map">Mapa de Reciclaje</h1>

      <div className="filters">
        <label>
          Tipo de Residuo:
          <select value={tipoResiduo} onChange={(e) => setTipoResiduo(e.target.value)}>
            <option value="">Todos</option>
            {tipos.map((tipo, i) => (
              <option key={i} value={tipo}>{tipo}</option>
            ))}
          </select>
        </label>

        <label>
          Departamento:
          <input
            type="text"
            placeholder="Ej. San Salvador"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={usarUbicacion}
            onChange={() => setUsarUbicacion(!usarUbicacion)}
          />
          Usar mi ubicación
        </label>

        {usarUbicacion && (
          <label>
            Radio (metros):
            <input
              type="number"
              value={radio}
              min={1000}
              step={1000}
              onChange={(e) => setRadio(e.target.value)}
            />
          </label>
        )}
      </div>

      <div className="map-container">
        <MapContainer center={[13.7, -89.2]} zoom={8} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          {puntos.map((p) => (
            <Marker
              key={p.properties.id}
              position={[p.geometry.coordinates[1], p.geometry.coordinates[0]]}
            >
              <Popup>
                <strong>{p.properties.nombre}</strong><br />
                <small>{p.properties.direccion}</small><br />
                Tipo: {p.properties.tipo_residuo}<br />
                {p.properties.horario && <div>Horario: {p.properties.horario}</div>}
                {p.properties.distancia_km !== undefined && (
                  <div><strong>{p.properties.distancia_km.toFixed(2)} km</strong></div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
