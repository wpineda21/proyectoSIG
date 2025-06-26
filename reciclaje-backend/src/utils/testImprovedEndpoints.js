const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/puntos';

const testImprovedSearch = async () => {
  console.log('🧪 PROBANDO BÚSQUEDAS MEJORADAS...\n');

  const tests = [
    {
      name: '📋 Obtener tipos disponibles',
      url: `${BASE_URL}/tipos-disponibles`
    },
    {
      name: '🔍 Buscar "plástico" (debe encontrar papel,plástico)',
      url: `${BASE_URL}/tipo/plastico`
    },
    {
      name: '🔍 Buscar "papel" (debe encontrar papel,plástico y papel,cartón)',
      url: `${BASE_URL}/tipo/papel`
    },
    {
      name: '🔍 Buscar "vidrio" (debe encontrar varios)',
      url: `${BASE_URL}/tipo/vidrio`
    },
    {
      name: '🔍 Buscar "latas" (debe encontrar vidrio,latas)',
      url: `${BASE_URL}/tipo/latas`
    },
    {
      name: '🔍 Buscar "electrónicos"',
      url: `${BASE_URL}/tipo/electronicos`
    },
    {
      name: '🚀 Múltiples tipos: papel,plástico,vidrio',
      url: `${BASE_URL}/tipos-multiples?tipos=papel,plastico,vidrio`
    },
    {
      name: '🎯 Búsqueda avanzada: plástico en San Salvador',
      url: `${BASE_URL}/buscar-avanzada?tipo_residuo=plastico&departamento=San Salvador`
    },
    {
      name: '🎯 Búsqueda avanzada: puntos con horario',
      url: `${BASE_URL}/buscar-avanzada?con_horario=true`
    },
    {
      name: '📍 Cercanos con tipo: plástico cerca de San Salvador',
      url: `${BASE_URL}/cercanos-por-tipo?lat=13.6929&lng=-89.2182&tipo=plastico`
    }
  ];

  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      const response = await axios.get(test.url);
      console.log(`✅ ${test.name}: ${response.data.count} resultados`);
      
      // Mostrar algunos resultados de ejemplo
      if (response.data.data && response.data.data.length > 0) {
        const ejemplo = response.data.data[0];
        if (ejemplo.tipo_residuo) {
          console.log(`   📝 Ejemplo: "${ejemplo.nombre}" - ${ejemplo.tipo_residuo}`);
        }
      }
      console.log('');
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR (${error.response?.status || error.message})`);
      console.log('');
    }
  }

  console.log('🎉 Pruebas completadas!');
};

testImprovedSearch();