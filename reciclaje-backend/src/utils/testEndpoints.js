const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const tests = [
  {
    name: 'Health Check',
    url: `${BASE_URL}/health`,
  },
  {
    name: 'Obtener todos los puntos',
    url: `${BASE_URL}/api/puntos`,
  },
  {
    name: 'Puntos cercanos a Santa Tecla',
    url: `${BASE_URL}/api/puntos/cercanos?lat=13.6765&lng=-89.2892`,
  },
  {
    name: 'Puntos de llantas',
    url: `${BASE_URL}/api/puntos/tipo/llantas`,
  },
  {
    name: 'Puntos de plástico',
    url: `${BASE_URL}/api/puntos/tipo/plastico`,
  }
];

const runTests = async () => {
  console.log('🧪 Ejecutando pruebas de endpoints...\n');
  
  for (const test of tests) {
    try {
      const response = await axios.get(test.url);
      console.log(`✅ ${test.name}: OK (${response.status})`);
      if (response.data.count !== undefined) {
        console.log(`   📊 Resultados: ${response.data.count}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR (${error.response?.status || error.message})`);
    }
    console.log('');
  }
};

runTests();