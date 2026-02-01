# TaskSphere Backend - Microservices Architecture

## 🏗️ Architecture Overview

TaskSphere is a production-grade microservices system with **Gateway-centric authentication** and **OAuth 2.0 integration**.

```
Frontend → API Gateway → [User Service | Task Service]
                ↓
        JWT Validation & Header Forwarding
```

## 🔐 Security Architecture

### **Single Source of Truth: API Gateway**
- **Gateway**: ONLY service that validates JWT tokens
- **Services**: Operate on validated user context via headers
- **Zero JWT Re-validation**: Services never parse JWT directly

### **Authentication Flow**
```
1. Normal Login:   Client → User Service → JWT → Client → Gateway → Services
2. Google OAuth:   Client → Google → User Service → JWT → Client → Gateway → Services
```

## 🚀 Services

### **API Gateway (Port 8090)**
**Responsibility**: Authentication, Authorization, Routing

**Security Features**:
- JWT signature/expiration/issuer validation
- Route classification (PUBLIC vs PROTECTED)
- User context forwarding via headers
- Fail-fast authentication

**Headers Forwarded**:
```
X-User-Id: "123"
X-User-Email: "user@example.com" 
X-User-Roles: "ROLE_USER"
X-Gateway-Auth: "validated"
```

### **User Service (Port 8086)**
**Responsibility**: Authentication, User Management, OAuth

**Features**:
- JWT generation with claims (userId, email, roles, token_type)
- Google OAuth 2.0 integration
- Password reset functionality
- User registration/login

**Security**:
- OAuth tokens stay internal (never exposed)
- Same JWT structure for normal + OAuth login
- JWT validation disabled (Gateway handles)

### **Task Service (Port 8083)**
**Responsibility**: Task Management, Business Logic

**Features**:
- CRUD operations for tasks
- Task assignment and reassignment
- Analytics and reminders
- Comment system

**Security**:
- Zero-trust header validation
- Gateway verification required
- Direct access blocked
- No JWT parsing

## 🔑 JWT Token Structure

```json
{
  "sub": "user@example.com",
  "userId": "123",
  "email": "user@example.com", 
  "roles": "USER",
  "token_type": "ACCESS",
  "iss": "tasksphere-api",
  "iat": 1640995200,
  "exp": 1640998800
}
```

## 🛡️ Security Guarantees

| Security Aspect | Implementation |
|----------------|----------------|
| **JWT Validation** | Gateway only - single source of truth |
| **OAuth Security** | Google tokens internal, JWT returned |
| **Service Access** | Header validation prevents bypass |
| **Token Replay** | Signature + expiration validation |
| **Direct Access** | Blocked by `X-Gateway-Auth` verification |

## 🚦 API Endpoints

### **Authentication (via Gateway)**
```
POST /api/auth/login              # Normal login
POST /api/auth/logout             # Logout with attendance
GET  /api/auth/oauth2/callback/google  # OAuth callback
POST /forgot-password             # Password reset request
POST /reset-password              # Password reset
```

### **Tasks (via Gateway)**
```
GET    /api/tasks                 # Get user tasks
POST   /api/tasks                 # Create task
PUT    /api/tasks/{id}            # Update task
DELETE /api/tasks/{id}            # Delete task
POST   /api/tasks/{id}/comment    # Add comment
GET    /api/tasks/analytics       # Task analytics
```

## 🔧 Configuration

### **Environment Variables**
```bash
# JWT Configuration
JWT_SECRET=your-256-bit-secret-key
JWT_ISSUER=tasksphere-api

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DB_URL=jdbc:mysql://localhost:3306/tasksphere
DB_USERNAME=root
DB_PASSWORD=your-password
```

### **Service Ports**
- **Gateway**: 8090
- **User Service**: 8086  
- **Task Service**: 8083
- **Eureka Server**: 8761

## 🏃‍♂️ Quick Start

### **1. Start Services**
```bash
# Start Eureka Server
cd eureka_example && mvn spring-boot:run

# Start User Service  
cd UserService/UserService && mvn spring-boot:run

# Start Task Service
cd TaskService/TaskService && mvn spring-boot:run

# Start API Gateway
cd Gateway/Gateway && mvn spring-boot:run
```

### **2. Test Authentication**
```bash
# Normal Login
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use JWT for API calls
curl -X GET http://localhost:8090/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Implementation Details

### **Gateway JWT Filter**
```java
// Validates: signature, expiration, issuer, token_type
// Forwards: X-User-Id, X-User-Email, X-User-Roles, X-Gateway-Auth
// Routes: PUBLIC_ROUTES vs PROTECTED_ROUTES
```

### **Task Service Header Filter**  
```java
// Verifies: X-Gateway-Auth = "validated"
// Validates: X-User-Id and X-User-Email presence
// Rejects: Direct requests bypassing Gateway
```

### **OAuth Flow Security**
```java
// Google tokens: Internal only, never exposed
// JWT generation: Same structure as normal login  
// Error handling: No OAuth details leaked
```

## 📊 Production Considerations

### **Scalability**
- Stateless JWT authentication
- Service discovery via Eureka
- Load balancing ready
- Circuit breaker patterns

### **Security**
- Gateway-centric validation
- Zero-trust service communication  
- OAuth token isolation
- Comprehensive input validation

### **Monitoring**
- Actuator endpoints enabled
- Structured logging
- Error tracking
- Performance metrics

## 🔄 Token Lifecycle

```
1. User Login/OAuth → User Service generates JWT
2. Client stores JWT → Sends with requests  
3. Gateway validates JWT → Extracts claims
4. Gateway forwards headers → Services process
5. Token expires → Client re-authenticates
```

## 🚨 Security Warnings

**❌ NEVER:**
- Validate JWT in services (Gateway only)
- Expose Google OAuth tokens  
- Allow direct service access
- Mix authentication responsibilities

**✅ ALWAYS:**
- Route through Gateway
- Validate headers in services
- Use Gateway authentication proof
- Follow single source of truth principle

---

**Architecture**: Gateway-centric microservices  
**Authentication**: JWT + OAuth 2.0  
**Security**: Zero-trust, fail-fast validation  
**Status**: Production-ready