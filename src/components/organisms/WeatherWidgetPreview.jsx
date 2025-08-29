import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const WeatherWidgetPreview = ({ weatherData, location, className }) => {
  if (!weatherData || !location) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        <Card className="p-4 animate-pulse">
          <div className="h-20 bg-slate-200 rounded"></div>
        </Card>
        <Card className="p-6 animate-pulse">
          <div className="h-32 bg-slate-200 rounded"></div>
        </Card>
        <Card className="p-8 animate-pulse">
          <div className="h-40 bg-slate-200 rounded"></div>
        </Card>
      </div>
    );
  }

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

  const getWeatherGradient = (condition) => {
    const gradientMap = {
      sunny: "weather-gradient-sunny",
      "partly-cloudy": "weather-gradient-sunny",
      cloudy: "weather-gradient-cloudy",
      rainy: "weather-gradient-rainy",
      stormy: "weather-gradient-stormy",
      snowy: "weather-gradient-snowy"
    };
    return gradientMap[condition] || "weather-gradient-sunny";
  };

  const { current } = weatherData;

  // Small Widget
  const SmallWidget = () => (
    <Card className="p-4 cursor-pointer hover:scale-105 transition-all duration-200">
      <div className="text-center">
        <div className="text-xs font-medium text-slate-600 mb-1">
          {location.name}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <ApperIcon 
            name={getWeatherIcon(current.condition)} 
            className="h-6 w-6 text-accent-500"
          />
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(current.temperature)}°
          </div>
        </div>
        <div className="text-xs text-slate-600">
          {current.description}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100">
        <Badge variant="glass" size="sm" className="w-full text-center">
          Small Widget
        </Badge>
      </div>
    </Card>
  );

  // Medium Widget
  const MediumWidget = () => (
    <Card className="p-6 cursor-pointer hover:scale-105 transition-all duration-200">
      <div className="text-center mb-4">
        <div className="text-sm font-medium text-slate-600 mb-2">
          {location.name}
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <ApperIcon 
            name={getWeatherIcon(current.condition)} 
            className="h-12 w-12 text-accent-500"
          />
          <div>
            <div className="text-3xl font-bold text-slate-900">
              {Math.round(current.temperature)}°
            </div>
            <div className="text-sm text-slate-600">
              Feels {Math.round(current.feelsLike)}°
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-700 mb-3">
          {current.description}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ApperIcon name="Droplets" className="h-4 w-4 text-primary-500" />
          <span className="text-slate-600">{current.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Wind" className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{current.windSpeed} mph</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Badge variant="glass" size="sm" className="w-full text-center">
          Medium Widget
        </Badge>
      </div>
    </Card>
  );

  // Large Widget
  const LargeWidget = () => (
    <Card className="p-8 cursor-pointer hover:scale-105 transition-all duration-200">
      <div className="text-center mb-6">
        <div className="text-lg font-semibold text-slate-800 mb-2">
          {location.name}
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className={cn(
            "p-4 rounded-full",
            getWeatherGradient(current.condition)
          )}>
            <ApperIcon 
              name={getWeatherIcon(current.condition)} 
              className="h-16 w-16 text-white"
            />
          </div>
          <div className="text-left">
            <div className="text-4xl font-bold text-slate-900">
              {Math.round(current.temperature)}°
            </div>
            <div className="text-sm text-slate-600">
              Feels like {Math.round(current.feelsLike)}°
            </div>
            <div className="text-sm text-slate-500">
              H:{Math.round(current.highToday)}° L:{Math.round(current.lowToday)}°
            </div>
          </div>
        </div>
        <div className="text-base text-slate-700 mb-4">
          {current.description}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <ApperIcon name="Droplets" className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{current.humidity}%</div>
            <div className="text-xs text-slate-600">Humidity</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-50 rounded-lg">
            <ApperIcon name="Wind" className="h-5 w-5 text-accent-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">
              {current.windSpeed} mph
            </div>
            <div className="text-xs text-slate-600">Wind {current.windDirection}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-50 rounded-lg">
            <ApperIcon name="Eye" className="h-5 w-5 text-secondary-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{current.visibility} mi</div>
            <div className="text-xs text-slate-600">Visibility</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success-50 rounded-lg">
            <ApperIcon name="Gauge" className="h-5 w-5 text-success-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">
              {current.pressure} mb
            </div>
            <div className="text-xs text-slate-600">Pressure</div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100">
        <Badge variant="glass" size="sm" className="w-full text-center">
          Large Widget
        </Badge>
      </div>
    </Card>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Weather Widget Preview
        </h3>
        <p className="text-slate-600 text-sm">
          Choose from different widget sizes for quick weather access
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SmallWidget />
        <MediumWidget />
        <LargeWidget />
      </div>
    </div>
  );
};

export default WeatherWidgetPreview;