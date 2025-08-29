import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    error: "bg-error-100 text-error-800 border-error-200",
    accent: "bg-accent-100 text-accent-800 border-accent-200",
    glass: "glass-card text-slate-700"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-md",
    default: "px-2.5 py-1 text-xs rounded-lg",
    lg: "px-3 py-1.5 text-sm rounded-lg"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium border transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;