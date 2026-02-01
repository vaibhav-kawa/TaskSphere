import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { authService } from "../services/authService";

// Animated background shapes component (reused from Login)
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

// Floating label input component with success indicator
interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isValid?: boolean;
}

const FloatingLabelInput = ({ label, icon, error, isValid, className, ...props }: FloatingLabelInputProps) => {
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
            isValid && !error && "border-primary/50",
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
        {isValid && !error && hasValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
          >
            <CheckCircle2 className="h-5 w-5" />
          </motion.div>
        )}
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

// Floating label select component
interface FloatingLabelSelectProps {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  isValid?: boolean;
  options: { value: string; label: string }[];
}

const FloatingLabelSelect = ({ label, value, onValueChange, error, isValid, options }: FloatingLabelSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            className={cn(
              "h-12 w-full rounded-lg border-border/60 bg-background/50 px-4 pt-5 pb-1 text-foreground transition-all duration-200 focus:border-primary focus:bg-background/80 focus:ring-2 focus:ring-primary/20 [&>span]:pt-0",
              isValid && !error && "border-primary/50",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-border/60 bg-background/95 backdrop-blur-md shadow-brand-soft">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <motion.label
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground transition-colors duration-200",
            (isFocused || hasValue) && "text-primary",
            error && "text-destructive",
          )}
          animate={{
            y: isFocused || hasValue ? -20 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {label}
        </motion.label>
        {isValid && !error && hasValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
          >
            <CheckCircle2 className="h-5 w-5" />
          </motion.div>
        )}
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

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    gender?: string;
    role?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "team-leader", label: "Team Lead" },
    { value: "team-member", label: "Team Member" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return undefined;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        return undefined;
      case "phoneNumber":
        if (!value) return "Phone number is required";
        if (!/^[\d\s\+\-\(\)]{10,15}$/.test(value.replace(/\s/g, ""))) return "Please enter a valid phone number";
        return undefined;
      case "gender":
        if (!value) return "Please select a gender";
        return undefined;
      case "role":
        if (!value) return "Please select a role";
        return undefined;
      default:
        return undefined;
    }
  };

  const isFieldValid = (field: string, value: string) => {
    return !validateField(field, value) && value.length > 0;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    newErrors.fullName = validateField("fullName", fullName);
    newErrors.email = validateField("email", email);
    newErrors.password = validateField("password", password);
    newErrors.confirmPassword = validateField("confirmPassword", confirmPassword);
    newErrors.phoneNumber = validateField("phoneNumber", phoneNumber);
    newErrors.gender = validateField("gender", gender);
    newErrors.role = validateField("role", role);

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).filter((k) => newErrors[k as keyof typeof newErrors]).length > 0) {
      setShakeKey((prev) => prev + 1);
    }
    return Object.keys(newErrors).filter((k) => newErrors[k as keyof typeof newErrors]).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ ...errors, general: undefined });

    try {
      const registerData = {
        name: fullName,
        email,
        password,
        role,
        phoneNumber,
        gender
      };
      
      console.log('Registering user:', registerData);
      const registerResponse = await authService.register(registerData);
      console.log('Registration successful:', registerResponse);
      
      // After successful registration, login to get JWT token
      console.log('Attempting login after registration...');
      const loginResponse = await authService.login({ email, password });
      console.log('Login successful:', loginResponse);
      
      localStorage.setItem('authToken', loginResponse.jwtToken);
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      }
      
      setErrors({ ...errors, general: errorMessage });
      setShakeKey((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-hero-gradient" />
      
      {/* Animated shapes */}
      <AnimatedShapes />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel relative w-full max-w-[450px] rounded-3xl border border-white/12 p-8 shadow-brand-strong md:p-10"
      >
        {/* Decorative orb */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orb-gradient opacity-50 blur-3xl" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
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
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join TaskSphere to boost your team productivity
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <motion.div
            key={`fullName-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.fullName && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.fullName && shakeKey > 0 ? 0 : 0.3,
              x: errors.fullName && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.3 }
            }}
          >
            <FloatingLabelInput
              type="text"
              label="Full Name"
              icon={<User className="h-4 w-4" />}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: validateField("fullName", e.target.value) });
                }
              }}
              error={errors.fullName}
              isValid={isFieldValid("fullName", fullName)}
              autoComplete="name"
            />
          </motion.div>

          {/* Email Input */}
          <motion.div
            key={`email-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.email && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.email && shakeKey > 0 ? 0 : 0.4,
              x: errors.email && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.4 }
            }}
          >
            <FloatingLabelInput
              type="email"
              label="Email Address"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: validateField("email", e.target.value) });
                }
              }}
              error={errors.email}
              isValid={isFieldValid("email", email)}
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
                  if (errors.password) {
                    setErrors({ ...errors, password: validateField("password", e.target.value) });
                  }
                  if (confirmPassword && errors.confirmPassword) {
                    setErrors({ 
                      ...errors, 
                      confirmPassword: validateField("confirmPassword", confirmPassword) 
                    });
                  }
                }}
                error={errors.password}
                isValid={isFieldValid("password", password)}
                autoComplete="new-password"
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

          {/* Confirm Password Input */}
          <motion.div
            key={`confirmPassword-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.confirmPassword && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.confirmPassword && shakeKey > 0 ? 0 : 0.6,
              x: errors.confirmPassword && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.6 }
            }}
          >
            <div className="relative w-full">
              <FloatingLabelInput
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                icon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: validateField("confirmPassword", e.target.value) });
                  }
                }}
                error={errors.confirmPassword}
                isValid={isFieldValid("confirmPassword", confirmPassword) && confirmPassword === password}
                autoComplete="new-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          {/* Phone Number Input */}
          <motion.div
            key={`phoneNumber-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.phoneNumber && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.phoneNumber && shakeKey > 0 ? 0 : 0.7,
              x: errors.phoneNumber && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.7 }
            }}
          >
            <FloatingLabelInput
              type="tel"
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber) {
                  setErrors({ ...errors, phoneNumber: validateField("phoneNumber", e.target.value) });
                }
              }}
              error={errors.phoneNumber}
              isValid={isFieldValid("phoneNumber", phoneNumber)}
              autoComplete="tel"
            />
          </motion.div>

          {/* Gender Selection */}
          <motion.div
            key={`gender-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.gender && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.gender && shakeKey > 0 ? 0 : 0.8,
              x: errors.gender && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.8 }
            }}
          >
            <FloatingLabelSelect
              label="Gender"
              value={gender}
              onValueChange={(value) => {
                setGender(value);
                if (errors.gender) {
                  setErrors({ ...errors, gender: validateField("gender", value) });
                }
              }}
              error={errors.gender}
              isValid={isFieldValid("gender", gender)}
              options={genderOptions}
            />
          </motion.div>

          {/* Role Selection */}
          <motion.div
            key={`role-${shakeKey}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: errors.role && shakeKey > 0 ? [0, -8, 8, -8, 8, 0] : 0
            }}
            transition={{ 
              delay: errors.role && shakeKey > 0 ? 0 : 0.9,
              x: errors.role && shakeKey > 0 ? { duration: 0.4, ease: "easeInOut" } : { delay: 0.9 }
            }}
          >
            <FloatingLabelSelect
              label="Role"
              value={role}
              onValueChange={(value) => {
                setRole(value);
                if (errors.role) {
                  setErrors({ ...errors, role: validateField("role", value) });
                }
              }}
              error={errors.role}
              isValid={isFieldValid("role", role)}
              options={roleOptions}
            />
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

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="space-y-2"
          >
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => {
                  setAcceptedTerms(checked === true);
                  if (errors.terms) {
                    setErrors({ ...errors, terms: undefined });
                  }
                }}
                className={cn(
                  "mt-0.5 border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                  errors.terms && "border-destructive"
                )}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>
            {errors.terms && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive ml-6"
              >
                {errors.terms}
              </motion.p>
            )}
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
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
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline transition-colors"
            >
              Login
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;

