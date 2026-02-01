import axiosInstance from '../api/axiosConfig';

export interface Team {
  id: number;
  name: string;
  description?: string;
  created_by?: string;   // ADD THIS
  createdAt?: string;    // ADD THIS
  updatedAt?: string;    // ADD THIS
}

export interface TeamMember {
  id: number;
  email: string;
  role: string;
  joinedAt?: string;
}

export interface CreateTeamRequest {
  name: string;
  created_by: string;
}

export const teamService = {
  createTeam: async (teamData: CreateTeamRequest): Promise<Team> => {
    const response = await axiosInstance.post('/api/teams/create', teamData);
    return response.data as Team;
  },

  getAllTeams: async (): Promise<Team[]> => {
    const response = await axiosInstance.get('/api/teams/all');
    console.log(response.data);
    return response.data as Team[];
  },

  getTeamById: async (teamId: number): Promise<Team> => {
    const response = await axiosInstance.get(`/api/teams/${teamId}`);
    return response.data as Team;
  },

  addMemberToTeam: async (teamId: number, memberEmail: string): Promise<Team> => {
    const response = await axiosInstance.post(`/api/teams/${teamId}/members`, memberEmail, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data as Team;
  },

  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    const response = await axiosInstance.get(`/api/teams/${teamId}/members`);
    return response.data as TeamMember[];
  },

  updateTeamMember: async (teamId: number, memberEmail: string, newRole: string): Promise<Team> => {
    const response = await axiosInstance.put(`/api/teams/${teamId}/members/${memberEmail}`, newRole, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data as Team;
  },

  deleteTeamMember: async (teamId: number, memberEmail: string): Promise<void> => {
    await axiosInstance.delete(`/api/teams/${teamId}/members/${memberEmail}`);
  }
};