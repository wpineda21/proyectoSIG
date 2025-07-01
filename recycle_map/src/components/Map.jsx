import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './Map.css';

// Solución para los iconos por defecto
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Componente para centrar el mapa cuando cambia la ubicación
function CenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const Map = () => {
  const [puntos, setPuntos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [departamento, setDepartamento] = useState('');
  const [radio, setRadio] = useState(20000);
  const [usarUbicacion, setUsarUbicacion] = useState(false);
  const [coordenadas, setCoordenadas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('simple'); // 'simple' o 'multiple'
  const [error, setError] = useState('');
  const mapRef = useRef();

  // Icono personalizado para la ubicación del usuario
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  // Obtener tipos y departamentos disponibles
  useEffect(() => {
    setLoading(true);
    // Obtener tipos de residuo
    fetch('http://localhost:3000/api/puntos/tipos-disponibles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTipos(data.data);
      })
      .catch(err => setError('Error al cargar tipos de residuo'));

    // Obtener departamentos
    fetch('http://localhost:3000/api/puntos/departamentos')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDepartamentos(data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar departamentos');
        setLoading(false);
      });
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (usarUbicacion) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setCoordenadas(userLocation);
        },
        err => {
          setError("No se pudo obtener la ubicación: " + err.message);
          setUsarUbicacion(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000
        }
      );
    } else {
      setCoordenadas(null);
    }
  }, [usarUbicacion]);

  // Manejar selección de tipos
  const handleTipoChange = (tipo) => {
    if (activeTab === 'simple') {
      setSelectedTipos([tipo]);
    } else {
      if (selectedTipos.includes(tipo)) {
        setSelectedTipos(selectedTipos.filter(t => t !== tipo));
      } else {
        setSelectedTipos([...selectedTipos, tipo]);
      }
    }
  };

  // Obtener puntos según filtros
  useEffect(() => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    let url = 'http://localhost:3000/api/puntos';
    let queryParams = [];
    
    if (selectedTipos.length > 0) {
      // Convertir tipos seleccionados a parámetro de URL
      const tiposParam = selectedTipos.map(t => encodeURIComponent(t)).join(',');
      
      if (usarUbicacion && coordenadas) {
        // Usamos el nuevo endpoint para múltiples tipos con ubicación
        url = `http://localhost:3000/api/puntos/cercanos-multiples-tipos?lat=${coordenadas.lat}&lng=${coordenadas.lng}&tipos=${tiposParam}&radio=${radio}`;
      } else {
        // Para búsqueda sin ubicación
        url = `http://localhost:3000/api/puntos/tipos-multiples?tipos=${tiposParam}`;
        
        // Añadir departamento si está seleccionado
        if (departamento) {
          url += `&departamento=${encodeURIComponent(departamento)}`;
        }
      }
    } else if (usarUbicacion && coordenadas) {
      // Ubicación sin tipos seleccionados
      url = `http://localhost:3000/api/puntos/cercanos?lat=${coordenadas.lat}&lng=${coordenadas.lng}&radio=${radio}`;
    } else if (departamento) {
      // Solo departamento
      url = `http://localhost:3000/api/puntos/buscar-avanzada?departamento=${encodeURIComponent(departamento)}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(data => {
        if (data.features) {
          setPuntos(data.features);
        } else {
          setPuntos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar puntos: ' + err.message);
        setLoading(false);
      });
  }, [selectedTipos, departamento, coordenadas, radio, usarUbicacion, activeTab]);

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedTipos([]);
    setDepartamento('');
    setUsarUbicacion(false);
    setRadio(20000);
  };

  return (
    <div className="map-page-container">
      <h1 className="title-cards-map">Mapa de Reciclaje</h1>

      <div className="filters">
        {/* Tabs para cambiar entre filtro simple y múltiple */}
        <div className="filter-tabs">
          <button 
            className={`tab-btn ${activeTab === 'simple' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('simple');
              // Si hay múltiples seleccionados, mantén solo el primero
              if (selectedTipos.length > 1) {
                setSelectedTipos([selectedTipos[0]]);
              }
            }}
          >
            Filtro Simple
          </button>
          <button 
            className={`tab-btn ${activeTab === 'multiple' ? 'active' : ''}`}
            onClick={() => setActiveTab('multiple')}
          >
            Filtro Múltiple
          </button>
          
          <button className="clear-btn" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        </div>

        {/* Contenedor de tipos */}
        <div className="tipos-container">
          <h3>Tipos de Residuo:</h3>
          <div className="tipos-grid">
            {tipos.map((tipo, i) => (
              <div 
                key={i} 
                className={`tipo-card ${selectedTipos.includes(tipo) ? 'selected' : ''}`}
                onClick={() => handleTipoChange(tipo)}
              >
                {tipo}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>
            Departamento:
            <select 
              value={departamento} 
              onChange={(e) => setDepartamento(e.target.value)}
            >
              <option value="">Todos</option>
              {departamentos.map((depto, i) => (
                <option key={i} value={depto}>{depto}</option>
              ))}
            </select>
          </label>

          <div className="toggle-wrapper">
            <div className="toggle-label">Habilitar mi posición</div>
            <div className="toggle-switch-container">
              <span className={`toggle-status ${!usarUbicacion ? 'active' : ''}`}>OFF</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={usarUbicacion}
                  onChange={() => setUsarUbicacion(!usarUbicacion)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className={`toggle-status ${usarUbicacion ? 'active' : ''}`}>ON</span>
            </div>
          </div>

          {usarUbicacion && (
            <label>
              Radio (metros):
              <input
                type="number"
                value={radio}
                min={1000}
                step={1000}
                onChange={(e) => setRadio(Number(e.target.value))}
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Cargando puntos de reciclaje...</p>
        </div>
      )}

      {!loading && puntos.length === 0 && !error && (
        <div className="no-results">
          <p>No se encontraron puntos con los filtros seleccionados</p>
          <button onClick={clearFilters}>Limpiar filtros</button>
        </div>
      )}

      <div className="map-container">
        <MapContainer 
          center={[13.7, -89.2]} 
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {/* Centrar mapa cuando cambia la ubicación */}
          {coordenadas && <CenterMap center={[coordenadas.lat, coordenadas.lng]} />}
          
          {/* Marcador de tu ubicación */}
          {coordenadas && (
            <>
              <Marker 
                position={[coordenadas.lat, coordenadas.lng]} 
                icon={userIcon}
              >
                <Popup>¡Estás aquí!</Popup>
              </Marker>
              <Circle
                center={[coordenadas.lat, coordenadas.lng]}
                radius={radio}
                color="red"
                fillColor="#f03"
                fillOpacity={0.1}
              />
            </>
          )}
          
          {/* Marcadores de puntos de reciclaje */}
          {puntos.map((p) => (
            <Marker
              key={p.properties.id}
              position={[p.geometry.coordinates[1], p.geometry.coordinates[0]]}
            >
              <Popup>
                <div className="popup-content">
                  <strong>{p.properties.nombre}</strong><br />
                  <small>{p.properties.direccion}</small><br />
                  <div className="popup-detail">
                    <span className="popup-label">Tipo:</span> {p.properties.tipo_residuo}
                  </div>
                  {p.properties.horario && (
                    <div className="popup-detail">
                      <span className="popup-label">Horario:</span> {p.properties.horario}
                    </div>
                  )}
                  {p.properties.distancia_km !== undefined && (
                    <div className="popup-detail">
                      <span className="popup-label">Distancia:</span> <strong>{p.properties.distancia_km.toFixed(2)} km</strong>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="results-info">
        <p>Mostrando <strong>{puntos.length}</strong> puntos de reciclaje</p>
        <p>Filtros aplicados: 
          {selectedTipos.length > 0 && ` Tipos: ${selectedTipos.join(', ')}`}
          {departamento && ` Departamento: ${departamento}`}
          {usarUbicacion && ` Radio: ${radio} metros`}
        </p>
      </div>
    </div>
  );
};

export default Map;