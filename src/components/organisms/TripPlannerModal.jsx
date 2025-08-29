import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { locationService } from "@/services/api/locationService";
import { weatherService } from "@/services/api/weatherService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const TripPlannerModal = ({ isOpen, onClose }) => {
  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchLocations();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const searchLocations = async () => {
    setIsSearching(true);
    try {
      const results = await locationService.search(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      toast.error("Failed to search locations");
    } finally {
      setIsSearching(false);
    }
  };

  const addLocation = async (location) => {
    if (locations.find(loc => loc.Id === location.Id)) {
      toast.warning("Location already added to comparison");
      return;
    }

    if (locations.length >= 4) {
      toast.warning("Maximum 4 locations can be compared");
      return;
    }

    setLocations(prev => [...prev, location]);
    setSearchQuery("");
    setShowResults(false);
    
    // Load weather data for the new location
    setLoadingWeather(true);
    try {
      const weather = await weatherService.getByLocationId(location.Id);
      setWeatherData(prev => ({
        ...prev,
        [location.Id]: weather
      }));
      toast.success(`Added ${location.name} to comparison`);
    } catch (error) {
      toast.error(`Failed to load weather for ${location.name}`);
    } finally {
      setLoadingWeather(false);
    }
  };

  const removeLocation = (locationId) => {
    setLocations(prev => prev.filter(loc => loc.Id !== locationId));
    setWeatherData(prev => {
      const newData = { ...prev };
      delete newData[locationId];
      return newData;
    });
    toast.info("Location removed from comparison");
  };

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

  const clearAllLocations = () => {
    setLocations([]);
    setWeatherData({});
    toast.info("All locations cleared");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Trip Planner</h2>
              <p className="text-sm text-slate-600">Compare weather across destinations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {locations.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllLocations}>
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Location Search */}
          <div className="mb-6">
            <div className="relative">
              <Input
                icon="Search"
                placeholder="Search destinations to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="text-lg"
              />

              {/* Search Results */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-slate-500">
                      <ApperIcon name="Loader2" className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Searching destinations...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((location) => (
                        <button
                          key={location.Id}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center justify-between group"
                          onClick={() => addLocation(location)}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{location.name}</div>
                            <div className="text-sm text-slate-500">{location.region}, {location.country}</div>
                          </div>
                          <ApperIcon 
                            name="Plus" 
                            className="h-4 w-4 text-slate-400 group-hover:text-primary-600" 
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500">
                      No destinations found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Weather Comparison Grid */}
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ApperIcon name="MapPin" className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Planning Your Trip</h3>
              <p className="text-slate-600 mb-4">Add destinations to compare weather conditions side-by-side</p>
              <div className="text-sm text-slate-500">
                <p>• Search for cities, regions, or countries</p>
                <p>• Compare up to 4 destinations</p>
                <p>• View current conditions and forecasts</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {loadingWeather && (
                <div className="text-center py-4">
                  <ApperIcon name="Loader2" className="h-6 w-6 animate-spin mx-auto mb-2 text-primary-500" />
                  <p className="text-sm text-slate-600">Loading weather data...</p>
                </div>
              )}

              <div className={`grid gap-4 ${
                locations.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                locations.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                locations.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}>
                {locations.map((location) => {
                  const weather = weatherData[location.Id];
                  
                  return (
                    <Card 
                      key={location.Id} 
                      className={`p-4 relative ${weather ? getWeatherGradient(weather.current.condition) : 'bg-slate-100'} text-white`}
                    >
                      {/* Remove button */}
                      <button
                        onClick={() => removeLocation(location.Id)}
                        className="absolute top-3 right-3 p-1 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </button>

                      {/* Location Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold mb-1">{location.name}</h3>
                        <p className="text-white/80 text-sm">{location.region}, {location.country}</p>
                      </div>

                      {weather ? (
                        <div className="space-y-4">
                          {/* Current Weather */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-3xl font-black mb-1">
                                {Math.round(weather.current.temperature)}°
                              </div>
                              <div className="text-white/90 text-sm">
                                Feels like {Math.round(weather.current.feelsLike)}°
                              </div>
                            </div>
                            <ApperIcon 
                              name={getWeatherIcon(weather.current.condition)} 
                              className="h-12 w-12"
                            />
                          </div>

                          <div className="space-y-2 text-sm">
                            <Badge variant="glass" className="text-white bg-white/20 border-white/30 text-xs">
                              {weather.current.description}
                            </Badge>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Droplets" className="h-3 w-3" />
                                <span>{weather.current.humidity}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Wind" className="h-3 w-3" />
                                <span>{weather.current.windSpeed} mph</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ApperIcon name="CloudRain" className="h-3 w-3" />
                                <span>{weather.current.precipitationChance}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Sun" className="h-3 w-3" />
                                <span>UV {weather.current.uvIndex}</span>
                              </div>
                            </div>
                          </div>

                          {/* 3-Day Preview */}
                          <div className="border-t border-white/20 pt-3">
                            <div className="text-xs text-white/80 mb-2">3-Day Forecast</div>
                            <div className="space-y-1">
                              {weather.daily.slice(0, 3).map((day, index) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <span className="text-white/90">
                                    {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <ApperIcon 
                                      name={getWeatherIcon(day.condition)} 
                                      className="h-3 w-3"
                                    />
                                    <span>{Math.round(day.high)}°/{Math.round(day.low)}°</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-8 text-white/60">
                          <ApperIcon name="Loader2" className="h-6 w-6 animate-spin" />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripPlannerModal;