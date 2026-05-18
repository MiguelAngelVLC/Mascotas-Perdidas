# Paso 1: Compilar la aplicación con Maven 
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Paso 2: Ejecutar la aplicación (Crear la imagen ligera de ejecución)
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /target/mascotas-perdidas-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
