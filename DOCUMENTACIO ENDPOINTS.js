// Puntos de Reciclaje API Documentation

/**
 * =============================================
 * 1. Obtener todos los puntos de reciclaje
 * =============================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/
 * Descripción: Retorna una colección GeoJSON con todos los puntos de reciclaje registrados
 * 
 * Estructura de respuesta:
 * - FeatureCollection: Contenedor GeoJSON para múltiples features
 *   - features: Array de puntos de reciclaje con sus propiedades
 *     - geometry: Coordenadas geográficas del punto (longitud, latitud)
 *     - properties: Metadatos del punto de reciclaje
 *       - id: Identificador único
 *       - nombre: Nombre descriptivo del centro
 *       - departamento: Ubicación administrativa
 *       - tipo_residuo: Materiales aceptados (separados por comas)
 *       - horario: Días y horas de operación
 *       - gestor: Entidad responsable
 *       - notas: Información adicional
 *       - periodo: Frecuencia de recolección
 *       - fuente: Origen de los datos
 *       - distancia_km: Distancia desde punto de referencia (0.0 si no aplica)
 */

// Ejemplo de solicitud usando cURL:
// curl http://localhost:3000/api/puntos/

// Respuesta esperada (formato GeoJSON):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-89.200123, 13.700456]  // [longitude, latitude]
      },
      "properties": {
        "id": 1,
        "nombre": "Centro de Acopio Central",
        "departamento": "San Salvador",
        "direccion": "Av. Always Viva #123",
        "tipo_residuo": "papel, plástico",  // Materiales aceptados
        "horario": "Lun–Vie 8:00–17:00",   // Horario de atención
        "gestor": "EcoSal",                // Organización responsable
        "notas": "",                       // Campo opcional
        "periodo": "Diario",              // Frecuencia de servicio
        "fuente": "Municipalidad",         // Origen del dato
        "distancia_km": 0.0                // Distancia calculada
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-89.210987, 13.690321]
      },
      "properties": {
        "id": 2,
        "nombre": "Punto Verde Colonia",
        "departamento": "San Salvador",
        "direccion": "Col. Jardines",
        "tipo_residuo": "vidrio",
        "horario": "Sábados 9:00–13:00",   // Horario reducido
        "gestor": "EcoSal",
        "notas": "Solo fines de semana",   // Información adicional
        "periodo": "Semanal",
        "fuente": "ONG Verde",
        "distancia_km": 1.5                // Distancia en kilómetros
      }
    }
    // ... más features pueden aparecer aquí
  ]
}

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 2. Buscar puntos por tipo de residuo
 * ==================================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/tipo/{tipo}
 * Parámetros:
 * - tipo: Tipo de residuo a filtrar (ej: llantas, plástico, vidrio)
 * 
 * Descripción: 
 * Retorna una colección GeoJSON con puntos de reciclaje que aceptan
 * el tipo de residuo especificado (búsqueda case-insensitive)
 */

// Ejemplo de solicitud para puntos que aceptan llantas:
// curl http://localhost:3000/api/puntos/tipo/llantas

// Respuesta esperada (GeoJSON filtrado):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-89.205000, 13.705000]
      },
      "properties": {
        "id": 5,
        "nombre": "Recicladora de Llantas Norte",
        "departamento": "San Salvador",
        "direccion": "Col. Norte #45",
        "tipo_residuo": "llantas",          // Coincide con el parámetro
        "horario": "Mar–Vie 7:00–15:00",
        "gestor": "Llanta Verde S.A.",      // Gestor especializado
        "notas": "",
        "periodo": "Diario",
        "fuente": "Empresa Privada",
        "distancia_km": 2.3
      }
    }
    // ... otros puntos que acepten el mismo tipo de residuo
  ]
}

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 3. Buscar puntos por múltiples tipos de residuo
 * ==================================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/tipos-multiples
 * Parámetros URL:
 * - tipos: Lista separada por comas de tipos de residuo (ej: papel,plastico,vidrio)
 * 
 * Descripción: 
 * Retorna puntos que aceptan CUALQUIERA de los tipos de residuo especificados
 * (búsqueda inclusiva, no requiere que acepte todos los tipos)
 */

// Ejemplo de solicitud para puntos que aceptan papel O plástico:
// curl "http://localhost:3000/api/puntos/tipos-multiples?tipos=papel,plastico"

// Respuesta esperada (GeoJSON con puntos que coinciden con al menos un tipo):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { 
        "type": "Point", 
        "coordinates": [-89.200500, 13.701000] 
      },
      "properties": {
        "id": 3,
        "nombre": "Eco Punto Sur",
        "departamento": "La Libertad",
        "direccion": "Col. Sur #45",
        "tipo_residuo": "papel, plástico",  // Coincide con ambos parámetros
        "horario": "Lun–Vie 9:00–18:00",
        "gestor": "ReciSal",
        "notas": "",
        "periodo": "Diario",
        "fuente": "Municipalidad",
        "distancia_km": 5.2
      }
    },
    {
      "type": "Feature",
      "geometry": { 
        "type": "Point", 
        "coordinates": [-89.210000, 13.702500] 
      },
      "properties": {
        "id": 4,
        "nombre": "Centro Verde Oeste",
        "departamento": "Santa Ana",
        "direccion": "Zona Oeste #10",
        "tipo_residuo": "papel",           // Coincide con uno de los parámetros
        "horario": "Mar–Sáb 8:00–14:00",
        "gestor": "GreenCo",
        "notas": "",
        "periodo": "Semanal",
        "fuente": "ONG Verde",
        "distancia_km": 12.8
      }
    }
    // ... otros puntos que acepten al menos uno de los tipos especificados
  ]
}

/**
 * Comportamiento:
 * - Búsqueda case-insensitive (acepta "Plastico" o "plástico")
 * - No requiere orden específico en los parámetros
 * - Incluye puntos que contengan parcialmente los tipos (ej: "plásticos" coincidiría con "plástico")
 */
// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 4. Obtener tipos de residuo disponibles
 * ==================================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/tipos-disponibles
 * 
 * Descripción:
 * Retorna un listado de todos los tipos de residuos
 * aceptados en los diferentes puntos de reciclaje
 */

// Ejemplo de solicitud:
// curl http://localhost:3000/api/puntos/tipos-disponibles

// Respuesta esperada:
{
  "success": true,          // Indicador de éxito de la operación
  "count": 5,               // Cantidad total de tipos disponibles
  "data": [                 // Listado de tipos únicos
    "papel",
    "plástico", 
    "vidrio",
    "metal",
    "llantas"
  ]
}

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 5. Búsqueda avanzada con múltiples filtros
 * ==================================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/buscar-avanzada
 * Parámetros disponibles:
 * - tipo_residuo: Filtra por tipo específico de residuo
 * - departamento: Filtra por ubicación geográfica
 * - gestor: Filtra por organización responsable
 * - horario: Filtra por disponibilidad horaria
 * 
 * Descripción:
 * Permite combinar múltiples criterios de búsqueda para
 * encontrar puntos de reciclaje específicos
 */

// Ejemplo de solicitud para plástico en San Salvador:
// curl "http://localhost:3000/api/puntos/buscar-avanzada?tipo_residuo=plastico&departamento=San%20Salvador"

// Respuesta esperada (GeoJSON con puntos que cumplen TODOS los filtros):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { 
        "type": "Point", 
        "coordinates": [-89.205000, 13.703000] 
      },
      "properties": {
        "id": 8,
        "nombre": "ReciPlast Centro",
        "departamento": "San Salvador",      // Coincide con filtro departamento
        "direccion": "Av. Reforma #200",
        "tipo_residuo": "plástico",         // Coincide con filtro tipo_residuo
        "horario": "Lun–Vie 7:00–16:00",
        "gestor": "PlasticEco",
        "notas": "",
        "periodo": "Diario",
        "fuente": "Empresa Privada",
        "distancia_km": 3.4
      }
    }
    // ... otros puntos que cumplan con TODOS los filtros aplicados
  ]
}

/**
 * Notas:
 * - Los parámetros son opcionales y combinables
 * - La búsqueda aplica AND lógico entre filtros
 * - Los valores deben ser URL-encoded (ej: espacios como %20)
 */

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 6. Obtener puntos cercanos a una ubicación
 * ==================================================
 * 
 * Método: GET
 * Endpoint: /api/puntos/cercanos
 * Parámetros requeridos:
 * - lat: Latitud del punto de referencia (decimal)
 * - lng: Longitud del punto de referencia (decimal)
 * - radio: Distancia máxima en metros desde el punto
 * 
 * Descripción:
 * Retorna puntos de reciclaje dentro del radio especificado
 * ordenados por proximidad
 */

// Ejemplo de solicitud para 20km alrededor de San Salvador:
// curl "http://localhost:3000/api/puntos/cercanos?lat=13.700000&lng=-89.200000&radio=20000"

// Respuesta esperada (GeoJSON con puntos dentro del radio):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { 
        "type": "Point", 
        "coordinates": [-89.200123, 13.700456] 
      },
      "properties": {
        "id": 1,
        "nombre": "Centro de Acopio Central",
        "departamento": "San Salvador",
        "direccion": "Av. Always Viva #123",
        "tipo_residuo": "papel, plástico",
        "horario": "Lun–Vie 8:00–17:00",
        "gestor": "EcoSal",
        "notas": "",
        "periodo": "Diario",
        "fuente": "Municipalidad",
        "distancia_km": 0.0  // Distancia desde el punto de referencia
      }
    },
    {
      "type": "Feature",
      "geometry": { 
        "type": "Point", 
        "coordinates": [-89.210987, 13.690321] 
      },
      "properties": {
        "id": 2,
        "nombre": "Punto Verde Colonia",
        "departamento": "San Salvador",
        "direccion": "Col. Jardines",
        "tipo_residuo": "vidrio",
        "horario": "Sábados 9:00–13:00",
        "gestor": "EcoSal",
        "notas": "Solo fines de semana",
        "periodo": "Semanal",
        "fuente": "ONG Verde",
        "distancia_km": 1.5  // Distancia desde el punto de referencia
      }
    }
  ]
}

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 7. Obtener puntos cercanos filtrados por tipo de residuo
 * ==================================================
 *
 * Método: GET
 * Endpoint: /api/puntos/cercanos-por-tipo
 * Parámetros requeridos:
 * - lat: Latitud del punto de referencia (decimal)
 * - lng: Longitud del punto de referencia (decimal)
 * - tipo: Tipo de residuo a filtrar
 * - radio: Distancia máxima en metros desde el punto
 *
 * Descripción:
 * Retorna puntos de reciclaje dentro del radio especificado
 * que acepten el tipo de residuo indicado, ordenados por proximidad
 */

// Ejemplo de solicitud para vidrio dentro de 15km:
// curl "http://localhost:3000/api/puntos/cercanos-por-tipo?lat=13.700000&lng=-89.200000&tipo=vidrio&radio=15000"

// Respuesta esperada (GeoJSON con puntos que cumplen ambos criterios):
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-89.210987, 13.690321]
      },
      "properties": {
        "id": 2,
        "nombre": "Punto Verde Colonia",
        "departamento": "San Salvador",
        "direccion": "Col. Jardines",
        "tipo_residuo": "vidrio",        // Coincide con el tipo solicitado
        "horario": "Sábados 9:00–13:00",
        "gestor": "EcoSal",
        "notas": "Solo fines de semana",
        "periodo": "Semanal",
        "fuente": "ONG Verde",
        "distancia_km": 1.5             // Dentro del radio especificado
      }
    }
  ]
}

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 8. Crear un nuevo punto de reciclaje
 * ==================================================
 *
 * Método: POST
 * Endpoint: /api/puntos/
 * Content-Type: application/json
 * 
 * Campos requeridos en el body:
 * - nombre: Nombre descriptivo del punto
 * - departamento: Ubicación geográfica
 * - direccion: Dirección específica
 * - tipo_residuo: Materiales aceptados
 * - horario: Disponibilidad de atención
 * - gestor: Entidad responsable
 * - longitud: Coordenada geográfica (WGS84)
 * - latitud: Coordenada geográfica (WGS84)
 * 
 * Campos opcionales:
 * - notas: Información adicional
 * - periodo: Frecuencia de recolección
 * - fuente: Origen del dato
 */

// Ejemplo de solicitud para crear nuevo punto:
/*
curl -X POST http://localhost:3000/api/puntos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Recolecta Norte",
    "departamento": "Chalatenango",
    "direccion": "Col. Norte #77",
    "tipo_residuo": "metal",
    "horario": "Lun–Sáb 8:00–14:00",
    "gestor": "MetalEco",
    "notas": "",
    "periodo": "Diario",
    "fuente": "Municipalidad",
    "longitud": -89.300000,
    "latitud": 14.000000
  }'
*/

// Respuesta exitosa (201 Created):
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-89.300000, 14.000000]  // Coordenadas proporcionadas
  },
  "properties": {
    "id": 12,                                // ID generado automáticamente
    "nombre": "Recolecta Norte",
    "departamento": "Chalatenango",
    "direccion": "Col. Norte #77",
    "tipo_residuo": "metal",
    "horario": "Lun–Sáb 8:00–14:00",
    "gestor": "MetalEco",
    "notas": "",
    "periodo": "Diario",
    "fuente": "Municipalidad"
    // Nota: distancia_km no se incluye en la respuesta de creación
  }
}

// CONFIGURAR MÉTODO Y URL:
//    - Método: POST
//    - URL: http://localhost:3000/api/puntos/

// AÑADIR CABECERAS (Headers):
//    - Pestaña "Headers"
//    - Añadir cabecera:
//      * Key: Content-Type
//      * Value: application/json

// 4. CONFIGURAR CUERPO (Body):
//    - Seleccionar pestaña "Body"
//    - Elegir opción "JSON" del menú desplegable
//    - Pegar el siguiente contenido JSON:

// PEGAR ESTO
// {
//   "nombre": "Recolecta Norte",
//   "departamento": "Chalatenango",
//   "direccion": "Col. Norte #77",
//   "tipo_residuo": "metal",
//   "horario": "Lun-Sáb 8:00-14:00",
//   "gestor": "MetalEco",
//   "notas": "",
//   "periodo": "Diario",
//   "fuente": "Municipalidad",
//   "longitud": -89.300000,
//   "latitud": 14.000000
// }

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 9. Actualizar un punto existente
 * ==================================================
 *
 * Método: PUT
 * Endpoint: /api/puntos/{id}
 * Content-Type: application/json
 * 
 * Parámetros:
 * - id: Identificador único del punto a actualizar (en URL)
 *
 * Campos actualizables en el body:
 * - nombre
 * - departamento
 * - direccion
 * - tipo_residuo
 * - horario
 * - gestor
 * - notas
 * - periodo
 * - fuente
 * - longitud
 * - latitud
 */

// Ejemplo de solicitud para actualizar punto ID 12:
/*
curl -X PUT http://localhost:3000/api/puntos/12 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Recolecta Norte Modificado",
    "departamento": "Chalatenango",
    "direccion": "Col. Norte #77",
    "tipo_residuo": "metal, plástico",
    "horario": "Lun–Sáb 8:00–16:00",
    "gestor": "MetalEco",
    "notas": "Ampliado horario",
    "periodo": "Diario",
    "fuente": "Municipalidad",
    "longitud": -89.300500,
    "latitud": 14.000500
  }'
*/

// Respuesta exitosa (200 OK):
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-89.300500, 14.000500]  // Nuevas coordenadas actualizadas
  },
  "properties": {
    "id": 12,                               // Mismo ID que el punto original
    "nombre": "Recolecta Norte Modificado", // Nombre actualizado
    "departamento": "Chalatenango",
    "direccion": "Col. Norte #77",
    "tipo_residuo": "metal, plástico",     // Tipo de residuo ampliado
    "horario": "Lun–Sáb 8:00–16:00",       // Horario modificado
    "gestor": "MetalEco",
    "notas": "Ampliado horario",           // Nota actualizada
    "periodo": "Diario",
    "fuente": "Municipalidad"
  }
}

/**
 * Comportamiento:
 * - Actualiza solo los campos proporcionados (partial update)
 * - Campos no incluidos mantienen su valor actual
 * - Las coordenadas son completamente reemplazadas si se proporcionan
 * - Devuelve error 404 si el ID no existe
 * - Valida los nuevos valores según las mismas reglas que la creación
 */

// Puntos de Reciclaje API Documentation

/**
 * ==================================================
 * 10. Eliminar un punto de reciclaje
 * ==================================================
 *
 * Método: DELETE
 * Endpoint: /api/puntos/{id}
 * 
 * Parámetros:
 * - id: Identificador único del punto a eliminar (en URL)
 */

// Ejemplo de solicitud para eliminar punto ID 12:
// curl -X DELETE http://localhost:3000/api/puntos/12

// Respuesta exitosa (200 OK):
// Devuelve los datos del punto eliminado
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-89.300500, 14.000500]
  },
  "properties": {
    "id": 12,
    "nombre": "Recolecta Norte Modificado",
    "departamento": "Chalatenango",
    "direccion": "Col. Norte #77",
    "tipo_residuo": "metal, plástico",
    "horario": "Lun–Sáb 8:00–16:00",
    "gestor": "MetalEco",
    "notas": "Ampliado horario",
    "periodo": "Diario",
    "fuente": "Municipalidad"
  }
}