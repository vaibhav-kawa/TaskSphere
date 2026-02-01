import apiClient from '../api/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
  userName: string;
  userId: number;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // console.log('🔥 AUTH SERVICE: Attempting login via Gateway');
    // console.log('🔥 URL:', 'http://localhost:8090' + API_CONFIG.ENDPOINTS.LOGIN);
    // console.log('🔥 Credentials:', { email: credentials.email, password: credentials.password });
    
    try {
      // console.log('🔥 API Client:', apiClient);
      // console.log('🔥 Endpoint:', API_CONFIG.ENDPOINTS.LOGIN);
      // console.log(credentials);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
     // console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.status, error.response?.data);
      console.error('❌ Full error:', error);
      
      // Test direct UserService call for comparison
      // try {
      //   const directResponse = await fetch('http://localhost:8086/api/users/login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(credentials)
      //   });
      //   console.log('🔍 Direct UserService status:', directResponse.status);
      // } catch (directError) {
      //   console.error('🔍 Direct UserService failed:', directError);
      // }
      
      throw error;
    }
  },
  
  // ADDED: Logout method to call backend /auth/logout endpoint
  logout: async (): Promise<void> => {
    try {
      // FIXED: Correct path through Gateway to UserService
     // console.log('🔥 Attempting logout via Gateway');
      await apiClient.post('/auth/logout');
      //console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      // Don't throw error - allow frontend cleanup even if backend fails
    }
  },
  
  register: async (userData: any) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  }
};