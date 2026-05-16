# Guía de Despliegue — Mascotas Perdidas

## Requisitos del servidor

- Ubuntu 22.04 (o similar)
- Java 17+
- MariaDB 10.6+
- Nginx
- Node.js 20+ (solo para el build del frontend)
- Certificado SSL (Certbot / Let's Encrypt)

## 1. Base de datos en producción

```bash
sudo mysql -u root -p
CREATE DATABASE mascotas_perdidas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mp_user'@'localhost' IDENTIFIED BY 'CONTRASEÑA_SEGURA';
GRANT ALL ON mascotas_perdidas.* TO 'mp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

mysql -u mp_user -p mascotas_perdidas < schema.sql
mysql -u mp_user -p mascotas_perdidas < seed.sql
```

## 2. Backend Spring Boot

### Build del JAR

```bash
cd backend
mvn clean package -DskipTests
```

### Configuración de producción

Crear `/etc/mascotas-perdidas/application-prod.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3306/mascotas_perdidas
    username: mp_user
    password: CONTRASEÑA_SEGURA
app:
  jwt-secret: BASE64_DE_256_BITS_ALEATORIO
  jwt-expiration-ms: 86400000
  upload-dir: /var/www/mascotas_perdidas/uploads
  cors-origins: https://tudominio.com
```

Generar un secreto seguro:
```bash
openssl rand -base64 32
```

### Servicio systemd

```ini
# /etc/systemd/system/mascotas-perdidas.service
[Unit]
Description=Mascotas Perdidas API
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/mascotas-perdidas
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod \
  -Dspring.config.additional-location=/etc/mascotas-perdidas/ \
  mascotas-perdidas-backend-1.0.0.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mascotas-perdidas
```

## 3. Frontend Angular

```bash
cd frontend
npm ci
npm run build:prod
```

Los archivos quedan en `dist/mascotas-perdidas/browser/`.

Copiarlos al servidor:
```bash
rsync -avz dist/mascotas-perdidas/browser/ user@servidor:/var/www/mascotas_perdidas/html/
```

## 4. Nginx

```nginx
# /etc/nginx/sites-available/mascotas-perdidas
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;

    ssl_certificate     /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    root /var/www/mascotas_perdidas/html;
    index index.html;

    # Angular SPA: todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy al backend Spring Boot
    location /api/ {
        proxy_pass         http://localhost:8080;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        client_max_body_size 15M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mascotas-perdidas /etc/nginx/sites-enabled/
sudo certbot --nginx -d tudominio.com
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Carpeta de uploads

```bash
sudo mkdir -p /var/www/mascotas_perdidas/uploads
sudo chown www-data:www-data /var/www/mascotas_perdidas/uploads
sudo chmod 750 /var/www/mascotas_perdidas/uploads
```

## 6. Variables de entorno recomendadas para CI/CD

| Variable           | Descripción                          |
|--------------------|--------------------------------------|
| `DB_URL`           | JDBC URL completa de MariaDB         |
| `DB_USER`          | Usuario de base de datos             |
| `DB_PASS`          | Contraseña de base de datos          |
| `JWT_SECRET`       | Secreto Base64 de 256 bits           |
| `UPLOAD_DIR`       | Directorio de subida de imágenes     |
| `CORS_ORIGINS`     | URL del frontend (sin trailing slash)|
