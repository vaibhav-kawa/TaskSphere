import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User, // Lucide Icon
  Mail,
  Phone,
  Building,
  Shield,
  Lock,
  Palette,
  Globe,
  Bell,
  ListChecks,
  Users,
  Calendar,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Upload,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { userService, User as UserProfileType, UpdateUserRequest } from "@/services/userService";
import { organizationService, OrgNode } from "@/services/organizationService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  // Changed type usage from User to UserProfileType
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [orgHierarchy, setOrgHierarchy] = useState<OrgNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2", "3"]));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setUpdating(true);
    try {
      const updateData: UpdateUserRequest = {
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        department: profile.department,
      };

      const updatedUser = await userService.updateUser(updateData);
      // Ensure the updated user type is UserProfileType
      setProfile(updatedUser as UserProfileType);
      setEditProfileOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setChangePasswordOpen(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userService.deleteUser();
      localStorage.removeItem('authToken');
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteAccountOpen(false);
    }
  };

  const getRoleColor = (role: string, isCurrentUser?: boolean) => {
    if (isCurrentUser) return "bg-primary/20 border-primary/40";
    if (role === "CEO") return "bg-destructive/10 border-destructive/30";
    if (role.includes("VP")) return "bg-primary/10 border-primary/30";
    if (role.includes("Manager")) return "bg-accent/10 border-accent/30";
    return "bg-muted/50 border-border";
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use AuthContext user data or fetch from service
        const userData = user || await userService.getCurrentUser();
        setProfile(userData as UserProfileType);

        // Build organizational hierarchy
        const hierarchy = await organizationService.buildOrgHierarchy(userData);
        setOrgHierarchy(hierarchy);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast, user]);

  const renderOrgNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isHovered = hoveredNode === node.id;

    return (
      <div key={node.id} className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
          className={cn(
            "group relative mb-2 flex items-center gap-3 rounded-xl border p-3 transition-all",
            getRoleColor(node.role, node.isCurrentUser),
            isHovered && "shadow-md scale-[1.02]",
            node.isCurrentUser && "ring-2 ring-primary"
          )}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-background/50"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn(
                "font-semibold text-foreground truncate",
                node.isCurrentUser && "text-primary font-bold"
              )}>
                {node.name}
              </p>
              {node.isCurrentUser && (
                <Badge className="bg-primary text-primary-foreground text-xs">You</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{node.role}</p>
            {node.department && (
              <p className="text-xs text-muted-foreground truncate">{node.department}</p>
            )}
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-2 top-12 z-10 rounded-lg border border-border/60 bg-background/95 backdrop-blur-md p-3 shadow-brand-soft"
            >
              <p className="text-xs font-semibold text-foreground">{node.name}</p>
              <p className="text-xs text-muted-foreground">{node.role}</p>
              <p className="text-xs text-muted-foreground">{node.email}</p>
              {node.department && (
                <p className="text-xs text-muted-foreground mt-1">Department: {node.department}</p>
              )}
            </motion.div>
          )}
        </motion.div>
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {node.children!.map((child) => renderOrgNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
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
          className="mb-6"
        >
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : !profile ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">Failed to load profile data.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
            {/* Left Panel */}
            <div className="space-y-6">
              {/* User Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-12 w-12" />
                    </div>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background"
                      onClick={() => {
                        // In real app, this would open file picker
                        alert("Avatar upload would be implemented here");
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      {profile.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{profile.email}</span>
                      </div>
                      {profile.phoneNumber && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{profile.phoneNumber}</span>
                        </div>
                      )}
                      {profile.department && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{profile.department}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => setEditProfileOpen(true)}
                      className="mt-4 w-full sm:w-auto bg-mesh-gradient text-primary-foreground shadow-brand-soft"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Account Security Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Account Security
                    </h3>
                    <p className="text-sm text-muted-foreground">Manage your account security settings</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                    />
                  </div>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full border-border/60"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setDeleteAccountOpen(true)}
                  >
                    Delete Account
                  </Button>
                  <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last login:</span>
                      <span className="font-medium text-foreground">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Preferences Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Preferences
                    </h3>
                    <p className="text-sm text-muted-foreground">Customize your experience</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          {darkMode ? "Dark" : "Light"} mode
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="h-10 w-10"
                    >
                      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email updates</p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </motion.div>

              {/* Quick Links Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Quick Links
                    </h3>
                    <p className="text-sm text-muted-foreground">Fast navigation to key sections</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/60 bg-background/50"
                  >
                    <Link to="/dashboard/tasks">
                      <ListChecks className="mr-2 h-4 w-4" />
                      My Tasks
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/60 bg-background/50"
                  >
                    <Link to="/dashboard/teams">
                      <Users className="mr-2 h-4 w-4" />
                      Team Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/60 bg-background/50"
                  >
                    <Link to="/dashboard/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-border/60 bg-background/50"
                  >
                    <Link to="/dashboard/calendar">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendar
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Panel - Organizational Hierarchy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary-foreground">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Organizational Hierarchy
                  </h3>
                  <p className="text-sm text-muted-foreground">Your position in the organization</p>
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {orgHierarchy ? renderOrgNode(orgHierarchy) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading organizational structure...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                // Check if profile is not null before accessing its properties
                value={profile?.name || ""}
                onChange={(e) => profile && setProfile({ ...profile, name: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={profile?.email || ""}
                onChange={(e) => profile && setProfile({ ...profile, email: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={profile?.phoneNumber || ""}
                onChange={(e) => profile && setProfile({ ...profile, phoneNumber: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={profile?.department || ""}
                onChange={(e) => profile && setProfile({ ...profile, department: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={updating}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Change Password</DialogTitle>
            <DialogDescription>Update your account password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? All your tasks, projects, and personal data will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;