## Stage 1: Build
#FROM maven:3.9-eclipse-temurin-21 AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## Stage 2: Runtime
#FROM eclipse-temurin:21-jre
#WORKDIR /app
#COPY --from=build /app/target/user_service-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8082
#ENTRYPOINT ["java", "-jar", "app.jar"]

## Stage 1: Build ứng dụng
#FROM maven:3.9.4-eclipse-temurin-21 AS builder
#WORKDIR /app
## Copy toàn bộ project để Maven có thể resolve dependencies giữa các module
#COPY . .
#
## Build riêng module user_service
#RUN mvn -pl user_service -am clean package -DskipTests
#
## Stage 2: Run ứng dụng
#FROM eclipse-temurin:21-jdk
#WORKDIR /app
#COPY --from=builder /app/user_service/target/user_service-*.jar app.jar
#EXPOSE 8082
#ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy toàn bộ project (từ thư mục gốc)
COPY . .

# Build parent POM trước để install vào local repository
RUN mvn clean install -DskipTests -N

# Build service cụ thể và các dependencies
RUN mvn clean package -DskipTests -pl user_service -am

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy file JAR từ service
COPY --from=builder /app/backend/user_service/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]