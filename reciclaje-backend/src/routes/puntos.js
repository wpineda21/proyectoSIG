const express = require('express');
const PuntosController = require('../controllers/puntosController');
const { validateCoordinates } = require('../middleware/validation');

const router = express.Router();

// Rutas existentes
router.get('/', PuntosController.getAll);
router.get('/cercanos', validateCoordinates, PuntosController.getNearby);

// 🔍 MEJORADO: Búsqueda por tipo
router.get('/tipo/:tipo', PuntosController.getByTipo);

// 🆕 NUEVAS RUTAS:

router.get('/tipos-multiples', PuntosController.getByMultipleTypes);
router.get('/tipos-disponibles', PuntosController.getTiposDisponibles);
router.get('/buscar-avanzada', PuntosController.busquedaAvanzada);
router.get('/cercanos-por-tipo', validateCoordinates, PuntosController.getNearbyByType);

// 📌 NUEVAS rutas CRUD:
router.post('/', PuntosController.create);
router.put('/:id', PuntosController.update);
router.delete('/:id', PuntosController.delete);
router.get('/departamentos', PuntosController.getDepartamentos);


module.exports = router;
