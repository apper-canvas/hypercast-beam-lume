import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "glass-card",
    solid: "bg-white shadow-lg border border-slate-200",
    elevated: "bg-white shadow-xl border border-slate-200",
    gradient: "bg-gradient-primary text-white shadow-lg border-0"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.01]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;