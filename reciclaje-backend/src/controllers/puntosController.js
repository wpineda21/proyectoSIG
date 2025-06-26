const PuntoRecoleccion = require("../models/PuntoRecoleccion");

// Helper: convierte un punto a Feature GeoJSON
function puntoToFeature(punto) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [punto.longitud, punto.latitud],
    },
    properties: {
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
      ...(punto.distancia_km !== undefined && { distancia_km: punto.distancia_km }),
    },
  };
}

class PuntosController {
  // GET /api/puntos
  static async getAll(req, res) {
    try {
      const puntos = await PuntoRecoleccion.getAll();
      const geojson = {
        type: "FeatureCollection",
        features: puntos.map(puntoToFeature),
      };
      res.json(geojson);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener puntos", error: error.message });
    }
  }

  // GET /api/puntos/tipo/:tipo
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
  static async getTiposDisponibles(req, res) {
    try {
      const tipos = await PuntoRecoleccion.getTiposResiduoUnicos();
      res.json({ success: true, count: tipos.length, data: tipos });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener tipos disponibles", error: error.message });
    }
  }

  // GET /api/puntos/buscar-avanzada
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
  static async create(req, res) {
    try {
      const data = req.body;
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
  static async delete(req, res) {
    try {
      const eliminado = await PuntoRecoleccion.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ success: false, message: "Punto no encontrado" });
      res.json(puntoToFeature(eliminado));
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar punto", error: error.message });
    }
  }
}

module.exports = PuntosController;
