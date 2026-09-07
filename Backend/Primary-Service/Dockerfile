# syntax=docker/dockerfile:1
# Stage 1: Build the application using Maven and Temurin 21
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies (shared Maven cache across services/rebuilds)
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline

# Copy the entire project and build the JAR
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B clean package -DskipTests

# Stage 2: Create a lightweight image for running the app
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Expose application port
EXPOSE 5454

# Copy the built JAR from the build stage
COPY --from=build /app/target/ecommerce-0.0.1-SNAPSHOT.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
