import React from "react";
import Card from "@/components/atoms/Card";
import WeatherMetric from "@/components/molecules/WeatherMetric";
import AirQualityGauge from "@/components/molecules/AirQualityGauge";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CurrentWeatherCard = ({ weatherData, location }) => {
  if (!weatherData) return null;

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
    const gradients = {
      sunny: "weather-gradient-sunny",
      "partly-cloudy": "weather-gradient-cloudy",
      cloudy: "weather-gradient-cloudy",
      rainy: "weather-gradient-rainy",
      stormy: "weather-gradient-stormy",
      snowy: "weather-gradient-snowy",
      foggy: "weather-gradient-cloudy"
    };
    return gradients[condition] || "weather-gradient-sunny";
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: "Low", color: "success" };
    if (uvIndex <= 5) return { level: "Moderate", color: "warning" };
    if (uvIndex <= 7) return { level: "High", color: "accent" };
    if (uvIndex <= 10) return { level: "Very High", color: "error" };
    return { level: "Extreme", color: "error" };
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: "Good", color: "success" };
    if (aqi <= 100) return { level: "Moderate", color: "warning" };
    if (aqi <= 150) return { level: "Unhealthy for Sensitive", color: "accent" };
    if (aqi <= 200) return { level: "Unhealthy", color: "error" };
    return { level: "Hazardous", color: "error" };
  };

  const uvLevel = getUVLevel(weatherData.current.uvIndex);
  const aqiLevel = getAQILevel(weatherData.current.airQuality.aqi);

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className={`${getWeatherGradient(weatherData.current.condition)} text-white overflow-hidden relative`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{location?.name}</h2>
              <p className="text-white/80 text-sm">
                {format(new Date(), "EEEE, MMMM d • h:mm a")}
              </p>
            </div>
            <div className="text-right">
              <ApperIcon 
                name={getWeatherIcon(weatherData.current.condition)} 
                className="h-16 w-16 mb-2"
              />
            </div>
          </div>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="text-6xl font-black">
              {Math.round(weatherData.current.temperature)}°
            </div>
            <div className="text-xl font-medium mb-2 text-white/90">
              Feels like {Math.round(weatherData.current.feelsLike)}°
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="glass" className="text-white bg-white/20 border-white/30">
              {weatherData.current.description}
            </Badge>
            <Badge variant="glass" className="text-white bg-white/20 border-white/30">
              H: {Math.round(weatherData.current.highToday)}° L: {Math.round(weatherData.current.lowToday)}°
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ApperIcon name="Droplets" className="h-4 w-4" />
              <span>Humidity {weatherData.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Wind" className="h-4 w-4" />
              <span>{weatherData.current.windSpeed} mph {weatherData.current.windDirection}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Eye" className="h-4 w-4" />
              <span>Visibility {weatherData.current.visibility} mi</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Gauge" className="h-4 w-4" />
              <span>Pressure {weatherData.current.pressure} mb</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WeatherMetric
          icon="Sun"
          label="UV Index"
          value={weatherData.current.uvIndex}
          color="text-accent-500"
        />
        
        <WeatherMetric
          icon="Leaf"
          label="Air Quality"
          value={weatherData.current.airQuality.aqi}
          color={aqiLevel.color === "success" ? "text-success-500" : 
                 aqiLevel.color === "warning" ? "text-warning-500" : 
                 aqiLevel.color === "error" ? "text-error-500" : "text-accent-500"}
        />
        
        <WeatherMetric
          icon="Flower"
          label="Pollen"
          value={weatherData.current.pollen.overall}
          color="text-success-500"
        />
        
        <WeatherMetric
          icon="CloudRain"
          label="Rain Chance"
          value={weatherData.current.precipitationChance}
          unit="%"
          color="text-primary-500"
        />
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Sun" className="h-5 w-5 text-accent-500" />
            UV & Sun
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">UV Level</span>
              <Badge variant={uvLevel.color} size="sm">
                {uvLevel.level}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Sunrise</span>
              <span className="font-medium">
                {format(new Date(weatherData.current.sunrise), "h:mm a")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Sunset</span>
              <span className="font-medium">
                {format(new Date(weatherData.current.sunset), "h:mm a")}
              </span>
            </div>
          </div>
        </Card>
        
<Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Leaf" className="h-5 w-5 text-success-500" />
            Air Quality & Pollen
          </h3>
          <AirQualityGauge
            aqi={weatherData.current.airQuality.aqi}
            pm25={weatherData.current.airQuality.pm25}
            ozone={weatherData.current.airQuality.ozone}
            pollen={weatherData.current.pollen}
            healthRecommendations={weatherData.current.healthRecommendations}
          />
        </Card>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;