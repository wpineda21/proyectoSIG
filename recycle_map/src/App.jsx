// src/App.jsx
import React from 'react';
import './styles/style.css';
import Cards from './components/Cards.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Slice from './components/Slice.jsx';
import Map from './components/Map.jsx';

import image_premium from './assets/premium_certified_quality_stamp.jpg';
import image_recycle from './assets/elemento-de-diseno-de-icono-de-reciclaje-verde.jpg';
import ubication_map from './assets/location_pin_on_map.jpg';

function App() {
  return (
    <>
      <Navbar />
      <section id='home'>
        <Slice />
      </section>
      <section id='about'>
        <br></br>
        <h1 className='title-cards'>Sobre nosotros</h1>
        <div className='cards-wrapper'>
          <Cards
            title="Página funcional"
            image={image_premium}
            description="Una página web que funciona en todos los navegadores y dispositivos."
          />
          <Cards
            title="Importancia del Reciclaje"
            image={image_recycle}
            description="El reciclaje reduce la contaminación y ahorra recursos naturales."
          />
          <Cards
            title="Ubicación del Mapa"
            image={ubication_map}
            description="Encuentra puntos de reciclaje cercanos en el mapa."
          />
        </div>
      </section>

      <section id='map'>
        <Map />
      </section>

      <Footer />
    </>
  );
}

export default App;
