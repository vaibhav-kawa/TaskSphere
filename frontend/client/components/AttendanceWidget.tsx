import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceWidgetProps {
  className?: string;
}

export const AttendanceWidget = ({ className }: AttendanceWidgetProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginTime] = useState(new Date()); // Set login time when component mounts

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getWorkingHours = () => {
    const diff = currentTime.getTime() - loginTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Attendance</h3>
          <p className="text-sm text-muted-foreground">{formatTime(currentTime)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Logged in at:</span>
          <span className="font-medium text-foreground">
            {formatTime(loginTime)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Working hours:</span>
          <span className="font-medium text-primary">{getWorkingHours()}</span>
        </div>
      </div>
    </motion.div>
  );
};