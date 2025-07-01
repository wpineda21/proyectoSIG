const { pool } = require("../config/database");

class PuntoRecoleccion {

  // Obtener todos los puntos con coordenadas extraídas
  static async getAll() {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,  -- Extrae la coordenada X (longitud) del campo 'ubicacion'
        ST_Y(ubicacion) as latitud    -- Extrae la coordenada Y (latitud)
      FROM puntos_recoleccion
      ORDER BY nombre                 -- Ordena los resultados por el nombre del punto
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Buscar puntos por coincidencia parcial del tipo de residuo
  static async findByTipoResiduo(tipo) {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      WHERE LOWER(tipo_residuo) LIKE LOWER($1) -- Coincidencia parcial, no sensible a mayúsculas
      ORDER BY 
        CASE WHEN LOWER(tipo_residuo) LIKE LOWER($2) THEN 1 ELSE 2 END, -- Prioriza si comienza con la palabra buscada
        nombre
    `;
    const searchTerm = `%${tipo}%`;
    const exactStart = `${tipo}%`;
    const result = await pool.query(query, [searchTerm, exactStart]);
    return result.rows;
  }

  // Buscar puntos que coincidan con múltiples tipos de residuos
  static async findByMultipleTypes(tipos) {
    const conditions = tipos
      .map((_, index) => `LOWER(tipo_residuo) LIKE LOWER($${index + 1})`)
      .join(" OR "); // Condiciones dinámicas: tipo1 OR tipo2 OR tipo3...

    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      WHERE ${conditions} -- Aplica condiciones dinámicas según tipos enviados
      ORDER BY nombre
    `;
    const searchTerms = tipos.map((tipo) => `%${tipo}%`);
    const result = await pool.query(query, searchTerms);
    return result.rows;
  }

  // Obtener todos los tipos únicos de residuos (individuales)
  static async getTiposResiduoUnicos() {
    const query = `
      SELECT DISTINCT tipo_residuo      -- Trae todos los valores únicos del campo tipo_residuo
      FROM puntos_recoleccion
      WHERE tipo_residuo IS NOT NULL   -- Ignora registros vacíos
      ORDER BY tipo_residuo
    `;
    const result = await pool.query(query);
    const todosLosTipos = new Set();

    // Separa los tipos combinados por coma
    result.rows.forEach((row) => {
      const tipos = row.tipo_residuo
        .split(",")
        .map((tipo) => tipo.trim().toLowerCase())
        .filter((tipo) => tipo.length > 0);
      tipos.forEach((tipo) => todosLosTipos.add(tipo));
    });

    return Array.from(todosLosTipos).sort();
  }

  // Búsqueda avanzada con filtros opcionales
  static async busquedaAvanzada(filtros) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (filtros.tipo_residuo) {
      conditions.push(`LOWER(tipo_residuo) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.tipo_residuo}%`);
      paramIndex++;
    }

    if (filtros.departamento) {
      conditions.push(`LOWER(departamento) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.departamento}%`);
      paramIndex++;
    }

    if (filtros.gestor) {
      conditions.push(`LOWER(gestor) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.gestor}%`);
      paramIndex++;
    }

    if (filtros.con_horario === "true") {
      conditions.push(`horario IS NOT NULL AND horario != ''`);
    } else if (filtros.con_horario === "false") {
      conditions.push(`(horario IS NULL OR horario = '')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      ${whereClause} -- Aplica todos los filtros si existen
      ORDER BY nombre
    `;
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Buscar puntos cercanos a una ubicación dentro de un radio (en metros)
  static async findNearby(longitud, latitud, radio = 50000) {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud,
        ST_Distance(                       -- Calcula distancia en metros entre el punto y la ubicación dada
          ubicacion::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distancia_km          -- Convierte la distancia a kilómetros
      FROM puntos_recoleccion
      WHERE ST_DWithin(                   -- Verifica si está dentro del radio especificado
        ubicacion::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      ORDER BY distancia_km              -- Ordena por cercanía
    `;
    const result = await pool.query(query, [longitud, latitud, radio]);
    return result.rows;
  }

  // Buscar puntos cercanos y que coincidan con un tipo específico
  static async findNearbyByType(longitud, latitud, tipoResiduo, radio = 50000) {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud,
        ST_Distance(
          ubicacion::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distancia_km
      FROM puntos_recoleccion
      WHERE ST_DWithin(
        ubicacion::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $4
      )
      AND LOWER(tipo_residuo) LIKE LOWER($3) -- Coincidencia con el tipo de residuo
      ORDER BY distancia_km
    `;
    const result = await pool.query(query, [
      longitud,
      latitud,
      `%${tipoResiduo}%`,
      radio,
    ]);
    return result.rows;
  }

  // Insertar un nuevo punto
  static async create(data) {
    const query = `
      INSERT INTO puntos_recoleccion (
        nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente, ubicacion
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        ST_SetSRID(ST_MakePoint($10, $11), 4326) -- Crea el punto geográfico con SRID 4326
      )
      RETURNING * -- Devuelve el nuevo registro insertado
    `;
    const values = [
      data.nombre,
      data.departamento,
      data.direccion,
      data.tipo_residuo,
      data.horario,
      data.gestor,
      data.notas,
      data.periodo,
      data.fuente,
      data.longitud,
      data.latitud,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Actualizar punto por ID
  static async update(id, data) {
    const query = `
      UPDATE puntos_recoleccion SET
        nombre = $1,
        departamento = $2,
        direccion = $3,
        tipo_residuo = $4,
        horario = $5,
        gestor = $6,
        notas = $7,
        periodo = $8,
        fuente = $9,
        ubicacion = ST_SetSRID(ST_MakePoint($10, $11), 4326)
      WHERE id = $12
      RETURNING * -- Devuelve el registro actualizado
    `;
    const values = [
      data.nombre,
      data.departamento,
      data.direccion,
      data.tipo_residuo,
      data.horario,
      data.gestor,
      data.notas,
      data.periodo,
      data.fuente,
      data.longitud,
      data.latitud,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar punto por ID
  static async delete(id) {
    const query = `DELETE FROM puntos_recoleccion WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener todos los departamentos únicos donde hay puntos
  static async getDepartamentosUnicos() {
    const query = `
      SELECT DISTINCT departamento
      FROM puntos_recoleccion
      WHERE departamento IS NOT NULL AND departamento <> ''
      ORDER BY departamento
    `;
    const result = await pool.query(query);
    return result.rows.map((row) => row.departamento);
  }

  // Buscar puntos cercanos a una ubicación, que coincidan con múltiples tipos
  static async findNearbyByMultipleTypes(longitud, latitud, tipos, radio = 50000) {
    const conditions = tipos
      .map((_, index) => `LOWER(tipo_residuo) LIKE LOWER($${index + 3})`)
      .join(" OR "); // Crea condiciones dinámicas para múltiples tipos

    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud,
        ST_Distance(
          ubicacion::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) / 1000 AS distancia_km
      FROM puntos_recoleccion
      WHERE ST_DWithin(
        ubicacion::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $${tipos.length + 3} -- Parámetro para el radio
      )
      AND (${conditions}) -- Aplica los filtros de tipo_residuo
      ORDER BY distancia_km
    `;

    const params = [longitud, latitud, ...tipos.map(tipo => `%${tipo}%`), radio];
    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = PuntoRecoleccion;
