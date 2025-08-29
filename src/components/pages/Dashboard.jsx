import React, { useEffect, useState } from "react";
import { weatherService } from "@/services/api/weatherService";
import { aiInsightsService } from "@/services/api/aiInsightsService";
import { toast } from "react-toastify";
import LocationSelector from "@/components/molecules/LocationSelector";
import ForecastSection from "@/components/organisms/ForecastSection";
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

  useEffect(() => {
    if (selectedLocation) {
      loadWeatherData();
    }
  }, [selectedLocation]);

  const loadWeatherData = async () => {
    if (!selectedLocation) return;
    
    setLoading(true);
    setError("");
    
    try {
      const [weather, aiInsights, weatherAlerts] = await Promise.all([
        weatherService.getByLocationId(selectedLocation.Id),
        aiInsightsService.generateInsights(selectedLocation.Id),
        weatherService.getAlerts(selectedLocation.Id)
      ]);
      
      setWeatherData(weather);
      setInsights(aiInsights);
      setAlerts(weatherAlerts);
      
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      toast.error("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    toast.success(`Weather loaded for ${location.name}`);
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