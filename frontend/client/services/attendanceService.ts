const API_BASE_URL = 'https://tasksphere-d-gateway.onrender.com/'; // Use Gateway

export const attendanceService = {
  clockIn: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/clockin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to clock in');
    }
    
    return response.json();
  },

  clockOut: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/clockout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to clock out');
    }
    
    return response.json();
  },

  getAttendanceStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/attendance-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get attendance status');
    }
    
    return response.json();
  }
};