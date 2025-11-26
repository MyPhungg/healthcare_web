# Builder stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy toàn bộ backend project
COPY .. .

# Build toàn bộ project một lần (pom.xml đã ở trong thư mục hiện tại)
RUN mvn clean package -DskipTests

# Runtime images cho từng service
FROM eclipse-temurin:21-jre-alpine AS appointment_service_runtime
WORKDIR /app
COPY --from=builder /app/appointment_service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre-alpine AS user_service_runtime
WORKDIR /app
COPY --from=builder /app/user_service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre-alpine AS notification_service_runtime
WORKDIR /app
COPY --from=builder /app/notification_service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre-alpine AS chatbot_service_runtime
WORKDIR /app
COPY --from=builder /app/chatbot_service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre-alpine AS eureka_server_runtime
WORKDIR /app
COPY --from=builder /app/eureka_server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre-alpine AS gateway_service_runtime
WORKDIR /app
COPY --from=builder /app/gateway_service/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]