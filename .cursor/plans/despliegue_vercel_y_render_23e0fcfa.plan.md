---
name: Despliegue Vercel y Render
overview: Desplegar el frontend Angular 17 en Vercel y el backend Spring Boot en Render, usando Railway como base de datos MySQL en la nube. Requiere modificar application.yml para aceptar variables de entorno y añadir vercel.json para el proxy y routing SPA.
todos:
  - id: railway-db
    content: Crear base de datos MySQL en Railway y ejecutar schema.sql + seed.sql
    status: pending
  - id: app-yml
    content: Modificar application.yml para usar variables de entorno ${VAR:fallback}
    status: in_progress
  - id: render-deploy
    content: Crear Web Service en Render y configurar variables de entorno
    status: pending
  - id: vercel-json
    content: Crear frontend/vercel.json con proxy /api/* y routing SPA
    status: pending
  - id: vercel-deploy
    content: Crear proyecto en Vercel apuntando a frontend/ con build:prod
    status: pending
  - id: cors-update
    content: Actualizar APP_CORS_ORIGINS en Render con la URL final de Vercel
    status: pending
isProject: false
---

# Despliegue: Vercel (Frontend) + Render (Backend)

## Arquitectura

```mermaid
flowchart LR
  User -->|HTTPS| Vercel["Vercel\nAngular SPA :443"]
  Vercel -->|"Rewrite /api/*"| Render["Render\nSpring Boot :PORT"]
  Render -->|JDBC| Railway[("Railway\nMySQL DB")]
```

> El frontend usa rutas relativas `/api/...` — ningún código cambia. Un rewrite en `vercel.json` actúa de proxy transparente hacia Render.

---

## Aviso importante — Almacenamiento de imágenes

Render en el plan gratuito tiene **sistema de ficheros efímero**: cualquier imagen subida (`./uploads`) se pierde al redesplegar. Para producción real necesitarías Cloudinary o AWS S3. Por ahora el resto de la app funciona correctamente; las subidas de fotos de mascotas simplemente no persisten entre deploys.

---

## Orden de despliegue

```
1. Railway (BD)  →  2. Render (Backend)  →  3. Vercel (Frontend)
```

Cada paso necesita datos del anterior.

---

## Paso 1 — Base de datos en Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. **New Project → Database → MySQL**
3. En la pestaña **Connect** copiar la variable `DATABASE_URL` (formato: `mysql://user:pass@host:port/railway`)
4. Convertirla a formato JDBC para Spring:
   `jdbc:mariadb://host:port/railway?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC`
5. Ejecutar los scripts desde Railway's **Query** tab o desde tu máquina local apuntando al host de Railway:

```powershell
mysql -u <user> -h <host> -P <port> -p <dbname> < database/schema.sql
mysql -u <user> -h <host> -P <port> -p <dbname> < database/seed.sql
```

---

## Paso 2 — Backend en Render

### 2.1 Cambio de código: `application.yml` acepta variables de entorno

Modificar [`backend/src/main/resources/application.yml`](backend/src/main/resources/application.yml) para que todos los valores sensibles vengan de variables de entorno con fallback local:

```yaml
server:
  port: ${PORT:8080}          # Render asigna PORT dinámicamente

spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mariadb://localhost:3306/mascotas_perdidas?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Europe/Madrid}
    username: ${SPRING_DATASOURCE_USERNAME:mp_user}
    password: ${SPRING_DATASOURCE_PASSWORD:mp_password}
    driver-class-name: org.mariadb.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: ${JPA_DDL_AUTO:update}
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MariaDBDialect
        format_sql: true
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 15MB

app:
  jwt-secret: ${APP_JWT_SECRET:c2VjcmV0S2V5Rm9yTWFzY290YXNQZXJkaWRhc0p3dFNlY3JldEtleUZvck1hc2NvdGFzUGVyZGlkYXM=}
  jwt-expiration-ms: 86400000
  upload-dir: ${UPLOAD_DIR:./uploads}
  cors-origins: ${APP_CORS_ORIGINS:http://localhost:4200}

logging:
  level:
    com.mascotasperdidas: INFO
    org.springframework.security: WARN
```

### 2.2 Crear el servicio en Render

1. Ir a [render.com](https://render.com) → **New → Web Service**
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root Directory:** `backend`
   - **Environment:** `Java`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/mascotas-perdidas-backend-1.0.0.jar`

### 2.3 Variables de entorno en Render

En **Environment → Environment Variables** añadir:

| Variable | Valor |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mariadb://host:port/railway?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | usuario de Railway |
| `SPRING_DATASOURCE_PASSWORD` | contraseña de Railway |
| `APP_JWT_SECRET` | secreto Base64 nuevo (genera con `openssl rand -base64 32`) |
| `APP_CORS_ORIGINS` | URL de Vercel (se añade después del paso 3, ej: `https://mascotas.vercel.app`) |

> Render expone automáticamente la variable `PORT` — no hace falta añadirla manualmente.

### 2.4 Verificar despliegue del backend

Una vez desplegado, la URL pública de Render tendrá el formato `https://mascotas-perdidas-backend.onrender.com`. Verificar:

```
https://mascotas-perdidas-backend.onrender.com/api/auth/test
```

---

## Paso 3 — Frontend en Vercel

### 3.1 Añadir `vercel.json` en la carpeta `frontend/`

Este archivo nuevo hace dos cosas: redirige todas las peticiones `/api/*` al backend en Render (proxy), y envía todas las rutas desconocidas a `index.html` (necesario para SPA con Angular Router).

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://mascotas-perdidas-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> Sustituir `mascotas-perdidas-backend.onrender.com` con la URL real de tu servicio Render del paso 2.

### 3.2 Crear el proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com) → **New Project**
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Angular`
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `dist/mascotas-perdidas/browser`

### 3.3 Actualizar CORS en Render

Una vez Vercel asigne la URL de producción (p. ej. `https://mascotas-perdidas.vercel.app`), actualizar la variable `APP_CORS_ORIGINS` en Render con esa URL exacta.

---

## Pasos finales

1. En Render actualizar `APP_CORS_ORIGINS` con la URL final de Vercel
2. Verificar login con las credenciales de seed: `admin` / `Test1234!`
3. (Opcional) Configurar dominio personalizado en Vercel y actualizar CORS de nuevo

---

## Resumen de archivos a modificar o crear

- **Modificar** [`backend/src/main/resources/application.yml`](backend/src/main/resources/application.yml) — variables de entorno con `${VAR:fallback}`
- **Crear** `frontend/vercel.json` — proxy `/api/*` y routing SPA
