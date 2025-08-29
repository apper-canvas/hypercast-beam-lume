import React, { useState, useEffect } from "react";
import InteractiveMap from "@/components/organisms/InteractiveMap";
import LocationSelector from "@/components/molecules/LocationSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";
import { locationService } from "@/services/api/locationService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOffline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Try to load default location on mount
    loadDefaultLocation();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadWeatherData();
    }
  }, [selectedLocation]);

  const loadDefaultLocation = async () => {
try {
      const locations = await locationService.getAll();
      if (locations.length > 0) {
        // If offline, try to use a cached location
        if (isOffline) {
          const cachedLocations = weatherService.getCachedLocations();
          if (cachedLocations.length > 0) {
            const cachedLocation = locations.find(loc => 
              loc.Id.toString() === cachedLocations[0].identifier
            );
            if (cachedLocation) {
              setSelectedLocation(cachedLocation);
              toast.info("Offline: Using cached location data", { icon: "📱" });
              return;
            }
          }
        }
        setSelectedLocation(locations[0]);
      }
    } catch (err) {
      console.error("Failed to load default location:", err);
    }
  };

  const loadWeatherData = async () => {
    if (!selectedLocation) return;
    
    setLoading(true);
    setError("");
    
    try {
      const weather = await weatherService.getByLocationId(selectedLocation.Id);
      setWeatherData(weather);
    } catch (err) {
      setError("Failed to load weather data for map. Please try again.");
      toast.error("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    toast.success(`Map updated for ${location.name}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !weatherData) {
    return <Error message={error} onRetry={loadWeatherData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Interactive Weather Map
              </h1>
              <p className="text-slate-600">
                Real-time radar, satellite imagery, and storm tracking
              </p>
            </div>
            
            {/* Location Selector */}
            <div className="w-full lg:w-96">
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>

          {/* Map */}
          <div className="w-full">
            <InteractiveMap 
              location={selectedLocation}
              weatherData={weatherData}
            />
          </div>

          {/* Map Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="glass-card p-4 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Choose Layer
              </h3>
              <p className="text-sm text-slate-600">
                Select from radar, satellite, temperature, precipitation, or wind layers to view different weather data.
              </p>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Track Storms
              </h3>
              <p className="text-sm text-slate-600">
                Monitor active storm systems with real-time tracking and movement predictions.
              </p>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Zoom & Pan
              </h3>
              <p className="text-sm text-slate-600">
                Use zoom controls to get detailed views of local weather patterns and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;