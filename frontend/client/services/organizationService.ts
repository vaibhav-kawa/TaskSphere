import { userApi } from '../api/userApi';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  email: string;
  department?: string;
  isCurrentUser?: boolean;
  children?: OrgNode[];
}

export const organizationService = {
  buildOrgHierarchy: async (currentUser: any): Promise<OrgNode> => {
    try {
      // Get all users from backend
      const allUsers = await userApi.getAllUsers();
      
      // Build hierarchy based on roles and team relationships
      const ceo = allUsers.find(u => u.role === 'CEO');
      const admins = allUsers.filter(u => u.role === 'ADMIN');
      const managers = allUsers.filter(u => u.role === 'MANAGER');
      const teamLeaders = allUsers.filter(u => u.role === 'TEAM_LEADER');
      const members = allUsers.filter(u => u.role === 'MEMBER');
      
      // Build org tree
      const buildNode = (user: any): OrgNode => ({
        id: user.id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
        department: user.department || 'General',
        isCurrentUser: user.id === currentUser?.id,
        children: []
      });
      
      // Create CEO node
      const orgRoot: OrgNode = ceo ? buildNode(ceo) : {
        id: '1',
        name: 'CEO',
        role: 'CEO',
        email: 'ceo@company.com',
        department: 'Executive',
        children: []
      };
      
      // Add admins under CEO
      orgRoot.children = admins.map(buildNode);
      
      // Add managers under admins (or CEO if no admins)
      const parentNodes = orgRoot.children.length > 0 ? orgRoot.children : [orgRoot];
      parentNodes.forEach(parent => {
        if (!parent.children) parent.children = [];
        parent.children.push(...managers.map(buildNode));
      });
      
      // Add team leaders under managers
      const managerNodes = parentNodes.flatMap(p => p.children || []).filter(n => n.role === 'MANAGER');
      managerNodes.forEach(manager => {
        if (!manager.children) manager.children = [];
        manager.children.push(...teamLeaders.map(buildNode));
      });
      
      // Add members under team leaders
      const leaderNodes = managerNodes.flatMap(m => m.children || []).filter(n => n.role === 'TEAM_LEADER');
      leaderNodes.forEach(leader => {
        if (!leader.children) leader.children = [];
        const teamMembers = members.filter(m => m.teamLeaderId?.toString() === leader.id);
        leader.children.push(...teamMembers.map(buildNode));
      });
      
      return orgRoot;
    } catch (error) {
      console.error('Failed to build org hierarchy:', error);
      // Fallback to simple structure
      return {
        id: currentUser?.id?.toString() || '1',
        name: currentUser?.name || 'Current User',
        role: currentUser?.role || 'MEMBER',
        email: currentUser?.email || 'user@company.com',
        isCurrentUser: true,
        children: []
      };
    }
  },

  getTeamHierarchy: async () => {
    try {
      const allUsers = await userApi.getAllUsers();
      const teamLeaders = allUsers.filter(u => u.role === 'TEAM_LEADER');
      
      const teams: Record<string, any[]> = {};
      
      teamLeaders.forEach(leader => {
        const teamMembers = allUsers.filter(u => u.teamLeaderId === leader.id);
        teams[`${leader.name}'s Team`] = [
          { name: leader.name, role: leader.role },
          ...teamMembers.map(m => ({ name: m.name, role: m.role }))
        ];
      });
      
      return teams;
    } catch (error) {
      console.error('Failed to get team hierarchy:', error);
      return {};
    }
  }
};