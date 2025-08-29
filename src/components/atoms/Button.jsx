import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-primary text-white shadow-lg hover:shadow-xl border-0",
    secondary: "bg-gradient-secondary text-white shadow-lg hover:shadow-xl border-0",
    outline: "border-2 border-primary-300 text-primary-700 bg-white/70 hover:bg-primary-50 backdrop-blur-sm",
    ghost: "text-primary-700 hover:bg-primary-50 bg-transparent",
    destructive: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg hover:shadow-xl border-0",
    glass: "glass-card text-slate-700 hover:bg-white/80"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    default: "px-6 py-2.5 text-sm rounded-lg",
    lg: "px-8 py-3 text-base rounded-xl",
    icon: "p-2.5 rounded-lg"
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;