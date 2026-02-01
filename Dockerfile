# ================= BACKEND BUILD =================
FROM eclipse-temurin:21-jdk AS backend-build
RUN apt-get update && apt-get install -y maven git curl unzip
WORKDIR /app

# Copy backend services
COPY backend/euraka_example ./EurekaServer
COPY backend/Gateway/Gateway ./Gateway
COPY backend/UserService/UserService ./UserService
COPY backend/TaskService/TaskService ./TaskService

# Build backend JARs
RUN mvn -U -f EurekaServer/pom.xml clean package -DskipTests && \
    mvn -U -f Gateway/pom.xml clean package -DskipTests && \
    mvn -U -f UserService/pom.xml clean package -DskipTests && \
    mvn -U -f TaskService/pom.xml clean package -DskipTests


# ================= FRONTEND BUILD =================
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy package.json files first
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund --legacy-peer-deps --network-timeout=100000

# Copy frontend source
COPY frontend/ ./

# Build frontend
# ⚠️ Output will be: /app/client/dist
RUN npm run build


# ================= FINAL IMAGE =================
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    mysql-server \
    mysql-client \
    bash \
    curl \
    && rm -rf /var/lib/apt/lists/*

# MySQL setup
RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld
ENV MYSQL_DATABASE=tasksphere

# Copy backend JARs
COPY --from=backend-build /app/EurekaServer/target/*.jar ./eureka-server.jar
COPY --from=backend-build /app/Gateway/target/*.jar ./gateway.jar
COPY --from=backend-build /app/UserService/target/*.jar ./user-service.jar
COPY --from=backend-build /app/TaskService/target/*.jar ./task-service.jar

# ✅ Copy frontend build (FIXED PATH)
COPY --from=frontend-build /app/client/dist /usr/share/nginx/html

# Nginx config
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Startup script
COPY <<EOF /app/start.sh
#!/bin/bash
set -e

echo "Starting MySQL..."
mysqld --user=mysql &
sleep 20

echo "Creating database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS tasksphere;"

echo "Starting Nginx..."
nginx

echo "Starting Eureka..."
java -jar eureka-server.jar --server.port=8761 &
sleep 15

echo "Starting UserService..."
java -jar user-service.jar --server.port=8087 \
  --spring.datasource.url=jdbc:mysql://localhost:3306/tasksphere \
  --spring.datasource.username=root \
  --spring.datasource.password=root &

echo "Starting TaskService..."
java -jar task-service.jar --server.port=8086 \
  --spring.datasource.url=jdbc:mysql://localhost:3306/tasksphere \
  --spring.datasource.username=root \
  --spring.datasource.password=root &

sleep 10
echo "Starting Gateway..."
java -jar gateway.jar --server.port=8080 &

wait
EOF

RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8080 8761 8086 8087 3306

CMD ["/app/start.sh"]
