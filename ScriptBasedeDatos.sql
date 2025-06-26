CREATE EXTENSION postgis;

-- Crear tabla de puntos de recolección
CREATE TABLE puntos_recoleccion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    direccion TEXT,
    tipo_residuo VARCHAR(50) NOT NULL,
    horario VARCHAR(50),
    gestor VARCHAR(100),
    notas TEXT,
    periodo VARCHAR(100),
    fuente VARCHAR(255),
    ubicacion GEOMETRY(POINT, 4326) -- SRID 4326 para WGS84
);

-- Insertar datos de los 6 puntos de recolección
INSERT INTO
    puntos_recoleccion (
        nombre,
        departamento,
        direccion,
        tipo_residuo,
        horario,
        gestor,
        notas,
        periodo,
        fuente,
        ubicacion
    )
VALUES
    (
        'Balneario El Molino',
        'Usulután',
        'Final 8a Avenida Sur, calle al balneario El Molino',
        'llantas',
        NULL,
        NULL,
        NULL,
        NULL,
        'https://diario.elmundo.sv/nacionales/marn-habilita-seis-puntos-de-recoleccion-nacional-para-reciclaje-de-llantas-inservibles',
        ST_SetSRID(ST_MakePoint(-88.4465, 13.3462), 4326)
    ),
    (
        'Centro de Atención Municipal (CAM)',
        'San Miguel',
        'Instalaciones del CAM',
        'llantas',
        NULL,
        NULL,
        NULL,
        NULL,
        'MARN Twitter @MedioAmbienteSV',
        ST_SetSRID(ST_MakePoint(-88.1793, 13.4762), 4326)
    ),
    (
        'Relleno Sanitario Santa Rosa',
        'La Unión',
        'Hacienda Santa Rosa, cantón La Chorrera',
        'llantas',
        '7:30 a.m. a 3:30 p.m.',
        NULL,
        NULL,
        NULL,
        NULL,
        ST_SetSRID(ST_MakePoint(-87.8917, 13.3322), 4326)
    ),
    (
        'Relleno Sanitario Melara',
        'La Libertad',
        'Cantón Melara',
        'llantas',
        NULL,
        NULL,
        'Punto permanente confirmado en 2024',
        NULL,
        NULL,
        ST_SetSRID(ST_MakePoint(-89.3228, 13.5336), 4326)
    ),
    (
        'Relleno Sanitario ASEMUSA',
        'Santa Ana',
        'Km 77 carretera Santa Ana a Metapán, Caserío San José El Zompopo',
        'llantas',
        NULL,
        'Geocycle',
        NULL,
        NULL,
        NULL,
        ST_SetSRID(ST_MakePoint(-89.5652, 13.9943), 4326)
    ),
    (
        'Sede Central MARN',
        'San Salvador',
        'Km 5.5 carretera a Santa Tecla, Calle y Colonia Las Mercedes',
        'llantas',
        NULL,
        NULL,
        NULL,
        'Campañas temporales',
        NULL,
        ST_SetSRID(ST_MakePoint(-89.2487, 13.6768), 4326)
    );

-- Insertar 15 puntos adicionales de reciclaje general (ubicaciones reales)
INSERT INTO
    puntos_recoleccion (
        nombre,
        departamento,
        direccion,
        tipo_residuo,
        horario,
        gestor,
        notas,
        ubicacion
    )
VALUES
    -- San Salvador (4 puntos)
    (
        'Centro de Acopio Santa Tecla',
        'San Salvador',
        'Calle Los Bambúes, Plaza Mundo',
        'papel, plástico',
        '8:00 a.m. - 5:00 p.m.',
        'Municipalidad Santa Tecla',
        'Punto permanente con contenedores diferenciados',
        ST_SetSRID(ST_MakePoint(-89.2892, 13.6765), 4326)
    ),
    (
        'Recicladora Metropolitana',
        'San Salvador',
        'Colonia Escalón, Calle Circunvalación',
        'electrónicos, baterías',
        '9:00 a.m. - 4:00 p.m.',
        'Grupo Recicla',
        'Acepta equipos electrónicos en desuso',
        ST_SetSRID(ST_MakePoint(-89.2403, 13.6988), 4326)
    ),
    (
        'EcoPoint Centro Histórico',
        'San Salvador',
        'Plaza Gerardo Barrios',
        'vidrio, latas',
        '7:30 a.m. - 3:30 p.m.',
        'Alcaldía San Salvador',
        'Contenedores inteligentes',
        ST_SetSRID(ST_MakePoint(-89.1889, 13.6975), 4326)
    ),
    (
        'Reciclaje UES',
        'San Salvador',
        'Ciudad Universitaria, UES',
        'papel, cartón, plástico',
        'Lunes a Viernes 8:00 a.m. - 12:00 m.',
        'Universidad de El Salvador',
        'Punto educativo',
        ST_SetSRID(ST_MakePoint(-89.2186, 13.7161), 4326)
    ),
    -- Santa Ana (3 puntos)
    (
        'EcoCentro Santa Ana',
        'Santa Ana',
        'Calle Libertad, Parque Libertad',
        'vidrio, plástico, metal',
        '8:00 a.m. - 5:00 p.m.',
        'Fundación Verde',
        'Centro con compactadora',
        ST_SetSRID(ST_MakePoint(-89.5598, 13.9942), 4326)
    ),
    (
        'Recicladora Textil S.A.',
        'Santa Ana',
        'Metapán, Carretera a San Antonio Pajonal',
        'textiles, ropa',
        '9:00 a.m. - 4:00 p.m.',
        'Industrias Renova',
        'Acepta donaciones',
        ST_SetSRID(ST_MakePoint(-89.4477, 14.3321), 4326)
    ),
    (
        'Punto Verde Chalchuapa',
        'Santa Ana',
        'Casa Blanca, Sitio Arqueológico',
        'orgánico, vidrio',
        '8:30 a.m. - 3:30 p.m.',
        'MARN',
        'Compostaje comunitario',
        ST_SetSRID(ST_MakePoint(-89.6803, 13.9867), 4326)
    ),
    -- La Libertad (3 puntos)
    (
        'Recicla Playa El Tunco',
        'La Libertad',
        'Km 38.5 Carretera Litoral',
        'plástico, latas',
        '24/7',
        'Surf Recicla',
        'Contenedores en zona turística',
        ST_SetSRID(ST_MakePoint(-89.3815, 13.4925), 4326)
    ),
    (
        'Centro de Acopio La Libertad',
        'La Libertad',
        'Mercado Municipal, Calle Principal',
        'papel, cartón, electrónicos',
        '7:00 a.m. - 4:00 p.m.',
        'Alcaldía La Libertad',
        'Programa municipal',
        ST_SetSRID(ST_MakePoint(-89.3221, 13.4882), 4326)
    ),
    (
        'EcoParque San Andrés',
        'La Libertad',
        'Ruinas de San Andrés',
        'vidrio, plástico, orgánico',
        '9:00 a.m. - 4:00 p.m.',
        'CULTURA',
        'Punto cultural con reciclaje',
        ST_SetSRID(ST_MakePoint(-89.4400, 13.7967), 4326)
    ),
    -- Sonsonate (2 puntos)
    (
        'Reciclaje Puerto Acajutla',
        'Sonsonate',
        'Muelle Turístico',
        'metal, redes de pesca',
        '8:00 a.m. - 3:00 p.m.',
        'Asociación Pescadores',
        'Reciclaje de materiales marinos',
        ST_SetSRID(ST_MakePoint(-89.8342, 13.5925), 4326)
    ),
    (
        'Centro Juayúa',
        'Sonsonate',
        'Feria Gastronómica',
        'orgánico, vidrio',
        'Fines de semana',
        'Comité Turístico',
        'Reciclaje durante ferias',
        ST_SetSRID(ST_MakePoint(-89.7453, 13.8414), 4326)
    ),
    -- Usulután (1 punto)
    (
        'Reciclaje Bahía Jiquilisco',
        'Usulután',
        'Reserva de Biosfera',
        'plástico, redes',
        '8:00 a.m. - 2:00 p.m.',
        'PROCOSARA',
        'Protección de manglares',
        ST_SetSRID(ST_MakePoint(-88.5567, 13.3097), 4326)
    ),
    -- San Miguel (1 punto)
    (
        'EcoEstadio Cuscatlán',
        'San Miguel',
        'Estadio Juan Francisco Barraza',
        'plástico, latas',
        'Eventos deportivos',
        'Alcaldía San Miguel',
        'Punto temporal en eventos',
        ST_SetSRID(ST_MakePoint(-88.1264, 13.4769), 4326)
    ),
    -- Chalatenango (1 punto)
    (
        'Reciclaje La Palma',
        'Chalatenango',
        'Centro Artesanal',
        'papel, textiles',
        '9:00 a.m. - 4:00 p.m.',
        'Artesanos La Palma',
        'Reciclaje de materiales artesanales',
        ST_SetSRID(ST_MakePoint(-89.1694, 14.3219), 4326)
    );

--Para Saber la Ubicacion CErca de Mi Geografia
SELECT
    nombre,
    direccion,
    ST_Distance(
        ubicacion :: geography,
        ST_SetSRID(ST_MakePoint(-89.2, 13.7), 4326) :: geography
    ) / 1000 AS distancia_km
FROM
    puntos_recoleccion
WHERE
    ST_DWithin(
        ubicacion :: geography,
        ST_SetSRID(ST_MakePoint(-89.2, 13.7), 4326) :: geography,
        50000 -- 50 km de radio
    )
ORDER BY
    distancia_km;