import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const InteractiveMap = ({ location, weatherData }) => {
  const [activeLayer, setActiveLayer] = useState("radar");
  const [zoom, setZoom] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const layers = [
    { id: "radar", label: "Radar", icon: "Radar", color: "bg-primary-500" },
    { id: "satellite", label: "Satellite", icon: "Satellite", color: "bg-secondary-500" },
    { id: "temperature", label: "Temperature", icon: "Thermometer", color: "bg-accent-500" },
    { id: "precipitation", label: "Precipitation", icon: "CloudRain", color: "bg-blue-500" },
    { id: "wind", label: "Wind", icon: "Wind", color: "bg-green-500" }
  ];

  const storms = [
    {
      id: 1,
      name: "Storm System Alpha",
      type: "thunderstorm",
      intensity: "severe",
      lat: location?.coordinates.lat + 0.5 || 40.7,
      lng: location?.coordinates.lng - 0.3 || -74.0,
      direction: "NE",
      speed: "15 mph"
    },
    {
      id: 2,
      name: "Precipitation Band",
      type: "rain",
      intensity: "moderate",
      lat: location?.coordinates.lat - 0.3 || 40.4,
      lng: location?.coordinates.lng + 0.2 || -73.8,
      direction: "E",
      speed: "8 mph"
    }
  ];

  const handleLayerChange = async (layerId) => {
    setIsLoading(true);
    setActiveLayer(layerId);
    // Simulate layer loading
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 15));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 3));
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case "severe": return "bg-error-500";
      case "moderate": return "bg-warning-500";
      case "light": return "bg-success-500";
      default: return "bg-primary-500";
    }
  };

  return (
    <Card className="overflow-hidden h-[600px] relative">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg">
          <ApperIcon name="Map" className="h-4 w-4 text-primary-500" />
          <span className="text-sm font-medium text-slate-900">
            Interactive Radar
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="icon"
            onClick={handleZoomIn}
            className="shadow-lg"
          >
            <ApperIcon name="Plus" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={handleZoomOut}
            className="shadow-lg"
          >
            <ApperIcon name="Minus" />
          </Button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-20 left-4 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-2">
        <div className="space-y-1">
          {layers.map((layer) => (
            <Button
              key={layer.id}
              variant={activeLayer === layer.id ? "default" : "ghost"}
              size="sm"
              icon={layer.icon}
              onClick={() => handleLayerChange(layer.id)}
              className={`w-full justify-start text-xs ${
                activeLayer === layer.id 
                  ? "shadow-sm" 
                  : "hover:bg-slate-100"
              }`}
            >
              {layer.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Storm Tracker */}
      <div className="absolute top-4 right-20 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3 max-w-xs">
        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <ApperIcon name="Zap" className="h-4 w-4 text-accent-500" />
          Storm Tracker
        </h3>
        <div className="space-y-2">
          {storms.map((storm) => (
            <div key={storm.id} className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${getIntensityColor(storm.intensity)}`} />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{storm.name}</div>
                <div className="text-xs text-slate-600">
                  Moving {storm.direction} at {storm.speed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Display Area */}
      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center">
              <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Loading {activeLayer} layer...</p>
            </div>
          </div>
        )}
        
        {/* Simulated Map Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
              <ApperIcon name="MapPin" className="h-8 w-8 text-primary-700" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
              <h3 className="font-semibold text-slate-900 mb-2">
                {location?.name || "Current Location"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Thermometer" className="h-4 w-4 text-accent-500" />
                  <span>{Math.round(weatherData?.current?.temperature || 72)}°F</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Wind" className="h-4 w-4 text-primary-500" />
                  <span>{weatherData?.current?.windSpeed || 8} mph</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Droplets" className="h-4 w-4 text-blue-500" />
                  <span>{weatherData?.current?.precipitationChance || 15}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Eye" className="h-4 w-4 text-slate-500" />
                  <span>Zoom {zoom}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storm Markers */}
        {storms.map((storm) => (
          <motion.div
            key={storm.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute w-8 h-8 ${getIntensityColor(storm.intensity)} rounded-full flex items-center justify-center shadow-lg`}
            style={{
              left: `${50 + (storm.lng - (location?.coordinates.lng || -74.0)) * 100}%`,
              top: `${50 + (location?.coordinates.lat - storm.lat || 40.7 - storm.lat) * 100}%`
            }}
          >
            <ApperIcon name="Zap" className="h-4 w-4 text-white" />
          </motion.div>
        ))}
        
        {/* Location Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <ApperIcon name="MapPin" className="h-3 w-3 text-white" />
        </motion.div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-slate-600">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-slate-600">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <span className="text-slate-600">Severe</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;