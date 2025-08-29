import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const AirQualityGauge = ({ 
  aqi, 
  pm25, 
  ozone, 
  pollen, 
  healthRecommendations,
  className 
}) => {
  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { 
      level: "Good", 
      color: "success", 
      textColor: "text-success-600",
      bgColor: "bg-success-500",
      description: "Air quality is satisfactory" 
    };
    if (aqi <= 100) return { 
      level: "Moderate", 
      color: "warning", 
      textColor: "text-warning-600",
      bgColor: "bg-warning-500",
      description: "Acceptable for most people" 
    };
    if (aqi <= 150) return { 
      level: "Unhealthy for Sensitive", 
      color: "accent", 
      textColor: "text-accent-600",
      bgColor: "bg-accent-500",
      description: "Sensitive groups may experience symptoms" 
    };
    if (aqi <= 200) return { 
      level: "Unhealthy", 
      color: "error", 
      textColor: "text-error-600",
      bgColor: "bg-error-500",
      description: "Everyone may experience symptoms" 
    };
    return { 
      level: "Hazardous", 
      color: "error", 
      textColor: "text-error-600",
      bgColor: "bg-error-700",
      description: "Health alert - avoid outdoor activities" 
    };
  };

  const getPollenLevel = (overall) => {
    const levels = {
      "Low": { color: "text-success-600", icon: "CheckCircle" },
      "Moderate": { color: "text-warning-600", icon: "AlertCircle" },
      "High": { color: "text-error-600", icon: "AlertTriangle" },
      "Very High": { color: "text-error-700", icon: "AlertOctagon" }
    };
    return levels[overall] || levels["Low"];
  };

  const aqiLevel = getAQILevel(aqi);
  const pollenLevel = getPollenLevel(pollen.overall);
  const percentage = Math.min((aqi / 300) * 100, 100);

  return (
    <div className={cn("space-y-4", className)}>
      {/* AQI Gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          {/* Background circle */}
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2.51 * percentage} ${251.2 - (2.51 * percentage)}`}
                className={aqiLevel.textColor}
                style={{
                  transition: 'stroke-dasharray 1s ease-in-out'
                }}
              />
            </svg>
          </div>
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{aqi}</div>
              <div className="text-xs text-slate-600">AQI</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={aqiLevel.color} size="sm">
              {aqiLevel.level}
            </Badge>
          </div>
          <p className="text-sm text-slate-700 mb-2">
            {aqiLevel.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">PM2.5</span>
              <span className="font-medium">{pm25} μg/m³</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Ozone</span>
              <span className="font-medium">{ozone} μg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pollen Information */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ApperIcon name="Flower" className="h-4 w-4 text-accent-500" />
            <span className="text-sm font-medium text-slate-900">Pollen Count</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon 
              name={pollenLevel.icon} 
              className={cn("h-4 w-4", pollenLevel.color)} 
            />
            <span className={cn("text-sm font-medium", pollenLevel.color)}>
              {pollen.overall}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded-lg bg-slate-50">
            <div className="font-medium text-slate-900">{pollen.tree}</div>
            <div className="text-slate-600">Tree</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50">
            <div className="font-medium text-slate-900">{pollen.grass}</div>
            <div className="text-slate-600">Grass</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50">
            <div className="font-medium text-slate-900">{pollen.weed}</div>
            <div className="text-slate-600">Weed</div>
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      {healthRecommendations && healthRecommendations.length > 0 && (
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Heart" className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-slate-900">Health Recommendations</span>
          </div>
          <ul className="space-y-1">
            {healthRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
                <ApperIcon name="ChevronRight" className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AirQualityGauge;