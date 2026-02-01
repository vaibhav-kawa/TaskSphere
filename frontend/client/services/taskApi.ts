import apiClient from '../api/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';

export interface TaskDTO {
  id?: number;
  title: string;
  description: string;
  assignedTo: number;
  priority: string;
  status: string;
  deadline: string;
  progress?: number;
}

export const taskApi = {
  getAllTasks: async (assignedTo?: number, status?: string, priority?: string) => {
    const params = new URLSearchParams();
    if (assignedTo) params.append('assignedTo', assignedTo.toString());
    if (status && status !== 'all') params.append('status', status);
    if (priority && priority !== 'all') params.append('priority', priority);
    
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.TASKS}?${params}`);
    return response.data;
  },

  getTaskById: async (id: number) => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
    return response.data;
  },

  createTask: async (task: TaskDTO) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.TASKS, task);
    return response.data;
  },

  updateTask: async (id: number, task: TaskDTO) => {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: number) => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
  }
};
