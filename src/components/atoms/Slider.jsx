import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Slider = forwardRef(({ 
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  ...props 
}, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(parseInt(e.target.value))}
        className={cn(
          "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer",
          "slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4",
          "slider-thumb:rounded-full slider-thumb:bg-primary-500",
          "slider-thumb:cursor-pointer slider-thumb:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          className
        )}
        style={{
          background: `linear-gradient(to right, #1E88E5 0%, #1E88E5 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
        }}
        {...props}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;