// Test Gateway Connection
console.log('Testing Gateway connection...');

fetch('http://localhost:8090/actuator/health')
  .then(response => {
    console.log('Gateway Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Gateway Health:', data);
  })
  .catch(error => {
    console.error('Gateway Error:', error);
  });

// Test login endpoint
fetch('http://localhost:8090/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
})
.then(response => {
  console.log('Login Test Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Login Response:', data);
})
.catch(error => {
  console.error('Login Test Error:', error);
});