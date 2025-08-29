import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  size = "default",
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "border-slate-300 bg-white/70 backdrop-blur-sm focus:border-primary-500 focus:ring-primary-500",
    error: "border-error-500 bg-error-50/70 focus:border-error-500 focus:ring-error-500",
    success: "border-success-500 bg-success-50/70 focus:border-success-500 focus:ring-success-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    default: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-4 py-3 text-base rounded-xl"
  };

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full border transition-all duration-200 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;