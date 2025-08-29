import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  icon,
  iconPosition = "left",
  error,
  label,
  ...props 
}, ref) => {
  const inputStyles = "flex w-full px-4 py-2.5 text-sm bg-white/70 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorStyles = "border-error-300 focus:ring-error-500 focus:border-error-500";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ApperIcon name={icon} className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            inputStyles,
            error && errorStyles,
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className
          )}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ApperIcon name={icon} className="h-4 w-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;