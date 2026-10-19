FROM eclipse-temurin:21-jre-alpine

ARG MODULE
ENV MODULE_ENV=${MODULE}

WORKDIR /app

# Ensure we have wget/curl for health checks if needed (Alpine usually has wget)
# RUN apk add --no-cache wget

# Copy the pre-built jar from the module's target directory
COPY ${MODULE}/target/*.jar app.jar

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
