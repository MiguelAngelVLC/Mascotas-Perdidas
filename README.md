# Mascotas Perdidas

Plataforma web completa para reportar y buscar mascotas perdidas o encontradas.

## Tecnologías

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | Angular 17 + Tailwind CSS           |
| Backend    | Spring Boot 3.2 + Spring Security   |
| Base datos | MariaDB 10.6+                       |
| Auth       | JWT (JJWT 0.12)                     |
| Imágenes   | Multipart upload al sistema de archivos del servidor |

## Estructura del proyecto

```
MascotasPerdidas/
├── frontend/     # Angular standalone app
├── backend/      # Spring Boot REST API
├── database/     # Scripts SQL (schema + seed)
└── docs/         # Guía de estilos y despliegue
```

## Requisitos previos

- Node.js 20+ y npm 10+
- Angular CLI 17: `npm install -g @angular/cli`
- Java 17+ y Maven 3.8+
- MariaDB 10.6+ en ejecución local (puerto 3306)

## Configuración de base de datos

```sql
CREATE DATABASE mascotas_perdidas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mp_user'@'localhost' IDENTIFIED BY 'mp_password';
GRANT ALL PRIVILEGES ON mascotas_perdidas.* TO 'mp_user'@'localhost';
FLUSH PRIVILEGES;
```

Después ejecutar los scripts SQL:
```bash
mysql -u mp_user -p mascotas_perdidas < database/schema.sql
mysql -u mp_user -p mascotas_perdidas < database/seed.sql
```

## Arrancar el backend

```bash
cd backend
mvn spring-boot:run
```
Disponible en `http://localhost:8080`

## Arrancar el frontend

```bash
cd frontend
npm install
ng serve
```
Disponible en `http://localhost:4200`

## Variables de entorno para producción

Crear `backend/src/main/resources/application-prod.yml` con:

```yaml
spring:
  datasource:
    url: jdbc:mariadb://<HOST>:3306/mascotas_perdidas
    username: <DB_USER>
    password: <DB_PASS>
app:
  jwt-secret: <SECRET_256_BIT>
  upload-dir: /var/www/mascotas_perdidas/uploads
  cors-origins: https://tudominio.com
```

## Paleta de colores

| Variable           | Hex       | Uso                         |
|--------------------|-----------|----------------------------|
| `primary`          | `#023d7f` | Fondo principal             |
| `primary-light`    | `#529bee` | Activos, botones primarios  |
| `teal`             | `#4ecdc4` | ENCONTRADO, CTA, logo       |
| `red-pet`          | `#ff6b6b` | PERDIDO, alertas            |
| `yellow-pet`       | `#ffe66d` | Estadísticas totales        |
| `nav`              | `#33a9c7` | Barra de navegación         |
