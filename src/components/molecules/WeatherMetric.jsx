import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const WeatherMetric = ({ 
  icon, 
  label, 
  value, 
  unit, 
  color = "text-slate-600",
  size = "default",
  className 
}) => {
  const sizes = {
    sm: {
      container: "p-3",
      icon: "h-5 w-5",
      value: "text-lg",
      label: "text-xs"
    },
    default: {
      container: "p-4",
      icon: "h-6 w-6",
      value: "text-2xl",
      label: "text-sm"
    },
    lg: {
      container: "p-6",
      icon: "h-8 w-8",
      value: "text-3xl",
      label: "text-base"
    }
  };

  const sizeConfig = sizes[size];

  return (
    <div className={cn(
      "glass-card rounded-xl transition-all duration-200 hover:scale-[1.02]",
      sizeConfig.container,
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("flex-shrink-0", color)}>
          <ApperIcon name={icon} className={sizeConfig.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn("font-bold text-slate-900", sizeConfig.value)}>
            {value}
            {unit && <span className="text-sm font-normal text-slate-600 ml-1">{unit}</span>}
          </div>
          <div className={cn("text-slate-600 font-medium", sizeConfig.label)}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMetric;