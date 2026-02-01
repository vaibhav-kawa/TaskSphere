import apiClient from '../api/axiosConfig';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  gender?: string;
  teamLeaderId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/users/current');
    return response.data;
  },

  updateUser: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put('/users/update', data);
    return response.data;
  },

  deleteUser: async (): Promise<void> => {
    await apiClient.delete('/users/delete');
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/getusers');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/role?role=${role}`);
    return response.data;
  }
};

export default userService;