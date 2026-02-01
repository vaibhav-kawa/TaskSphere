# TaskSphere API Gateway

Production-ready API Gateway built with Spring Cloud Gateway for the TaskSphere microservices architecture.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Redis-based rate limiting per user
- **Circuit Breaker**: Resilience4j circuit breaker pattern
- **CORS Support**: Configurable cross-origin resource sharing
- **Health Checks**: Actuator endpoints for monitoring
- **Request Retry**: Automatic retry for failed requests
- **Load Balancing**: Built-in load balancing capabilities
- **Metrics**: Prometheus metrics export

## Prerequisites

- Java 17+
- Maven 3.6+
- Redis 6.0+
- Docker (optional)

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret (min 32 chars) | - |
| `JWT_ISSUER` | JWT token issuer | tasksphere-api |
| `REDIS_HOST` | Redis server host | localhost |
| `REDIS_PORT` | Redis server port | 6379 |

### Service Routes

- `/auth/**` → Auth Service (port 8081)
- `/users/**` → User Service (port 8082)  
- `/tasks/**` → Task Service (port 8083)

## Running Locally

### With Docker Compose
```bash
docker-compose up -d
```

### Manual Setup
1. Start Redis:
   ```bash
   redis-server
   ```

2. Set environment variables:
   ```bash
   export JWT_SECRET="your-256-bit-secret-key-here-must-be-at-least-32-characters-long"
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Building

```bash
mvn clean package
```

## Health Checks

- Health: `GET /actuator/health`
- Info: `GET /actuator/info`
- Metrics: `GET /actuator/metrics`

## Rate Limiting

- Default: 10 requests/second, burst capacity 20
- Auth endpoints: 20 requests/second, burst capacity 40
- Based on user ID or IP address

## Security

- All endpoints require JWT authentication except `/auth/**`
- CORS configured for localhost and production domains
- Request/response headers sanitized
- Error messages don't expose sensitive information

## Monitoring

Prometheus metrics available at `/actuator/prometheus` for:
- Request rates and latencies
- Circuit breaker states
- Rate limiting statistics
- JVM metrics