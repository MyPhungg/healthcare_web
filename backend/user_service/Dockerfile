FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/user_service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]

#FROM openjdk:21-jdk-slim
#WORKDIR /app
#COPY target/user_service-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8082
#ENTRYPOINT ["java", "-jar", "app.jar"]