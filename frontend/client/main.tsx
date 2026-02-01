import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LazyLoader } from "./components/LazyLoader";
import { lazy } from "react";

// Lazy load components
const MainLayout = lazy(() => import("@/components/layout/MainLayout"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Workspace = lazy(() => import("./pages/Workspace"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Notifications = lazy(() => import("./pages/Notifications"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const Teams = lazy(() => import("./pages/Teams"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard"));
const TeamLeaderDashboard = lazy(() => import("./pages/Team_leader_Dashboard"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard"));
const MemberTasks = lazy(() => import("./pages/Member_tasks"));

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<LazyLoader><Login /></LazyLoader>} />
            <Route path="/signup" element={<LazyLoader><Signup /></LazyLoader>} />
            <Route path="/forgot-password" element={<LazyLoader><ForgotPassword /></LazyLoader>} />
            <Route path="/reset-password" element={<LazyLoader><ResetPassword /></LazyLoader>} />
            
            {/* Admin Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LazyLoader><Dashboard /></LazyLoader>
              </ProtectedRoute>
            } />
            
            {/* Manager Routes */}
            <Route path="/manager-dashboard" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <LazyLoader><ManagerDashboard /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/manager-dashboard/team" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <LazyLoader><ManagerDashboard /></LazyLoader>
              </ProtectedRoute>
            } />
            
            {/* Team Leader Routes */}
            <Route path="/team-leader-dashboard" element={
              <ProtectedRoute allowedRoles={['team-leader']}>
                <LazyLoader><TeamLeaderDashboard /></LazyLoader>
              </ProtectedRoute>
            } />
            
            {/* Member Routes */}
            <Route path="/member-dashboard" element={
              <ProtectedRoute allowedRoles={['team-member']}>
                <LazyLoader><MemberDashboard /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/member-dashboard/tasks" element={
              <ProtectedRoute allowedRoles={['team-member']}>
                <LazyLoader><MemberTasks /></LazyLoader>
              </ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/dashboard/tasks" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Tasks /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/tasks/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><TaskDetails /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/teams" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Teams /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/calendar" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Calendar /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader']}>
                <LazyLoader><Analytics /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/notifications" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Notifications /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Settings /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team-leader', 'team-member']}>
                <LazyLoader><Profile /></LazyLoader>
              </ProtectedRoute>
            } />
            <Route element={<LazyLoader><MainLayout /></LazyLoader>}>
              <Route path="/" element={<LazyLoader><Index /></LazyLoader>} />
              <Route path="/workspace" element={<LazyLoader><Workspace /></LazyLoader>} />
              <Route path="/pricing" element={<LazyLoader><Pricing /></LazyLoader>} />
              <Route path="*" element={<LazyLoader><NotFound /></LazyLoader>} />
            </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


const rootElement = document.getElementById("root");


if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found!');
}
