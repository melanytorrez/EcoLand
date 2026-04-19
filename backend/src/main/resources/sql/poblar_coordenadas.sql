-- ============================================
-- Script: Poblar coordenadas de Puntos Verdes
-- Proyecto: EcoLand (Sprint 4 - US17)
-- Descripción: Script para actualizar coordenadas
--              reales y crear nuevos puntos.
-- NOTA: Ejecutar el backend primero para que 
--       Hibernate cree las columnas automáticamente.
-- ============================================

-- 1. Actualizar puntos existentes con coordenadas reales
SET SQL_SAFE_UPDATES = 0;
UPDATE puntos_verdes SET latitud = -17.3936, longitud = -66.1571 WHERE nombre LIKE '%Plaza Colón%';
UPDATE puntos_verdes SET latitud = -17.4030, longitud = -66.1685 WHERE nombre LIKE '%Cancha%';
UPDATE puntos_verdes SET latitud = -17.3780, longitud = -66.1560 WHERE nombre LIKE '%Tunari%';

-- 3. Insertar nuevos puntos verdes con coordenadas
INSERT INTO puntos_verdes (nombre, direccion, zona, estado, latitud, longitud) VALUES
('Punto Verde Hupermall', 'Av. Blanco Galindo km 4.5', 'Oeste', 'ACTIVO', -17.3945, -66.1895),
('Punto Verde UMSS', 'Campus Universitario UMSS', 'Centro', 'ACTIVO', -17.3940, -66.1480),
('Punto Verde IC Norte', 'Plaza IC Norte - Av. Circunvalación', 'Norte', 'ACTIVO', -17.3720, -66.1510),
('Punto Verde Fidel Anze', 'Parque Fidel Anze, Zona Sur', 'Sur', 'ACTIVO', -17.4120, -66.1580),
('Punto Verde Cala Cala', 'Plaza de Cala Cala', 'Norte', 'ACTIVO', -17.3810, -66.1630);

-- 4. Poblar horarios para los nuevos puntos
-- Hupermall (Lun-Sáb)
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'LUNES', '09:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MARTES', '09:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MIERCOLES', '09:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'JUEVES', '09:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'VIERNES', '09:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'SABADO', '10:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';

-- UMSS (Lun-Vie)
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'LUNES', '07:00:00', '17:00:00' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MARTES', '07:00:00', '17:00:00' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MIERCOLES', '07:00:00', '17:00:00' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'JUEVES', '07:00:00', '17:00:00' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'VIERNES', '07:00:00', '17:00:00' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';

-- IC Norte (Lun-Dom)
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'LUNES', '08:00:00', '22:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MARTES', '08:00:00', '22:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MIERCOLES', '08:00:00', '22:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'JUEVES', '08:00:00', '22:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'VIERNES', '08:00:00', '22:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'SABADO', '09:00:00', '21:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'DOMINGO', '10:00:00', '20:00:00' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';

-- Fidel Anze (Lun-Vie)
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'LUNES', '08:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MARTES', '08:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MIERCOLES', '08:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'JUEVES', '08:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'VIERNES', '08:00:00', '18:00:00' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';

-- Cala Cala (Lun-Sáb)
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'LUNES', '07:30:00', '19:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MARTES', '07:30:00', '19:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'MIERCOLES', '07:30:00', '19:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'JUEVES', '07:30:00', '19:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'VIERNES', '07:30:00', '19:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_horarios (punto_verde_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 'SABADO', '08:00:00', '14:00:00' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';

-- 5. Poblar materiales para los nuevos puntos
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Plástico' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Papel' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Vidrio' FROM puntos_verdes WHERE nombre LIKE '%Hupermall%';

INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Papel' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Cartón' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Plástico' FROM puntos_verdes WHERE nombre LIKE '%UMSS%';

INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Electrónicos' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Pilas' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Metal' FROM puntos_verdes WHERE nombre LIKE '%IC Norte%';

INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Vidrio' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Aceite' FROM puntos_verdes WHERE nombre LIKE '%Fidel Anze%';

INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Plástico' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Metal' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
INSERT INTO punto_verde_materiales (punto_verde_id, tipo_material)
SELECT id, 'Papel' FROM puntos_verdes WHERE nombre LIKE '%Cala Cala%';
