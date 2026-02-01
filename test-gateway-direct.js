// Test if Gateway is receiving requests
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
  console.log('Gateway Response Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Gateway Response Body:', data);
})
.catch(error => {
  console.error('Gateway Request Failed:', error);
});