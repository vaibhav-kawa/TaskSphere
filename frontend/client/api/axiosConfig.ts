import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Production-grade Axios instance for Gateway
const apiClient = axios.create({
  baseURL: 'https://tasksphere-d-gateway.onrender.com/', // Force Gateway URL timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
   // console.log('🔥 Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Persistent debug logging
    const fullUrl = config.baseURL + config.url;
   // console.log(`🚀 REQUEST: ${config.method?.toUpperCase()} ${fullUrl}`);
   // console.log('🚀 Headers:', config.headers);
    
    // Store in sessionStorage to persist across refreshes
    const logEntry = `${new Date().toISOString()} - ${config.method?.toUpperCase()} ${fullUrl}`;
    const existingLogs = sessionStorage.getItem('apiLogs') || '';
    sessionStorage.setItem('apiLogs', existingLogs + '\n' + logEntry);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
   // console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'Network'} ${error.config?.url}`);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
