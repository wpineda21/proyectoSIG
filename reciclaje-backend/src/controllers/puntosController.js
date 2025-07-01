// Importa el modelo de puntos de recolección
const PuntoRecoleccion = require("../models/PuntoRecoleccion");

// Función auxiliar que convierte un punto de recolección a un objeto GeoJSON tipo Feature
function puntoToFeature(punto) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [punto.longitud, punto.latitud], // Formato [long, lat] requerido por GeoJSON
    },
    properties: {
      // Propiedades del punto que acompañan a la geometría
      id: punto.id,
      nombre: punto.nombre,
      departamento: punto.departamento,
      direccion: punto.direccion,
      tipo_residuo: punto.tipo_residuo,
      horario: punto.horario,
      gestor: punto.gestor,
      notas: punto.notas,
      periodo: punto.periodo,
      fuente: punto.fuente,
      ...(punto.distancia_km !== undefined && { distancia_km: punto.distancia_km }), // Agrega la distancia si está presente
    },
  };
}

// Controlador principal de puntos de recolección
class PuntosController {
  
  // GET /api/puntos
  // Retorna todos los puntos en formato GeoJSON
  static async getAll(req, res) {
    try {
      const puntos = await PuntoRecoleccion.getAll(); // Consulta todos los puntos
      const geojson = {
        type: "FeatureCollection",
        features: puntos.map(puntoToFeature), // Convierte cada punto a Feature
      };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener puntos", error: error.message });
    }
  }

  // GET /api/puntos/tipo/:tipo
  // Retorna los puntos filtrados por tipo de residuo
  static async getByTipo(req, res) {
    try {
      const puntos = await PuntoRecoleccion.findByTipoResiduo(req.params.tipo);
      const geojson = { type: "FeatureCollection", features: puntos.map(puntoToFeature) };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al filtrar por tipo", error: error.message });
    }
  }

  // GET /api/puntos/tipos-multiples?tipos=papel,plastico
  // Retorna puntos que coincidan con múltiples tipos de residuo
  static async getByMultipleTypes(req, res) {
    try {
      if (!req.query.tipos) return res.status(400).json({ success: false, message: "Parámetro tipos es requerido" });
      const tiposArray = req.query.tipos.split(',').map(t => t.trim());
      const puntos = await PuntoRecoleccion.findByMultipleTypes(tiposArray);
      const geojson = { type: "FeatureCollection", features: puntos.map(puntoToFeature) };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al buscar múltiples tipos", error: error.message });
    }
  }

  // GET /api/puntos/tipos-disponibles
  // Devuelve una lista de tipos de residuo únicos registrados en la base de datos
  static async getTiposDisponibles(req, res) {
    try {
      const tipos = await PuntoRecoleccion.getTiposResiduoUnicos();
      res.json({ success: true, count: tipos.length, data: tipos });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener tipos disponibles", error: error.message });
    }
  }

  // GET /api/puntos/buscar-avanzada
  // Realiza una búsqueda avanzada basada en filtros múltiples pasados como query
  static async busquedaAvanzada(req, res) {
    try {
      const puntos = await PuntoRecoleccion.busquedaAvanzada(req.query);
      const geojson = { type: "FeatureCollection", features: puntos.map(puntoToFeature) };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error en búsqueda avanzada", error: error.message });
    }
  }

  // GET /api/puntos/cercanos
  // Devuelve puntos cercanos a una latitud y longitud dentro de un radio (metros)
  static async getNearby(req, res) {
    try {
      const { lat, lng, radio } = req.query;
      if (!lat || !lng) return res.status(400).json({ success: false, message: "Latitud y longitud son requeridas" });
      const puntos = await PuntoRecoleccion.findNearby(parseFloat(lng), parseFloat(lat), parseInt(radio) || 50000);
      const geojson = { type: "FeatureCollection", features: puntos.map(puntoToFeature) };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al buscar puntos cercanos", error: error.message });
    }
  }

  // GET /api/puntos/cercanos-por-tipo
  // Devuelve puntos cercanos filtrados por tipo de residuo
  static async getNearbyByType(req, res) {
    try {
      const { lat, lng, tipo, radio } = req.query;
      if (!lat || !lng || !tipo) return res.status(400).json({ success: false, message: "Latitud, longitud y tipo son requeridos" });
      const puntos = await PuntoRecoleccion.findNearbyByType(parseFloat(lng), parseFloat(lat), tipo, parseInt(radio) || 50000);
      const geojson = { type: "FeatureCollection", features: puntos.map(puntoToFeature) };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al buscar puntos cercanos por tipo", error: error.message });
    }
  }

  // POST /api/puntos
  // Crea un nuevo punto de recolección
  static async create(req, res) {
    try {
      const data = req.body;
      // Verifica campos requeridos
      const camposRequeridos = [ 'nombre', 'departamento', 'tipo_residuo', 'latitud', 'longitud' ];
      for (let campo of camposRequeridos) {
        if (data[campo] === undefined) {
          return res.status(400).json({ success: false, message: `Campo ${campo} faltante` });
        }
      }
      const nuevo = await PuntoRecoleccion.create(data);
      res.status(201).json(puntoToFeature(nuevo));
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear punto", error: error.message });
    }
  }

  // PUT /api/puntos/:id
  // Actualiza un punto existente por su ID
  static async update(req, res) {
    try {
      const actualizado = await PuntoRecoleccion.update(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ success: false, message: "Punto no encontrado" });
      res.json(puntoToFeature(actualizado));
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar punto", error: error.message });
    }
  }

  // DELETE /api/puntos/:id
  // Elimina un punto por ID
  static async delete(req, res) {
    try {
      const eliminado = await PuntoRecoleccion.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ success: false, message: "Punto no encontrado" });
      res.json(puntoToFeature(eliminado));
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar punto", error: error.message });
    }
  }

  // GET /api/puntos/departamentos
  // Retorna todos los departamentos únicos donde hay puntos de recolección
  static async getDepartamentos(req, res) {
    try {
      const departamentos = await PuntoRecoleccion.getDepartamentosUnicos();
      res.json({ success: true, count: departamentos.length, data: departamentos });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener departamentos", error: error.message });
    }
  }

  // GET /api/puntos/cercanos-multiples-tipos
  // Devuelve puntos cercanos que coincidan con múltiples tipos de residuo
  static async getNearbyByMultipleTypes(req, res) {
    try {
      const { lat, lng, tipos, radio } = req.query;
      if (!lat || !lng || !tipos) {
        return res.status(400).json({ 
          success: false, 
          message: "Latitud, longitud y tipos son requeridos" 
        });
      }

      const tiposArray = tipos.split(',').map(t => t.trim());
      const puntos = await PuntoRecoleccion.findNearbyByMultipleTypes(
        parseFloat(lng), 
        parseFloat(lat), 
        tiposArray, 
        parseInt(radio) || 50000
      );

      const geojson = {
        type: "FeatureCollection",
        features: puntos.map(puntoToFeature)
      };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Error al buscar puntos cercanos por tipos múltiples", 
        error: error.message 
      });
    }
  }
}

// Exporta el controlador para que pueda ser usado por las rutas
module.exports = PuntosController;
