# Test User Creation

## Option 1: Direct Database Insert (MySQL)
```sql
INSERT INTO users (name, email, password, role, phone_number, gender, created_at, updated_at) 
VALUES (
  'Test User', 
  'test@example.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
  'admin', 
  '1234567890', 
  'male', 
  NOW(), 
  NOW()
);
```

## Option 2: Use Signup Endpoint
```bash
curl -X POST http://localhost:8090/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "role": "admin",
    "phoneNumber": "1234567890",
    "gender": "male"
  }'
```

## Test Login Credentials
- **Email**: test@example.com
- **Password**: password123 (or "password" if using DB insert)
- **Role**: admin