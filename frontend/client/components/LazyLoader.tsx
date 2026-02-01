import { Suspense } from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary"
    />
  </div>
);

interface LazyLoaderProps {
  children: React.ReactNode;
}

export const LazyLoader = ({ children }: LazyLoaderProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);