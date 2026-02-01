import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";
import { attendanceService } from "@/services/attendanceService";

// Animated background shapes component
const AnimatedShapes = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blob shapes */}
      <motion.div
        className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-orb-gradient opacity-30 blur-3xl"
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
      <motion.div
        className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-mesh-gradient opacity-25 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-20 blur-2xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-overlay opacity-30" />
    </div>
  );
};

// Floating label input component
interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const FloatingLabelInput = ({ label, icon, error, className, ...props }: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value && String(props.value).length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          {...props}
          className={cn(
            "h-12 w-full rounded-lg border-border/60 bg-background/50 px-4 pt-5 pb-1 text-foreground transition-all duration-200 focus:border-primary focus:bg-background/80 focus:ring-2 focus:ring-primary/20",
            icon && "pl-10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className,
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        <motion.label
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground transition-colors duration-200",
            icon && "left-10",
            (isFocused || hasValue) && "text-primary",
            error && "text-destructive",
          )}
          animate={{
            y: isFocused || hasValue ? -20 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            x: isFocused || hasValue ? (icon ? -24 : 0) : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {label}
        </motion.label>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: [0, -10, 10, -10, 10, 0]
          }}
          transition={{ 
            duration: 0.5,
            x: { duration: 0.3 }
          }}
          className="mt-1.5 text-xs text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { login, getDashboardRoute } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShakeKey((prev) => prev + 1);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({ ...errors, general: undefined });

    try {
      const response = await authService.login({ email, password });
      
      // Decode JWT to get actual user role from backend
const token = response.jwtToken;
const payload = JSON.parse(atob(token.split('.')[1]));
const actualRole = payload.roles;

// Create user object
const userData = {
  id: String(response.userId || 1),
  email,
  role: actualRole as 'admin' | 'manager' | 'team-leader' | 'team-member',
  name: response.userName || email.split('@')[0],
};

// ✅ ADD THIS HERE
const roleToRouteMap = {
  admin: "/dashboard",
  manager: "/manager-dashboard",
  "team-leader": "/team-leader-dashboard",
  "team-member": "/member-dashboard",
} as const;


// Login + navigate (NO race condition)
login(userData, response.jwtToken);
navigate(roleToRouteMap[actualRole]);

      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      setErrors({ ...errors, general: errorMessage });
      setShakeKey((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-hero-gradient" />
      
      {/* Animated shapes */}
      <AnimatedShapes />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel relative w-full max-w-[450px] rounded-3xl border border-white/12 p-8 shadow-brand-strong md:p-10"
      >
        {/* Decorative orb */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orb-gradient opacity-50 blur-3xl" />

        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-orb-gradient text-background shadow-brand-soft transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold">TS</span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                TaskSphere
              </span>
              <span className="text-xs text-muted-foreground">
                Orchestrate every microservice
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Input */}
          <motion.div
            key={`email-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.email && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.email && shakeKey > 0 ? 0 : 0.3,
              x: errors.email && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.3 }
            }}
          >
            <FloatingLabelInput
              type="email"
              label="Email"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              autoComplete="email"
            />
          </motion.div>


          {/* Password Input */}
          <motion.div
            key={`password-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.password && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.password && shakeKey > 0 ? 0 : 0.5,
              x: errors.password && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.5 }
            }}
          >
            <div className="relative w-full">
              <FloatingLabelInput
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={errors.password}
                autoComplete="current-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-foreground transition-colors"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* General Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-mesh-gradient text-primary-foreground shadow-brand-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-strong disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                  />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative flex items-center justify-center py-4"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative bg-background/80 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Or continue with
            </span>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              type="button"
              variant="outline"
              className="group h-12 rounded-lg border-border/60 bg-background/50 backdrop-blur transition-all hover:bg-background/80 hover:scale-105"
            >
              <Chrome className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <span className="sr-only">Sign in with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="group h-12 rounded-lg border-border/60 bg-background/50 backdrop-blur transition-all hover:bg-background/80 hover:scale-105"
            >
              <Github className="h-5 w-5 text-foreground transition-transform group-hover:scale-110" />
              <span className="sr-only">Sign in with GitHub</span>
            </Button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

