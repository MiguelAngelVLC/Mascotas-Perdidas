# Paso 1: Compilar la aplicación con Maven usando Eclipse Temurin 17 como JDK
FROM maven:3.8.6-eclipse-temurin-17 AS build 
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Paso 2: Ejecutar la aplicación (Crear la imagen ligera de ejecución)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/mascotas-perdidas-backend-1.0.0.jar app.jar 
ENTRYPOINT ["java","-jar","app.jar", "--server.port=${PORT:8080}"]
