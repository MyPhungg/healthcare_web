# Stage 1: Build
#FROM maven:3.9.6-eclipse-temurin-21 AS builder
#WORKDIR /build
#COPY . .
#RUN mvn clean package -DskipTests
#
## Stage 2: Run
#FROM eclipse-temurin:21-jdk-jammy
#WORKDIR /app
#COPY --from=builder /build/target/appointment_service-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8081
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Dockerfile cho appointment_service
# Đặt file này trong: backend/appointment_service/Dockerfile

FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy toàn bộ project (từ thư mục gốc)
COPY . .

# Build parent POM trước để install vào local repository
RUN mvn clean install -DskipTests -N

# Build service cụ thể và các dependencies
RUN mvn clean package -DskipTests -pl appointment_service -am

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy file JAR từ service
COPY --from=builder /app/backend/appointment_service/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]