---
name: Arranque del Proyecto
overview: "Guía completa y detallada para poner en marcha el proyecto Mascotas Perdidas: base de datos MariaDB, backend Spring Boot (Java 17) y frontend Angular 17."
todos: []
isProject: false
---

# Guía de Arranque — Mascotas Perdidas

## Prerequisitos

Verifica que tienes instalado lo siguiente antes de empezar:

- **Java 17+** — `java -version`
- **Maven 3.8+** — `mvn -version`
- **Node.js 20+** — `node -v`
- **npm 10+** — `npm -v`
- **Angular CLI 17** — `ng version`
- **MariaDB 10.6+** (el proyecto usa MariaDB, no MySQL puro) — `mysql --version`

Si Angular CLI no está instalado globalmente:
```bash
npm install -g @angular/cli@17
```

---

## PASO 1 — Base de Datos (MariaDB)

### 1.1 Iniciar el servicio MariaDB

En Windows (PowerShell como administrador):
```powershell
net start MariaDB
# o bien, según el nombre de tu servicio:
net start MySQL
```

### 1.2 Crear la base de datos y el usuario

Entra como root:
```bash
mysql -u root -p
```

Ejecuta estas sentencias dentro de la consola MySQL/MariaDB:
```sql
CREATE DATABASE IF NOT EXISTS mascotas_perdidas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'mp_user'@'localhost' IDENTIFIED BY 'mp_password';

GRANT ALL PRIVILEGES ON mascotas_perdidas.* TO 'mp_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

> La contraseña `mp_password` es la que está configurada en [`backend/src/main/resources/application.yml`](backend/src/main/resources/application.yml).

### 1.3 Cargar el schema

```bash
mysql -u mp_user -p mascotas_perdidas < database/schema.sql
```

Introduce la contraseña `mp_password` cuando se solicite.

El script crea las tablas: `roles`, `users`, `user_roles`, `reports` y más. También inserta los roles `ROLE_USER` y `ROLE_ADMIN`.

### 1.4 Cargar los datos de prueba

```bash
mysql -u mp_user -p mascotas_perdidas < database/seed.sql
```

Esto crea usuarios de prueba (contraseña `Test1234!` con BCrypt) y reportes de ejemplo.

### 1.5 Verificar

```bash
mysql -u mp_user -p mascotas_perdidas -e "SHOW TABLES;"
```

Debes ver: `contact_messages`, `report_images`, `reports`, `roles`, `user_roles`, `users`.

---

## PASO 2 — Backend Spring Boot (puerto 8080)

### 2.1 Revisar la configuración

El archivo [`backend/src/main/resources/application.yml`](backend/src/main/resources/application.yml) ya tiene:
- Puerto: `8080`
- BBDD: `mascotas_perdidas` / `mp_user` / `mp_password`
- CORS origin permitido: `http://localhost:4200`
- Directorio de subidas: `./uploads`
- JWT expiration: 24h

No es necesario modificar nada para el entorno de desarrollo.

### 2.2 Crear la carpeta de uploads

Spring necesita esta carpeta para guardar las imágenes subidas:
```powershell
mkdir "backend\uploads"
```

### 2.3 Arrancar el backend

```powershell
cd backend
mvn spring-boot:run
```

Primera ejecución: Maven descargará las dependencias (~2-3 min). Espera ver en el log:

```
Started MascotasPerdidasApplication in X.XXX seconds
```

Si quieres habilitar logs SQL detallados (perfil dev):
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### 2.4 Verificar el backend

Abre en el navegador o usa curl:
```
http://localhost:8080/api/reports
```

Debe devolver un JSON con los reportes cargados en seed.sql (o array vacío si no se cargó seed).

---

## PASO 3 — Frontend Angular (puerto 4200)

### 3.1 Instalar dependencias

```powershell
cd frontend
npm install
```

Esto instala Angular 17, Tailwind CSS 3.4, RxJS y el resto de dependencias del [`frontend/package.json`](frontend/package.json).

### 3.2 Verificar el proxy

El archivo [`frontend/proxy.conf.json`](frontend/proxy.conf.json) ya redirige `/api/*` → `http://localhost:8080`:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

El proxy está configurado en [`frontend/angular.json`](frontend/angular.json) línea 63 (`proxyConfig`), por lo que `ng serve` lo activa automáticamente.

### 3.3 Arrancar el frontend

```powershell
ng serve
```

Espera ver:
```
✔ Compiled successfully.
Local:   http://localhost:4200/
```

### 3.4 Verificar la app

Abre `http://localhost:4200` en el navegador.

Credenciales de prueba (cargadas por seed.sql):
- Admin: (ver seed.sql — email de admin + contraseña `Test1234!`)
- Usuario normal: (ver seed.sql — email de usuario + contraseña `Test1234!`)

---

## Resumen de puertos y dependencias

```
Navegador :4200  →  Angular (ng serve)
                        ↓ /api/*  (proxy)
                    Backend :8080  →  Spring Boot
                                          ↓
                                    MariaDB :3306
                                    mascotas_perdidas
```

## Problemas frecuentes

- **Puerto 8080 ocupado:** `netstat -ano | findstr :8080` para ver el PID y cerrarlo.
- **Puerto 4200 ocupado:** `ng serve --port 4201` (ajusta proxy target si cambias el backend).
- **Error "Access denied" en MariaDB:** Asegúrate de que el usuario `mp_user` existe y tiene privilegios sobre `mascotas_perdidas`.
- **`mvn` no reconocido:** Agrega Maven al PATH o usa el wrapper `mvnw` si existiera.
- **`ng` no reconocido:** Ejecuta `npm install -g @angular/cli@17` y reinicia la terminal.
