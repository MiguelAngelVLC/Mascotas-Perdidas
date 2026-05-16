-- =============================================================
-- Mascotas Perdidas — Schema MariaDB
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- Tabla: roles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(20)      NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_USER'), (2, 'ROLE_ADMIN');

-- -------------------------------------------------------------
-- Tabla: users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    username     VARCHAR(50)      NOT NULL UNIQUE,
    email        VARCHAR(100)     NOT NULL UNIQUE,
    password     VARCHAR(255)     NOT NULL,
    full_name    VARCHAR(120)     NOT NULL,
    phone        VARCHAR(20)      DEFAULT NULL,
    avatar_url   VARCHAR(500)     DEFAULT NULL,
    enabled      TINYINT(1)       NOT NULL DEFAULT 1,
    created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email    (email),
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Tabla: user_roles (relación N:M users <-> roles)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT UNSIGNED  NOT NULL,
    role_id TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Tabla: reports
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    status               ENUM('LOST','FOUND') NOT NULL,
    animal_type          ENUM('DOG','CAT','BIRD','OTHER') NOT NULL DEFAULT 'OTHER',
    name                 VARCHAR(100)    DEFAULT NULL,
    breed                VARCHAR(100)    DEFAULT NULL,
    color                VARCHAR(100)    DEFAULT NULL,
    size                 ENUM('SMALL','MEDIUM','LARGE') DEFAULT NULL,
    event_date           DATE            NOT NULL,
    description          TEXT            DEFAULT NULL,
    distinctive_features VARCHAR(500)    DEFAULT NULL,
    location_text        VARCHAR(300)    DEFAULT NULL,
    city                 VARCHAR(100)    DEFAULT NULL,
    province             VARCHAR(100)    DEFAULT NULL,
    contact_name         VARCHAR(120)    NOT NULL,
    contact_phone        VARCHAR(20)     NOT NULL,
    contact_email        VARCHAR(100)    DEFAULT NULL,
    published_by         BIGINT UNSIGNED DEFAULT NULL,
    active               TINYINT(1)      NOT NULL DEFAULT 1,
    created_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_reports_status      (status),
    INDEX idx_reports_animal_type (animal_type),
    INDEX idx_reports_city        (city),
    INDEX idx_reports_event_date  (event_date),
    INDEX idx_reports_published   (published_by),
    INDEX idx_reports_active      (active),
    CONSTRAINT fk_reports_user FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Tabla: report_images
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_images (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    report_id  BIGINT UNSIGNED NOT NULL,
    filename   VARCHAR(300)    NOT NULL,
    is_primary TINYINT(1)      NOT NULL DEFAULT 0,
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_ri_report (report_id),
    CONSTRAINT fk_ri_report FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- Tabla: contact_messages
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name       VARCHAR(120)    NOT NULL,
    email      VARCHAR(100)    NOT NULL,
    subject    VARCHAR(200)    DEFAULT NULL,
    message    TEXT            NOT NULL,
    read_at    DATETIME        DEFAULT NULL,
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_cm_read (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
