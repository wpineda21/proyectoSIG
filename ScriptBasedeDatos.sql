-- Habilita la extensión PostGIS en la base de datos, necesaria para trabajar con datos espaciales (geográficos).
CREATE EXTENSION postgis;

-- Crea la tabla 'puntos_recoleccion' que almacenará información de centros de reciclaje o puntos de recolección de residuos.
CREATE TABLE puntos_recoleccion (
    id SERIAL PRIMARY KEY, -- Identificador único autoincremental para cada punto
    nombre VARCHAR(100) NOT NULL, -- Nombre del punto de recolección
    departamento VARCHAR(50) NOT NULL, -- Departamento donde se ubica
    direccion TEXT, -- Dirección detallada del lugar
    tipo_residuo VARCHAR(50) NOT NULL, -- Tipo(s) de residuos que acepta (ej: plástico, llantas)
    horario VARCHAR(50), -- Horario de atención (puede ser nulo)
    gestor VARCHAR(100), -- Institución o persona que gestiona el punto
    notas TEXT, -- Notas adicionales sobre el punto
    periodo VARCHAR(100), -- Periodo de funcionamiento (ej. campaña temporal o permanente)
    fuente VARCHAR(255), -- Fuente de donde se obtuvo la información
    ubicacion GEOMETRY(POINT, 4326) -- Ubicación geográfica en coordenadas WGS84 (latitud/longitud)
);

-- Inserta 6 puntos específicos dedicados a recolección de llantas en distintos departamentos del país.
-- Incluyen ubicación geográfica y, en algunos casos, detalles como fuente de información, periodo o notas.
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

-- Inserta 15 puntos adicionales de reciclaje para residuos generales como papel, vidrio, electrónicos, etc.
-- Se distribuyen en diferentes departamentos como San Salvador, Santa Ana, La Libertad, entre otros.INSERT INTO
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
-- Consulta geoespacial: busca los puntos de recolección dentro de un radio de 50 km desde una ubicación específica.
-- Calcula la distancia en kilómetros desde el punto (-89.2, 13.7) a cada centro cercano.
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


Otros Puntos que se agregaron
-- Insertar 30 puntos adicionales de reciclaje (completando 51 puntos en total)
INSERT INTO puntos_recoleccion (
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
    -- Ahuachapán (2 puntos)
    (
        'Centro de Acopio Ahuachapán', 
        'Ahuachapán', 
        'Barrio El Calvario, frente al Mercado Municipal', 
        'plástico, vidrio, papel', 
        '8:00 a.m. - 4:00 p.m.', 
        'Municipalidad Ahuachapán', 
        'Punto permanente con clasificación', 
        ST_SetSRID(ST_MakePoint(-89.8456, 13.9233), 4326)
    ),
    (
        'Reciclaje Ataco', 
        'Ahuachapán', 
        'Calle Principal, Concepción de Ataco', 
        'vidrio, textiles, papel', 
        '9:00 a.m. - 5:00 p.m.', 
        'Asociación Turística', 
        'Recolección en zona artesanal', 
        ST_SetSRID(ST_MakePoint(-89.8489, 13.8703), 4326)
    ),

    -- Cabañas (2 puntos)
    (
        'EcoCentro Sensuntepeque', 
        'Cabañas', 
        'Colonia San Sebastián, Parque Central', 
        'plástico, metales, electrónicos', 
        '8:30 a.m. - 3:30 p.m.', 
        'Alcaldía Municipal', 
        'Programa municipal de reciclaje', 
        ST_SetSRID(ST_MakePoint(-88.6331, 13.8767), 4326)
    ),
    (
        'Reciclaje Ilobasco', 
        'Cabañas', 
        'Barrio El Centro, cerca de talleres de cerámica', 
        'arcilla, cerámica, vidrio', 
        'Lunes a Sábado 8:00 a.m. - 12:00 m.', 
        'Artesanos Locales', 
        'Reutilización de materiales artesanales', 
        ST_SetSRID(ST_MakePoint(-88.8494, 13.8619), 4326)
    ),

    -- Cuscatlán (3 puntos)
    (
        'Punto Verde Cojutepeque', 
        'Cuscatlán', 
        'Avenida Morazán, frente a Catedral', 
        'papel, cartón, plástico', 
        '24/7', 
        'MARN', 
        'Contenedores inteligentes', 
        ST_SetSRID(ST_MakePoint(-88.9333, 13.7167), 4326)
    ),
    (
        'Recicladora Suchitoto', 
        'Cuscatlán', 
        'Calle a la Laguna, Centro Cultural', 
        'vidrio, textiles, orgánico', 
        '9:00 a.m. - 4:00 p.m.', 
        'Asociación Cultural', 
        'Proyecto sostenible comunitario', 
        ST_SetSRID(ST_MakePoint(-88.9397, 13.9381), 4326)
    ),
    (
        'Centro de Acopio San Ramón', 
        'Cuscatlán', 
        'Cantón San Ramón, Mercado Local', 
        'plástico, latas, tetra pack', 
        '7:00 a.m. - 3:00 p.m.', 
        'Comité Ambiental', 
        'Campaña permanente', 
        ST_SetSRID(ST_MakePoint(-88.9167, 13.6333), 4326)
    ),

    -- La Paz (3 puntos)
    (
        'EcoPlaya San Luis La Herradura', 
        'La Paz', 
        'Km 64 Carretera Litoral', 
        'plástico, redes, vidrio', 
        '8:00 a.m. - 2:00 p.m.', 
        'PROCOSARA', 
        'Protección de ecosistemas marinos', 
        ST_SetSRID(ST_MakePoint(-89.0247, 13.3539), 4326)
    ),
    (
        'Reciclaje Zacatecoluca', 
        'La Paz', 
        'Barrio San Antonio, Mercado Municipal', 
        'papel, cartón, electrónicos', 
        '8:00 a.m. - 4:00 p.m.', 
        'Alcaldía Municipal', 
        'Punto principal del municipio', 
        ST_SetSRID(ST_MakePoint(-88.8694, 13.5000), 4326)
    ),
    (
        'EcoParque San Pedro Masahuat', 
        'La Paz', 
        'Parque Central', 
        'orgánico, vidrio, plástico', 
        '7:30 a.m. - 12:30 p.m.', 
        'MARN', 
        'Programa de compostaje', 
        ST_SetSRID(ST_MakePoint(-89.0436, 13.5436), 4326)
    ),

    -- Morazán (2 puntos)
    (
        'Reciclaje Perquín', 
        'Morazán', 
        'Museo de la Revolución', 
        'plástico, vidrio, metales', 
        '9:00 a.m. - 4:00 p.m.', 
        'Asociación Turística', 
        'Punto cultural histórico', 
        ST_SetSRID(ST_MakePoint(-88.1333, 13.9667), 4326)
    ),
    (
        'Centro de Acopio San Francisco Gotera', 
        'Morazán', 
        'Barrio El Centro, frente a Alcaldía', 
        'papel, cartón, textiles', 
        '8:00 a.m. - 3:00 p.m.', 
        'Municipalidad', 
        'Recolección selectiva', 
        ST_SetSRID(ST_MakePoint(-88.1000, 13.7000), 4326)
    ),

    -- San Vicente (2 puntos)
    (
        'Punto Verde San Vicente', 
        'San Vicente', 
        'Avenida Germán Alcaine, Parque Central', 
        'vidrio, plástico, metales', 
        '8:30 a.m. - 4:30 p.m.', 
        'Alcaldía Municipal', 
        'Contenedores diferenciados', 
        ST_SetSRID(ST_MakePoint(-88.7833, 13.6333), 4326)
    ),
    (
        'Reciclaje Apastepeque', 
        'San Vicente', 
        'Colonia Santa Lucía, Casa de la Cultura', 
        'orgánico, papel, vidrio', 
        'Fines de semana 8:00 a.m. - 12:00 m.', 
        'Comité Ambiental', 
        'Talleres de reciclaje', 
        ST_SetSRID(ST_MakePoint(-88.7833, 13.6667), 4326)
    ),

    -- San Salvador (5 puntos adicionales)
    (
        'EcoPlaza Merliot', 
        'San Salvador', 
        'Plaza Merliot, local #15', 
        'electrónicos, baterías, plástico', 
        '10:00 a.m. - 6:00 p.m.', 
        'Grupo Verde', 
        'Recolección especializada', 
        ST_SetSRID(ST_MakePoint(-89.2528, 13.6769), 4326)
    ),
    (
        'Reciclaje Colonia San Benito', 
        'San Salvador', 
        'Calle La Reforma #225', 
        'papel, vidrio, aluminio', 
        '24/7', 
        'Alcaldía San Salvador', 
        'Estación automática', 
        ST_SetSRID(ST_MakePoint(-89.2400, 13.6980), 4326)
    ),
    (
        'Centro de Acopio Soyapango', 
        'San Salvador', 
        'Mercado Municipal de Soyapango', 
        'cartón, plástico, textiles', 
        '7:00 a.m. - 5:00 p.m.', 
        'Asociación Recicla SV', 
        'Proyecto comunitario', 
        ST_SetSRID(ST_MakePoint(-89.1511, 13.7344), 4326)
    ),
    (
        'EcoParque Cuscatlán', 
        'San Salvador', 
        'Parque Cuscatlán, entrada principal', 
        'plástico, vidrio, orgánico', 
        '6:00 a.m. - 6:00 p.m.', 
        'MARN', 
        'Punto educativo', 
        ST_SetSRID(ST_MakePoint(-89.2297, 13.6922), 4326)
    ),
    (
        'Reciclaje Metrocentro', 
        'San Salvador', 
        'Plaza Centroamérica, nivel 1', 
        'papel, plástico, electrónicos', 
        '9:00 a.m. - 7:00 p.m.', 
        'Grupo Roble', 
        'Alianza comercial', 
        ST_SetSRID(ST_MakePoint(-89.1875, 13.6992), 4326)
    ),

    -- Santa Ana (2 puntos adicionales)
    (
        'Reciclaje Metrocentro Santa Ana', 
        'Santa Ana', 
        'Segundo nivel, área de comidas', 
        'plástico, vidrio, aluminio', 
        '10:00 a.m. - 8:00 p.m.', 
        'Grupo Roble', 
        'Punto en centro comercial', 
        ST_SetSRID(ST_MakePoint(-89.5569, 13.9794), 4326)
    ),
    (
        'Centro de Acopio Chalchuapa', 
        'Santa Ana', 
        'Casa de la Cultura', 
        'textiles, papel, orgánico', 
        '8:00 a.m. - 12:00 m.', 
        'Alcaldía Chalchuapa', 
        'Programa municipal', 
        ST_SetSRID(ST_MakePoint(-89.6803, 13.9867), 4326)
    ),

    -- La Libertad (2 puntos adicionales)
    (
        'Reciclaje Playa San Diego', 
        'La Libertad', 
        'Km 42 Carretera Litoral', 
        'plástico, redes, vidrio', 
        '24/7', 
        'Asociación de Surfistas', 
        'Contenedores playeros', 
        ST_SetSRID(ST_MakePoint(-89.3214, 13.4769), 4326)
    ),
    (
        'EcoCentro Antiguo Cuscatlán', 
        'La Libertad', 
        'Plaza Las Américas', 
        'electrónicos, baterías, metales', 
        '9:00 a.m. - 5:00 p.m.', 
        'Municipalidad', 
        'Punto tecnológico', 
        ST_SetSRID(ST_MakePoint(-89.2414, 13.6736), 4326)
    ),

    -- Sonsonate (2 puntos adicionales)
    (
        'Reciclaje Acajutla', 
        'Sonsonate', 
        'Barrio El Centro, Mercado Municipal', 
        'metal, plástico, redes', 
        '7:00 a.m. - 3:00 p.m.', 
        'Alcaldía Acajutla', 
        'Programa costero', 
        ST_SetSRID(ST_MakePoint(-89.8342, 13.5925), 4326)
    ),
    (
        'Punto Verde Nahuizalco', 
        'Sonsonate', 
        'Centro Artesanal', 
        'textiles, madera, papel', 
        '8:30 a.m. - 4:30 p.m.', 
        'Artesanos Locales', 
        'Reutilización creativa', 
        ST_SetSRID(ST_MakePoint(-89.7367, 13.7775), 4326)
    ),

    -- San Miguel (2 puntos adicionales)
    (
        'Reciclaje Universidad ORM', 
        'San Miguel', 
        'Campus Universitario', 
        'papel, electrónicos, plástico', 
        'Lunes a Viernes 8:00 a.m. - 4:00 p.m.', 
        'Universidad ORM', 
        'Punto educativo', 
        ST_SetSRID(ST_MakePoint(-88.1833, 13.4833), 4326)
    ),
    (
        'EcoMercado San Miguel', 
        'San Miguel', 
        'Mercado Municipal, entrada norte', 
        'orgánico, vidrio, cartón', 
        '6:00 a.m. - 2:00 p.m.', 
        'Alcaldía Municipal', 
        'Proyecto de economía circular', 
        ST_SetSRID(ST_MakePoint(-88.1793, 13.4762), 4326)
    ),

    -- Usulután (1 punto adicional)
    (
        'Reciclaje Puerto El Triunfo', 
        'Usulután', 
        'Muelle Pesquero', 
        'redes, plástico, metal', 
        '7:00 a.m. - 1:00 p.m.', 
        'Cooperativa Pesquera', 
        'Protección de manglares', 
        ST_SetSRID(ST_MakePoint(-88.5500, 13.2833), 4326)
    ),

    -- La Unión (1 punto adicional)
    (
        'EcoCentro La Unión', 
        'La Unión', 
        'Avenida Costera, frente a Gobernación', 
        'vidrio, plástico, metales', 
        '8:00 a.m. - 3:00 p.m.', 
        'Alcaldía Municipal', 
        'Programa costero', 
        ST_SetSRID(ST_MakePoint(-87.8431, 13.3369), 4326)
    ),

    -- Chalatenango (1 punto adicional)
    (
        'Reciclaje El Pital', 
        'Chalatenango', 
        'Base del cerro El Pital', 
        'plástico, vidrio, orgánico', 
        'Fines de semana', 
        'Comité Turístico', 
        'Protección de reserva natural', 
        ST_SetSRID(ST_MakePoint(-89.1289, 14.3878), 4326)
    );