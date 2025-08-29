import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { userPreferencesService } from "@/services/api/userPreferencesService";
import { toast } from "react-toastify";

const Settings = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const prefs = await userPreferencesService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await userPreferencesService.updatePreferences(preferences);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const toggleNotification = (key) => {
    updatePreference("notifications", key, !preferences.notifications[key]);
  };

  if (loading || !preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Settings & Preferences
            </h1>
            <p className="text-slate-600">
              Customize your HyperCast experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Units & Display */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Gauge" className="h-5 w-5 text-primary-500" />
                Units & Display
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Temperature Unit
                  </label>
                  <div className="flex gap-2">
                    {["fahrenheit", "celsius"].map((unit) => (
                      <Button
                        key={unit}
                        variant={preferences.units === unit ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreference("units", "temperature", unit)}
                      >
                        {unit === "fahrenheit" ? "°F" : "°C"}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Wind Speed
                  </label>
                  <div className="flex gap-2">
                    {["mph", "kph", "ms"].map((unit) => (
                      <Button
                        key={unit}
                        variant={preferences.units === unit ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreference("units", "windSpeed", unit)}
                      >
                        {unit.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pressure Unit
                  </label>
                  <div className="flex gap-2">
                    {["mb", "inHg", "hPa"].map((unit) => (
                      <Button
                        key={unit}
                        variant={preferences.units === unit ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreference("units", "pressure", unit)}
                      >
                        {unit}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Bell" className="h-5 w-5 text-accent-500" />
                Smart Notifications
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: "rainAlerts", label: "Rain Start Alerts", desc: "Get notified when rain is about to start" },
                  { key: "temperatureAlerts", label: "Temperature Changes", desc: "Alerts for significant temperature drops/rises" },
                  { key: "severeWeather", label: "Severe Weather", desc: "Critical weather warnings and alerts" },
                  { key: "airQualityAlerts", label: "Air Quality Changes", desc: "AQI changes affecting health" },
                  { key: "uvAlerts", label: "UV Index Warnings", desc: "High UV exposure warnings" },
                  { key: "dailySummary", label: "Daily Summary", desc: "Morning weather summary and recommendations" }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{notification.label}</div>
                      <div className="text-sm text-slate-600">{notification.desc}</div>
                    </div>
                    <Button
                      variant={preferences.notifications[notification.key] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleNotification(notification.key)}
                      icon={preferences.notifications[notification.key] ? "Check" : "X"}
                      className="ml-3"
                    >
                      {preferences.notifications[notification.key] ? "On" : "Off"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Accessibility */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Accessibility" className="h-5 w-5 text-success-500" />
                Accessibility
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-900">Reduced Motion</div>
                    <div className="text-sm text-slate-600">Minimize animations and transitions</div>
                  </div>
                  <Button
                    variant={preferences.accessibility.reducedMotion ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("accessibility", "reducedMotion", !preferences.accessibility.reducedMotion)}
                  >
                    {preferences.accessibility.reducedMotion ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-900">High Contrast</div>
                    <div className="text-sm text-slate-600">Increase contrast for better visibility</div>
                  </div>
                  <Button
                    variant={preferences.accessibility.highContrast ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("accessibility", "highContrast", !preferences.accessibility.highContrast)}
                  >
                    {preferences.accessibility.highContrast ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-900">Large Text</div>
                    <div className="text-sm text-slate-600">Increase text size throughout the app</div>
                  </div>
                  <Button
                    variant={preferences.accessibility.largeText ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("accessibility", "largeText", !preferences.accessibility.largeText)}
                  >
                    {preferences.accessibility.largeText ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data & Performance */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Wifi" className="h-5 w-5 text-secondary-500" />
                Data & Performance
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-900">Low Data Mode</div>
                    <div className="text-sm text-slate-600">Reduce data usage and improve performance</div>
                  </div>
                  <Button
                    variant={preferences.lowDataMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference("lowDataMode", null, !preferences.lowDataMode)}
                  >
                    {preferences.lowDataMode ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Background Refresh Interval
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 5, label: "5 min" },
                      { value: 15, label: "15 min" },
                      { value: 30, label: "30 min" },
                      { value: 60, label: "1 hour" }
                    ].map((interval) => (
                      <Button
                        key={interval.value}
                        variant={preferences.refreshInterval === interval.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreference("refreshInterval", null, interval.value)}
                      >
                        {interval.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              onClick={savePreferences}
              loading={saving}
              icon="Save"
              className="px-8"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;