// Test Gateway connectivity
console.log('Testing Gateway...');

// Test 1: Health check
fetch('http://localhost:8090/actuator/health')
  .then(response => {
    console.log('✅ Gateway Health:', response.status);
    return response.json();
  })
  .then(data => console.log('Health Data:', data))
  .catch(error => console.error('❌ Gateway Health Failed:', error));

// Test 2: Direct login test
fetch('http://localhost:8090/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'team_member@gmail.com',
    password: 'Member@1'
  })
})
.then(response => {
  console.log('✅ Login Status:', response.status);
  return response.text();
})
.then(data => console.log('Login Response:', data))
.catch(error => console.error('❌ Login Failed:', error));