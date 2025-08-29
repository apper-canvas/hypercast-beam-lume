import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ForecastCard = ({ forecast, type = "daily" }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      "partly-cloudy": "CloudSun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      foggy: "CloudDrizzle"
    };
    return iconMap[condition] || "Sun";
  };

  const getPrecipitationColor = (chance) => {
    if (chance >= 70) return "text-primary-600";
    if (chance >= 40) return "text-accent-600";
    return "text-slate-400";
  };

  if (type === "hourly") {
    return (
      <div className="flex-shrink-0 glass-card rounded-xl p-4 w-28 text-center">
        <div className="text-sm font-medium text-slate-600 mb-2">
          {format(new Date(forecast.time), "ha")}
        </div>
        <div className="flex justify-center mb-2">
          <ApperIcon 
            name={getWeatherIcon(forecast.condition)} 
            className="h-8 w-8 text-accent-500"
          />
        </div>
        <div className="text-lg font-bold text-slate-900 mb-1">
          {Math.round(forecast.temperature)}°
        </div>
        {forecast.precipitationChance > 0 && (
          <div className={`text-xs font-medium ${getPrecipitationColor(forecast.precipitationChance)}`}>
            {forecast.precipitationChance}%
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-slate-900">
            {format(new Date(forecast.date), "EEE")}
          </div>
          <div className="text-sm text-slate-500">
            {format(new Date(forecast.date), "MMM d")}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon 
            name={getWeatherIcon(forecast.condition)} 
            className="h-8 w-8 text-accent-500"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold text-slate-900">
          {Math.round(forecast.high)}°
        </div>
        <div className="text-lg text-slate-500">
          {Math.round(forecast.low)}°
        </div>
      </div>
      
      <div className="space-y-2">
        {forecast.precipitationChance > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <ApperIcon name="Droplets" className="h-4 w-4 text-primary-500" />
              <span className="text-slate-600">Rain</span>
            </div>
            <span className={`font-medium ${getPrecipitationColor(forecast.precipitationChance)}`}>
              {forecast.precipitationChance}%
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <ApperIcon name="Wind" className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Wind</span>
          </div>
          <span className="font-medium text-slate-700">
            {forecast.windSpeed} mph
          </span>
        </div>
      </div>
      
      {forecast.summary && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <Badge variant="glass" size="sm" className="text-xs">
            {forecast.summary}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ForecastCard;