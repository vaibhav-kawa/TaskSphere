import axiosInstance from '../api/axiosConfig';
import API_CONFIG from '../config/apiConfig';

// Gateway Service - Handles all API routing through Gateway + Eureka
export class GatewayService {
  
  // Health check for gateway connectivity
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/actuator/health');
      return response.status === 200;
    } catch (error) {
      console.error('Gateway health check failed:', error);
      return false;
    }
  }

  // Get service status from Eureka via Gateway
  static async getServiceStatus(): Promise<any> {
    try {
      const response = await axiosInstance.get('/eureka/apps');
      return response.data;
    } catch (error) {
      console.error('Failed to get service status:', error);
      return null;
    }
  }

  // Generic request method with automatic retry
  static async request(method: string, endpoint: string, data?: any, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const config: any = { method, url: endpoint };
        if (data) config.data = data;
        
        const response = await axiosInstance(config);
        return response.data;
      } catch (error: any) {
        console.error(`Request failed (attempt ${i + 1}/${retries}):`, error);
        
        if (i === retries - 1) throw error;
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
}

export default GatewayService;