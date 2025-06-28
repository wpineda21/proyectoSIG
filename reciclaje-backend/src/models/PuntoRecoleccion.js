const { pool } = require("../config/database");

class PuntoRecoleccion {
  // Obtener todos los puntos
  static async getAll() {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      ORDER BY nombre
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // 🔍 MEJORADO: Buscar por tipo de residuo (coincidencia parcial inteligente)
  static async findByTipoResiduo(tipo) {
    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      WHERE LOWER(tipo_residuo) LIKE LOWER($1)
      ORDER BY 
        -- Priorizar coincidencias exactas al inicio
        CASE WHEN LOWER(tipo_residuo) LIKE LOWER($2) THEN 1 ELSE 2 END,
        nombre
    `;

    const searchTerm = `%${tipo}%`;
    const exactStart = `${tipo}%`;

    const result = await pool.query(query, [searchTerm, exactStart]);
    return result.rows;
  }

  // 🆕 NUEVO: Buscar múltiples tipos de residuo
  static async findByMultipleTypes(tipos) {
    // Construir condiciones WHERE dinámicamente
    const conditions = tipos
      .map((_, index) => `LOWER(tipo_residuo) LIKE LOWER($${index + 1})`)
      .join(" OR ");

    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      WHERE ${conditions}
      ORDER BY nombre
    `;

    const searchTerms = tipos.map((tipo) => `%${tipo}%`);
    const result = await pool.query(query, searchTerms);
    return result.rows;
  }

  // 🆕 NUEVO: Obtener todos los tipos de residuo únicos
  static async getTiposResiduoUnicos() {
    const query = `
      SELECT DISTINCT tipo_residuo
      FROM puntos_recoleccion
      WHERE tipo_residuo IS NOT NULL
      ORDER BY tipo_residuo
    `;

    const result = await pool.query(query);

    // Procesar para extraer tipos individuales
    const todosLosTipos = new Set();

    result.rows.forEach((row) => {
      const tipos = row.tipo_residuo
        .split(",")
        .map((tipo) => tipo.trim().toLowerCase())
        .filter((tipo) => tipo.length > 0);

      tipos.forEach((tipo) => todosLosTipos.add(tipo));
    });

    return Array.from(todosLosTipos).sort();
  }

  // 🆕 NUEVO: Búsqueda avanzada con múltiples filtros
  static async busquedaAvanzada(filtros) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Filtro por tipo de residuo
    if (filtros.tipo_residuo) {
      conditions.push(`LOWER(tipo_residuo) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.tipo_residuo}%`);
      paramIndex++;
    }

    // Filtro por departamento
    if (filtros.departamento) {
      conditions.push(`LOWER(departamento) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.departamento}%`);
      paramIndex++;
    }

    // Filtro por gestor
    if (filtros.gestor) {
      conditions.push(`LOWER(gestor) LIKE LOWER($${paramIndex})`);
      params.push(`%${filtros.gestor}%`);
      paramIndex++;
    }

    // Filtro por disponibilidad de horario
    if (filtros.con_horario === "true") {
      conditions.push(`horario IS NOT NULL AND horario != ''`);
    } else if (filtros.con_horario === "false") {
      conditions.push(`(horario IS NULL OR horario = '')`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        id, nombre, departamento, direccion, tipo_residuo,
        horario, gestor, notas, periodo, fuente,
        ST_X(ubicacion) as longitud,
        ST_Y(ubicacion) as latitud
      FROM puntos_recoleccion
      ${whereClause}
      ORDER BY nombre
    `;

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Buscar puntos cercanos (sin cambios)
  static async findNearby(longitud, latitud, radio = 50000) {
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
        $3
      )
      ORDER BY distancia_km
    `;

    const result = await pool.query(query, [longitud, latitud, radio]);
    return result.rows;
  }

  // 🆕 NUEVO: Buscar puntos cercanos CON filtro de tipo de residuo
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
      AND LOWER(tipo_residuo) LIKE LOWER($3)
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

  // Crear nuevo punto
  static async create(data) {
    const query = `
    INSERT INTO puntos_recoleccion (
      nombre, departamento, direccion, tipo_residuo,
      horario, gestor, notas, periodo, fuente, ubicacion
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      ST_SetSRID(ST_MakePoint($10, $11), 4326)
    )
    RETURNING *
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
    RETURNING *
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

static async getDepartamentosUnicos() {
  const query = `
    SELECT DISTINCT departamento
    FROM puntos_recoleccion
    WHERE departamento IS NOT NULL AND departamento <> ''
    ORDER BY departamento
  `;
  const result = await pool.query(query);
  return result.rows.map(row => row.departamento);
}


}

module.exports = PuntoRecoleccion;

// # 🔍 Búsqueda mejorada (ya existente pero ahora más inteligente)
// GET /api/puntos/tipo/plastico

// # 🆕 Búsqueda múltiple
// GET /api/puntos/tipos-multiples?tipos=papel,plastico,vidrio

// # 🆕 Ver todos los tipos disponibles
// GET /api/puntos/tipos-disponibles

// # 🆕 Búsqueda avanzada con filtros
// GET /api/puntos/buscar-avanzada?tipo_residuo=plastico&departamento=San Salvador

// # 🆕 Puntos cercanos CON filtro de tipo
// GET /api/puntos/cercanos-por-tipo?lat=13.7&lng=-89.2&tipo=plastico
