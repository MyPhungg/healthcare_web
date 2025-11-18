FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy toàn bộ project (từ thư mục gốc)
COPY . .

# Build parent POM trước để install vào local repository
RUN mvn clean install -DskipTests -N

# Build service cụ thể và các dependencies
RUN mvn clean package -DskipTests -pl notification_service -am

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy file JAR từ service
COPY --from=builder /app/backend/notification_service/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]