// API Configuration - Gateway Only
export const API_CONFIG = {
  BASE_URL:  'https://tasksphere-d-gateway.onrender.com/',
  TIMEOUT: 10000,
  
  ENDPOINTS: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    USERS: '/api/users',
    TASKS: '/api/tasks'
  }
};

export default API_CONFIG;