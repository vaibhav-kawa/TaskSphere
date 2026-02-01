# Gateway Verification Checklist

## 1. Service Health Checks
```bash
# Gateway health
curl http://localhost:8090/actuator/health

# UserService health  
curl http://localhost:8086/actuator/health

# TaskService health
curl http://localhost:8087/actuator/health
```

## 2. Gateway Routing Tests
```bash
# Test user login via Gateway
curl -X POST http://localhost:8090/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test CORS preflight
curl -X OPTIONS http://localhost:8090/api/users/login \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## 3. Frontend Verification
1. Open browser DevTools → Network tab
2. Login from frontend
3. Verify requests show `localhost:8090` (not 8086)
4. Check response headers contain CORS headers

## 4. Expected Network Tab Output
```
POST http://localhost:8090/api/users/login
Status: 200 OK
Response Headers:
  access-control-allow-origin: http://localhost:8081
  access-control-allow-credentials: true
```

## 5. Failure Indicators
❌ Requests to `localhost:8086` in Network tab
❌ CORS errors in console
❌ Missing `access-control-*` headers
❌ Gateway logs show no incoming requests