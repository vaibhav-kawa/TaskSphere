import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  User,
  Mail,
  Phone,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { teamService, Team, TeamMember as BackendTeamMember, CreateTeamRequest } from "@/services/teamService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string;
  phone?: string;
  joinDate: string;
}

const Teams = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({
    userId: "",
    role: "Member",
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
  });

  // Mock users for dropdown - replace with actual API call when needed
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@tasksphere.app",
    role: "Admin",
    status: "active",
    phone: "+1 234-567-8900",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@tasksphere.app",
    role: "Manager",
    status: "active",
    phone: "+1 234-567-8901",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@tasksphere.app",
    role: "Member",
    status: "active",
    phone: "+1 234-567-8902",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@tasksphere.app",
    role: "Member",
    status: "active",
    phone: "+1 234-567-8903",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Eve Wilson",
    email: "eve@tasksphere.app",
    role: "Manager",
    status: "inactive",
    phone: "+1 234-567-8904",
    joinDate: "2023-05-12",
  },
  ];

  useEffect(() => {
    fetchTeams();
    // Use mock users instead of API call to prevent errors
    setAllUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);



  const fetchTeams = async () => {
    try {
      console.log('Fetching teams...');
      const teamsData = await teamService.getAllTeams();
      console.log('Raw teams data:', teamsData);
      
      if (Array.isArray(teamsData) && teamsData.length > 0) {
        let cleanTeams = teamsData.map(team => ({
          id: team.id,
          name: team.name,
          created_by: team.created_by,
          createdAt: team.createdAt,
          updatedAt: team.updatedAt
        }));
        
        // Filter teams for team members - only show teams they belong to
        if (user?.role === 'team-member') {
          const memberTeams = [];
          for (const team of cleanTeams) {
            try {
              const membersData = await teamService.getTeamMembers(team.id);
              const isMember = membersData?.some((member: any) => 
                member.user?.email === user.email
              );
              if (isMember) {
                memberTeams.push(team);
              }
            } catch (error) {
              console.error(`Failed to check membership for team ${team.id}:`, error);
            }
          }
          cleanTeams = memberTeams;
        }
        
        console.log('Clean teams:', cleanTeams);
        setTeams(cleanTeams);
        // Always select the first team if no team is currently selected
        if (!selectedTeam && cleanTeams.length > 0) {
          setSelectedTeam(cleanTeams[0]);
        }
      } else {
        console.log('Teams data is not array or empty:', teamsData);
        setTeams([]);
        setSelectedTeam(null);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams([]);
      setSelectedTeam(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: number) => {
    setLoadingMembers(true);
    try {
      const membersData = await teamService.getTeamMembers(teamId);
      console.log('Members data received:', membersData);
      if (Array.isArray(membersData) && membersData.length > 0) {
        // Remove duplicates based on user email and filter out invalid entries
        const uniqueMembers = membersData.filter((member, index, arr) => {
          if (!member.user?.email) return false;
          if (member.user.name === "string") return false; // Filter out placeholder names
          return arr.findIndex(m => m.user?.email === member.user?.email) === index;
        });
        
        const formattedMembers: TeamMember[] = uniqueMembers.map((member, index) => ({
          id: member.id?.toString() || `member-${index}`,
          name: member.user?.name || member.user?.email?.split('@')[0] || `Member ${index + 1}`,
          email: member.user?.email || `member${index + 1}@example.com`,
          role: member.role || 'Member',
          status: "active" as const,
          phone: member.user?.phoneNumber || undefined,
          joinDate: member.user?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));
        setMembers(formattedMembers);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Error",
          description: "Please login first.",
          variant: "destructive",
        });
        return;
      }
      
      // Extract email from token payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.sub || payload.email;
      
      const teamData = {
        name: teamForm.name,
        created_by: userEmail
      };
      const newTeam = await teamService.createTeam(teamData);
      toast({
        title: "Team Created",
        description: "Team has been created successfully.",
      });
      setCreateTeamOpen(false);
      setTeamForm({ name: "", description: "" });
      await fetchTeams();
      // Select the newly created team if it's the first one
      if (teams.length === 0 && newTeam) {
        setSelectedTeam(newTeam);
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      toast({
        title: "Error",
        description: "Failed to create team.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam) {
      toast({
        title: "No Team Selected",
        description: "Please select a team first.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedUser = allUsers.find(u => u.id.toString() === memberForm.userId);
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is already a member of this team
    const isAlreadyMember = members.some(member => member.email === selectedUser.email);
    if (isAlreadyMember) {
      toast({
        title: "Duplicate Member",
        description: "This user is already a member of this team.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Adding member:', selectedUser.email, 'to team:', selectedTeam.id);
    
    try {
      await teamService.addMemberToTeam(selectedTeam.id, selectedUser.email);
      toast({
        title: "Member Added",
        description: "Team member has been added successfully.",
      });
      setAddMemberOpen(false);
      setMemberForm({ userId: "", role: "Member" });
      await fetchTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Failed to add member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedTeam || !selectedMember) return;
    try {
      await teamService.updateTeamMember(selectedTeam.id, selectedMember.email, memberForm.role);
      toast({
        title: "Member Updated",
        description: "Team member has been updated successfully.",
      });
      setEditMemberOpen(false);
      setMemberForm({ email: "", role: "Member" });
      await fetchTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Failed to update member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (email: string) => {
    if (!selectedTeam) return;
    try {
      await teamService.deleteTeamMember(selectedTeam.id, email);
      toast({
        title: "Member Removed",
        description: "Team member has been removed successfully.",
      });
      await fetchTeamMembers(selectedTeam.id);
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member.",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const resetForm = () => {
    setMemberForm({
      userId: "",
      role: "Member",
    });
    setSelectedMember(null);
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setMemberForm({
      email: member.email,
      role: member.role,
    });
    setEditMemberOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "manager":
        return "bg-primary/10 text-primary border-primary/20";
      case "member":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-orb-gradient opacity-10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-grid-overlay opacity-10" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex-1 p-4 lg:p-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              {user?.role === 'team-member' ? 'My Teams' : 'Teams'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.role === 'team-member' ? 'View your team members and information' : 'Manage your teams and team members'}
            </p>
          </div>
          {user?.role !== 'team-member' && (
            <div className="flex gap-2">
              <Button
                onClick={() => setCreateTeamOpen(true)}
                variant="outline"
                className="border-border/60"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
              <Button
                onClick={() => {
                  if (!selectedTeam) {
                    toast({
                      title: "No Team Selected",
                      description: "Please select a team first.",
                      variant: "destructive",
                    });
                    return;
                  }
                  resetForm();
                  setAddMemberOpen(true);
                }}
                className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          )}
        </motion.div>

        {/* Team Selection & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Team ({teams.length} teams)</label>
            <select
              value={selectedTeam?.id || ""}
              onChange={(e) => {
                const teamId = e.target.value;
                if (teamId) {
                  const team = teams.find(t => t.id === parseInt(teamId));
                  setSelectedTeam(team || null);
                } else {
                  setSelectedTeam(null);
                }
              }}
              className="h-10 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm min-w-[200px]"
            >
              <option value="">Select a team...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border-border/60 bg-background/50 pl-10"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-border/70 bg-background/80 p-12 text-center shadow-brand-soft"
          >
            <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-heading text-lg font-semibold text-foreground">
              No teams available
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first team to get started
            </p>
            <Button
              onClick={() => setCreateTeamOpen(true)}
              className="mt-4 bg-mesh-gradient text-primary-foreground shadow-brand-soft"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </motion.div>
        ) : (
        <>
          {/* Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-brand-soft"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground">{selectedTeam?.name || 'No Team Selected'}</h2>
            {selectedTeam?.description && (
              <p className="mt-1 text-sm text-muted-foreground">{selectedTeam.description}</p>
            )}
          </motion.div>

          {/* Team Members Grid */}
          {loadingMembers ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading members...</p>
              </div>
            </div>
          ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <Badge className={cn("mt-1 border text-xs", getRoleColor(member.role))}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
                {user?.role !== 'team-member' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteMember(member.email)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border",
                      member.status === "active"
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border"
                    )}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
          )}
        </>
        )}

        {selectedTeam && filteredMembers.length === 0 && !loadingMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-border/70 bg-background/80 p-12 text-center shadow-brand-soft"
          >
            <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-heading text-lg font-semibold text-foreground">
              No team members found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Add your first team member to get started"}
            </p>
            <Button
              onClick={() => {
                resetForm();
                setAddMemberOpen(true);
              }}
              className="mt-4 bg-mesh-gradient text-primary-foreground shadow-brand-soft"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add Member Modal */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Add Team Member</DialogTitle>
            <DialogDescription>Invite a new member to your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">

            <div>
              <label className="text-sm font-medium text-foreground">Select User</label>
              <select
                value={memberForm.userId}
                onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a user...</option>
                {allUsers
                  .filter(user => !members.some(member => member.email === user.email))
                  .map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              disabled={!memberForm.userId}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Team Member</DialogTitle>
            <DialogDescription>Update team member information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                className="mt-1.5 flex h-10 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
              >
                <option value="Member">Member</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateMember}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Team Modal */}
      <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Create New Team</DialogTitle>
            <DialogDescription>Create a new team to organize your members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Team Name</label>
              <Input
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description (Optional)</label>
              <Input
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
                placeholder="Enter team description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTeamOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              disabled={!teamForm.name}
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;



