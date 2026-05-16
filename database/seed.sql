-- =============================================================
-- Mascotas Perdidas — Datos de ejemplo (seed)
-- Contraseña para todos los usuarios de prueba: Test1234!
-- Hash BCrypt generado con cost=10
-- =============================================================

SET NAMES utf8mb4;

-- Usuario administrador
INSERT IGNORE INTO users (id, username, email, password, full_name, phone) VALUES
(1, 'admin', 'admin@mascotasperdidas.es',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'Administrador', '+34 600 000 001');

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1), (1, 2);

-- Usuarios de ejemplo
INSERT IGNORE INTO users (id, username, email, password, full_name, phone) VALUES
(2, 'maria_garcia', 'maria@example.com',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'María García', '+34 612 345 678'),
(3, 'carlos_rod', 'carlos@example.com',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'Carlos Rodríguez', '+34 623 456 789'),
(4, 'ana_lopez', 'ana@example.com',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'Ana López', '+34 634 567 890'),
(5, 'pedro_mart', 'pedro@example.com',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'Pedro Martínez', '+34 645 678 901'),
(6, 'laura_sanch', 'laura@example.com',
 '$2a$10$7GjZnBJ.W/I7ZDj7wH8XDejuL4aXk0XaCVwXVFB.X4Y0J2SipHJPy',
 'Laura Sánchez', '+34 656 789 012');

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(2, 1),(3, 1),(4, 1),(5, 1),(6, 1);

-- Reportes de ejemplo
INSERT IGNORE INTO reports
  (id, status, animal_type, name, breed, color, size, event_date, description,
   distinctive_features, location_text, city, province,
   contact_name, contact_phone, contact_email, published_by, active)
VALUES
(1, 'LOST',  'DOG', 'Max',   'Labrador Retriever', 'Dorado',    'LARGE',  '2024-11-28',
  'Perro labrador muy amigable, se perdió cerca del parque. Responde a su nombre y le encanta jugar con pelotas.',
  'Collar rojo con chapa de identificación', 'Parque del Retiro', 'Madrid', 'Madrid',
  'María García', '+34 612 345 678', 'maria@example.com', 2, 1),

(2, 'FOUND', 'CAT', 'Luna',  'Siamés',             'Gris claro','SMALL',  '2024-11-29',
  'Gata siamesa encontrada cerca de la estación. Es muy tímida pero dócil. Parece estar bien cuidada.',
  'Ojos azules, collar morado', 'Estación de Atocha', 'Madrid', 'Madrid',
  'Carlos Rodríguez', '+34 623 456 789', 'carlos@example.com', 3, 1),

(3, 'FOUND', 'DOG', 'Rocky', 'Pastor Alemán',      'Negro y marrón','LARGE','2024-11-30',
  'Perro pastor alemán encontrado deambulando. Está bien cuidado y parece ser doméstico.',
  'Cicatriz pequeña en oreja derecha', 'Barrio de Salamanca', 'Madrid', 'Madrid',
  'Ana López', '+34 634 567 890', 'ana@example.com', 4, 1),

(4, 'LOST',  'CAT', 'Misu',  'Europeo común',      'Naranja',    'SMALL',  '2024-12-01',
  'Gato naranja muy cariñoso que salió por la ventana y no ha regresado. Le gustan las caricias.',
  'Mancha blanca en el pecho', 'Calle Gran Vía', 'Madrid', 'Madrid',
  'Pedro Martínez', '+34 645 678 901', 'pedro@example.com', 5, 1),

(5, 'LOST',  'DOG', 'Lola',  'Beagle',             'Tricolor',   'MEDIUM', '2024-12-02',
  'Beagle muy juguetona desaparecida en el parque. Tiene microchip. Recompensa.',
  'Collar azul con cascabel', 'Parque de El Retiro', 'Madrid', 'Madrid',
  'Laura Sánchez', '+34 656 789 012', 'laura@example.com', 6, 1),

(6, 'FOUND', 'BIRD','Pipo',  'Periquito',           'Verde y amarillo','SMALL','2024-12-03',
  'Periquito encontrado en el balcón. Parece domesticado, habla algunas palabras.',
  'Anilla azul en la pata izquierda', 'Calle Alcalá', 'Madrid', 'Madrid',
  'María García', '+34 612 345 678', 'maria@example.com', 2, 1),

(7, 'LOST',  'DOG', 'Bruno', 'Bulldog Francés',    'Atigrado',   'SMALL',  '2024-12-04',
  'Bulldog francés muy dócil. Se escapó por la puerta. Necesita medicación diaria.',
  'Oreja cortada parcialmente, collar negro', 'Barrio de Malasaña', 'Madrid', 'Madrid',
  'Carlos Rodríguez', '+34 623 456 789', 'carlos@example.com', 3, 1),

(8, 'FOUND', 'DOG', NULL,    'Mestizo',             'Blanco y negro','MEDIUM','2024-12-05',
  'Perro mestizo encontrado en la calle. No tiene collar. Muy tranquilo y obediente.',
  NULL, 'Avenida de América', 'Madrid', 'Madrid',
  'Ana López', '+34 634 567 890', 'ana@example.com', 4, 1),

(9, 'LOST',  'CAT', 'Nala',  'Persa',              'Blanco',     'MEDIUM', '2024-12-06',
  'Gata persa muy asustadiza. Salió al patio y no ha vuelto. Tiene las vacunas al día.',
  'Pelo largo, lazo rosa en el cuello', 'Barrio de Lavapiés', 'Madrid', 'Madrid',
  'Pedro Martínez', '+34 645 678 901', 'pedro@example.com', 5, 1),

(10,'FOUND', 'CAT', NULL,    'Europeo',             'Negro',      'SMALL',  '2024-12-07',
  'Gato negro encontrado mojado bajo un coche. Está en buen estado. Busca dueño.',
  'Sin collar, muy sociable', 'Calle Fuencarral', 'Madrid', 'Madrid',
  'Laura Sánchez', '+34 656 789 012', 'laura@example.com', 6, 1);
