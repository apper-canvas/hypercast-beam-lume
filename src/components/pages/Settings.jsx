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
    const currentNotification = preferences.notifications[key];
    if (typeof currentNotification === 'boolean') {
      updatePreference("notifications", key, !currentNotification);
    } else {
      updatePreference("notifications", key, {
        ...currentNotification,
        enabled: !currentNotification.enabled
      });
    }
  };

  const updateNotificationSetting = (key, setting, value) => {
    const currentNotification = preferences.notifications[key];
    updatePreference("notifications", key, {
      ...currentNotification,
      [setting]: value
    });
  };

  const [expandedNotifications, setExpandedNotifications] = useState({});

  const toggleExpanded = (key) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
                  { 
                    key: "rainAlerts", 
                    label: "Rain Start Alerts", 
                    desc: "Get notified when rain is about to start",
                    icon: "CloudRain",
                    hasSettings: true
                  },
                  { 
                    key: "temperatureAlerts", 
                    label: "Temperature Changes", 
                    desc: "Alerts for significant temperature drops/rises",
                    icon: "Thermometer",
                    hasSettings: true
                  },
                  { 
                    key: "severeWeather", 
                    label: "Severe Weather", 
                    desc: "Critical weather warnings and alerts",
                    icon: "Zap",
                    hasSettings: false
                  },
                  { 
                    key: "airQualityAlerts", 
                    label: "Air Quality Changes", 
                    desc: "AQI changes affecting health",
                    icon: "Wind",
                    hasSettings: true
                  },
                  { 
                    key: "uvAlerts", 
                    label: "UV Index Warnings", 
                    desc: "High UV exposure warnings",
                    icon: "Sun",
                    hasSettings: true
                  },
                  { 
                    key: "dailySummary", 
                    label: "Daily Summary", 
                    desc: "Morning weather summary and recommendations",
                    icon: "Calendar",
                    hasSettings: true
                  }
                ].map((notification) => {
                  const notificationData = preferences.notifications[notification.key];
                  const isEnabled = typeof notificationData === 'boolean' ? notificationData : notificationData?.enabled;
                  const isExpanded = expandedNotifications[notification.key];
                  
                  return (
                    <div key={notification.key} className="border border-slate-200 rounded-lg bg-white/50 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <ApperIcon name={notification.icon} className="h-5 w-5 text-slate-600" />
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{notification.label}</div>
                            <div className="text-sm text-slate-600">{notification.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleNotification(notification.key)}
                            icon={isEnabled ? "Check" : "X"}
                          >
                            {isEnabled ? "On" : "Off"}
                          </Button>
                          {notification.hasSettings && isEnabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(notification.key)}
                              icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                            >
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {notification.hasSettings && isEnabled && isExpanded && (
                        <div className="border-t border-slate-200 p-4 bg-slate-50/50">
                          {notification.key === "rainAlerts" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Alert Timing
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={notificationData?.minutesBefore || 15}
                                    onChange={(e) => updateNotificationSetting("rainAlerts", "minutesBefore", parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  />
                                  <span className="text-sm text-slate-600">minutes before rain starts</span>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Rain Probability Threshold
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="range"
                                    min="30"
                                    max="90"
                                    value={notificationData?.probabilityThreshold || 70}
                                    onChange={(e) => updateNotificationSetting("rainAlerts", "probabilityThreshold", parseInt(e.target.value))}
                                    className="flex-1"
                                  />
                                  <span className="text-sm text-slate-600 w-12">{notificationData?.probabilityThreshold || 70}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {notification.key === "temperatureAlerts" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Temperature Change Threshold
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="number"
                                    min="5"
                                    max="25"
                                    value={notificationData?.degreeChange || 10}
                                    onChange={(e) => updateNotificationSetting("temperatureAlerts", "degreeChange", parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  />
                                  <span className="text-sm text-slate-600">°F change to trigger alert</span>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Alert Types
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={notificationData?.alertOnDrop !== false}
                                      onChange={(e) => updateNotificationSetting("temperatureAlerts", "alertOnDrop", e.target.checked)}
                                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-700">Temperature drops</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={notificationData?.alertOnRise !== false}
                                      onChange={(e) => updateNotificationSetting("temperatureAlerts", "alertOnRise", e.target.checked)}
                                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-700">Temperature rises</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {notification.key === "airQualityAlerts" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  AQI Alert Threshold
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="range"
                                    min="50"
                                    max="200"
                                    step="10"
                                    value={notificationData?.aqiThreshold || 100}
                                    onChange={(e) => updateNotificationSetting("airQualityAlerts", "aqiThreshold", parseInt(e.target.value))}
                                    className="flex-1"
                                  />
                                  <span className="text-sm text-slate-600 w-16">AQI {notificationData?.aqiThreshold || 100}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  Alert when AQI exceeds this level
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {notification.key === "uvAlerts" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  UV Index Alert Level
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="range"
                                    min="3"
                                    max="11"
                                    value={notificationData?.uvThreshold || 6}
                                    onChange={(e) => updateNotificationSetting("uvAlerts", "uvThreshold", parseInt(e.target.value))}
                                    className="flex-1"
                                  />
                                  <span className="text-sm text-slate-600 w-12">UV {notificationData?.uvThreshold || 6}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  Alert when UV index reaches this level
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {notification.key === "dailySummary" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Summary Time
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="time"
                                    value={notificationData?.time || "07:00"}
                                    onChange={(e) => updateNotificationSetting("dailySummary", "time", e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  />
                                  <span className="text-sm text-slate-600">Daily summary delivery time</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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