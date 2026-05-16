# Modelo Entidad-Relación — Mascotas Perdidas

## Diagrama ER (texto)

```
users (1) ──< user_roles >── (N) roles
users (1) ──< reports (published_by, nullable)
reports (1) ──< report_images
```

## Entidades

### users
| Columna     | Tipo           | Restricciones              |
|-------------|----------------|----------------------------|
| id          | BIGINT UNSIGNED| PK, AUTO_INCREMENT         |
| username    | VARCHAR(50)    | NOT NULL, UNIQUE           |
| email       | VARCHAR(100)   | NOT NULL, UNIQUE           |
| password    | VARCHAR(255)   | NOT NULL (BCrypt hash)     |
| full_name   | VARCHAR(120)   | NOT NULL                   |
| phone       | VARCHAR(20)    | NULLABLE                   |
| avatar_url  | VARCHAR(500)   | NULLABLE                   |
| enabled     | TINYINT(1)     | DEFAULT 1                  |
| created_at  | DATETIME       | DEFAULT CURRENT_TIMESTAMP  |
| updated_at  | DATETIME       | ON UPDATE CURRENT_TIMESTAMP|

### roles
| Columna | Tipo           | Restricciones    |
|---------|----------------|------------------|
| id      | TINYINT UNSIGNED| PK              |
| name    | VARCHAR(20)    | UNIQUE           |

Valores: `ROLE_USER`, `ROLE_ADMIN`

### user_roles (N:M)
| Columna | Tipo           | FK                   |
|---------|----------------|----------------------|
| user_id | BIGINT UNSIGNED| → users.id CASCADE   |
| role_id | TINYINT UNSIGNED| → roles.id          |

### reports
| Columna              | Tipo                          | Restricciones              |
|----------------------|-------------------------------|----------------------------|
| id                   | BIGINT UNSIGNED               | PK, AUTO_INCREMENT         |
| status               | ENUM('LOST','FOUND')          | NOT NULL                   |
| animal_type          | ENUM('DOG','CAT','BIRD','OTHER')| NOT NULL                  |
| name                 | VARCHAR(100)                  | NULLABLE                   |
| breed                | VARCHAR(100)                  | NULLABLE                   |
| color                | VARCHAR(100)                  | NULLABLE                   |
| size                 | ENUM('SMALL','MEDIUM','LARGE')| NULLABLE                   |
| event_date           | DATE                          | NOT NULL                   |
| description          | TEXT                          | NULLABLE                   |
| distinctive_features | VARCHAR(500)                  | NULLABLE                   |
| location_text        | VARCHAR(300)                  | NULLABLE                   |
| city                 | VARCHAR(100)                  | NULLABLE (índice)          |
| province             | VARCHAR(100)                  | NULLABLE                   |
| contact_name         | VARCHAR(120)                  | NOT NULL                   |
| contact_phone        | VARCHAR(20)                   | NOT NULL                   |
| contact_email        | VARCHAR(100)                  | NULLABLE                   |
| published_by         | BIGINT UNSIGNED               | FK → users.id SET NULL     |
| active               | TINYINT(1)                    | DEFAULT 1 (índice)         |
| created_at           | DATETIME                      | DEFAULT CURRENT_TIMESTAMP  |
| updated_at           | DATETIME                      | ON UPDATE CURRENT_TIMESTAMP|

**Índices**: status, animal_type, city, event_date, published_by, active

### report_images
| Columna    | Tipo           | Restricciones              |
|------------|----------------|----------------------------|
| id         | BIGINT UNSIGNED| PK, AUTO_INCREMENT         |
| report_id  | BIGINT UNSIGNED| FK → reports.id CASCADE    |
| filename   | VARCHAR(300)   | NOT NULL (UUID + extensión)|
| is_primary | TINYINT(1)     | DEFAULT 0                  |
| created_at | DATETIME       | DEFAULT CURRENT_TIMESTAMP  |

### contact_messages
| Columna    | Tipo           | Restricciones             |
|------------|----------------|---------------------------|
| id         | BIGINT UNSIGNED| PK, AUTO_INCREMENT        |
| name       | VARCHAR(120)   | NOT NULL                  |
| email      | VARCHAR(100)   | NOT NULL                  |
| subject    | VARCHAR(200)   | NULLABLE                  |
| message    | TEXT           | NOT NULL                  |
| read_at    | DATETIME       | NULLABLE                  |
| created_at | DATETIME       | DEFAULT CURRENT_TIMESTAMP |

## Decisiones de diseño

- **Borrado lógico** en `reports`: campo `active = 0` en lugar de borrar la fila, para mantener integridad referencial con imágenes y evitar pérdida de datos.
- **SET NULL** en `reports.published_by` al borrar usuario: los reportes permanecen visibles aunque el usuario se elimine.
- **UUID como nombre de archivo** en `report_images.filename`: evita colisiones y expone la extensión sin revelar rutas internas.
- **Contraseñas con BCrypt** (cost=10): el hash nunca se almacena en texto plano.
