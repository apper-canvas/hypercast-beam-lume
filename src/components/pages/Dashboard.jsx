import React, { useEffect, useState } from "react";
import { weatherService } from "@/services/api/weatherService";
import { aiInsightsService } from "@/services/api/aiInsightsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import LocationSelector from "@/components/molecules/LocationSelector";
import Badge from "@/components/atoms/Badge";
import ForecastSection from "@/components/organisms/ForecastSection";
import WeatherWidgetPreview from "@/components/organisms/WeatherWidgetPreview";
import CurrentWeatherCard from "@/components/organisms/CurrentWeatherCard";
import AIInsightsCard from "@/components/organisms/AIInsightsCard";
import WeatherAlertsSection from "@/components/organisms/WeatherAlertsSection";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dataSource, setDataSource] = useState('loading');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadWeatherData();
    }
  }, [selectedLocation]);

  const loadWeatherData = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    setError(null);
    setDataSource('loading');

    try {
      // Use the caching-enabled weather service method
      const data = await weatherService.getWeatherData(selectedLocation.Id);
      setWeatherData(data);
      
      // Determine data source for user feedback
      if (data._offline) {
        setDataSource('offline');
        toast.info(`Offline: Showing cached data for ${selectedLocation.name}`, {
          icon: "📱"
        });
      } else if (data._fromCache) {
        setDataSource('cached');
        toast.success(`Loaded cached data for ${selectedLocation.name}`, {
          icon: "⚡"
        });
      } else if (data._fallbackToCache) {
        setDataSource('fallback');
        toast.warning(`Network issue: Using cached data for ${selectedLocation.name}`, {
          icon: "⚠️"
        });
      } else {
        setDataSource('live');
        toast.success(`Weather loaded for ${selectedLocation.name}`);
      }

// Load AI insights
      const insights = await aiInsightsService.generateInsights(selectedLocation.Id);
      setInsights(insights);

    } catch (error) {
      console.error('Error loading weather data:', error);
      setError(error.message);
      setDataSource('error');
      
      if (error.message.includes('No cached data available')) {
        toast.error(`No offline data available for ${selectedLocation.name}`, {
          icon: "📵"
        });
      } else {
        toast.error(`Failed to load weather data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Toast will be shown in loadWeatherData based on data source
  };

  const getDataSourceIndicator = () => {
    const indicators = {
      offline: { icon: "WifiOff", text: "Offline", variant: "secondary", color: "text-slate-500" },
      cached: { icon: "Zap", text: "Cached", variant: "success", color: "text-success-600" },
      fallback: { icon: "AlertTriangle", text: "Network Issue", variant: "warning", color: "text-warning-600" },
      live: { icon: "Wifi", text: "Live", variant: "success", color: "text-success-600" },
      loading: { icon: "Loader2", text: "Loading", variant: "secondary", color: "text-slate-500" }
    };

    const indicator = indicators[dataSource] || indicators.loading;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <ApperIcon name={indicator.icon} className={`h-4 w-4 ${indicator.color}`} />
        <Badge variant={indicator.variant} size="sm">
          {indicator.text}
        </Badge>
        {weatherData?._cachedAt && (
          <span className="text-xs text-slate-500">
            Cached: {new Date(weatherData._cachedAt).toLocaleTimeString()}
          </span>
        )}
</div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !weatherData) {
    return <Error message={error} onRetry={loadWeatherData} />;
  }

  return (
    <div
    className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1
                    className="text-4xl font-black text-slate-900 mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">HyperCast
                                </h1>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg text-slate-600">AI-powered hyperlocal weather intelligence
                                    </p>
                </div>
{/* Location Selector */}
                <div className="max-w-2xl mx-auto">
                    <LocationSelector
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={selectedLocation} />
                </div>
                
                {/* Weather Widget Preview */}
                {weatherData && selectedLocation && (
                    <div className="mb-8">
                        <WeatherWidgetPreview 
                            weatherData={weatherData} 
                            location={selectedLocation}
                        />
                    </div>
                )}
                
                {/* Weather Alerts - Priority Display */}
                {alerts && alerts.length > 0 && <div className="mb-6">
                    <WeatherAlertsSection alerts={alerts} />
                </div>}
                {weatherData && selectedLocation ? <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main Column */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Current Weather */}
                        <CurrentWeatherCard weatherData={weatherData} location={selectedLocation} />
                        {/* Forecast */}
                        <ForecastSection weatherData={weatherData} />
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Insights */}
                        <AIInsightsCard insights={insights} weatherData={weatherData} />
                    </div>
                </div> : <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <div
                                className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">☀️</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to HyperCast
                                                  </h2>
                            <p className="text-slate-600">Select a location above to get started with AI-powered weather insights
                                                  </p>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    </div></div>
  );
};

export default Dashboard;