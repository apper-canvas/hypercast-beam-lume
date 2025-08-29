import weatherData from "@/services/mockData/weatherData.json";
import alertsData from "@/services/mockData/weatherAlerts.json";
import { offlineCache } from "@/services/offlineCache";

class WeatherService {
  constructor() {
    this.weatherData = [...weatherData];
    this.alerts = [...alertsData];
    this.cache = offlineCache;
  }

  async getByLocationIdWithCache(locationId, options = {}) {
    const { forceRefresh = false, useCache = true } = options;
    
    // Check network status
    const networkStatus = this.cache.getNetworkStatus();
    const isOnline = this.cache.isOnline;

    // If offline, return cached data
    if (!isOnline && useCache) {
      const cached = this.cache.get('weather', locationId);
      if (cached) {
        return {
          ...cached,
          _offline: true,
          _networkStatus: networkStatus
        };
      }
      throw new Error('No cached data available for offline access');
    }

    // If online but not forcing refresh, try cache first
    if (isOnline && useCache && !forceRefresh) {
      const cached = this.cache.get('weather', locationId);
      if (cached) {
        // Return cached data but trigger background refresh
        this.refreshInBackground(locationId);
        return {
          ...cached,
          _fromCache: true,
          _networkStatus: networkStatus
        };
      }
    }

    // Fetch fresh data
    try {
      const freshData = await this.getByLocationId(locationId);
      
      // Cache the fresh data
      if (useCache) {
        this.cache.set('weather', locationId, freshData);
      }
      
      return {
        ...freshData,
        _fresh: true,
        _networkStatus: networkStatus
      };
    } catch (error) {
      // If fetch fails and we have cached data, use it
      if (useCache) {
        const cached = this.cache.get('weather', locationId);
        if (cached) {
          return {
            ...cached,
            _fallbackToCache: true,
            _error: error.message,
            _networkStatus: networkStatus
          };
        }
      }
      throw error;
    }
  }

  async refreshInBackground(locationId) {
    try {
      const freshData = await this.getByLocationId(locationId);
      this.cache.set('weather', locationId, freshData);
    } catch (error) {
      console.warn(`Background refresh failed for location ${locationId}:`, error);
    }
}
async getByLocationId(locationId) {
    await this.delay();
    const weather = this.weatherData.find(data => data.locationId === locationId.toString());
    if (!weather) {
      // Return default weather data if specific location not found
      const defaultWeather = this.generateDefaultWeather(locationId);
      return { ...defaultWeather };
    }
    return { ...weather };
  }

  // Main method that should be used by components
  async getWeatherData(locationId, options = {}) {
    return this.getByLocationIdWithCache(locationId, options);
  }

  getCachedLocations() {
    return this.cache.getLocationCache();
  }

  getCacheInfo() {
    return this.cache.getCacheInfo();
  }

  clearCache() {
    this.cache.clear();
  }

  isOffline() {
    return !this.cache.isOnline;
  }

  async getAlerts(locationId) {
    await this.delay();
    const locationAlerts = this.alerts.filter(alert => alert.locationId === locationId.toString());
    return locationAlerts.map(alert => ({ ...alert }));
  }

  async getHourlyForecast(locationId, hours = 48) {
    await this.delay();
    const weather = await this.getByLocationId(locationId);
    return weather.hourly.slice(0, hours);
  }

  async getDailyForecast(locationId, days = 10) {
    await this.delay();
    const weather = await this.getByLocationId(locationId);
    
    // Generate additional days if needed
    const forecast = [...weather.daily];
    while (forecast.length < days) {
      const lastDay = forecast[forecast.length - 1];
      const nextDate = new Date(lastDay.date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      forecast.push({
        date: nextDate.toISOString().split('T')[0],
        high: lastDay.high + (Math.random() - 0.5) * 10,
        low: lastDay.low + (Math.random() - 0.5) * 8,
        condition: this.getRandomCondition(),
        summary: this.getRandomSummary(),
        precipitationChance: Math.floor(Math.random() * 60),
        windSpeed: Math.floor(Math.random() * 15) + 5
      });
    }
    
    return forecast.slice(0, days);
  }

  generateDefaultWeather(locationId) {
    const conditions = ["sunny", "partly-cloudy", "cloudy", "rainy"];
    const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = 65 + Math.random() * 25;
    
    return {
      Id: Math.max(...this.weatherData.map(w => w.Id)) + 1,
      locationId: locationId.toString(),
      current: {
        temperature: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 8),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 3,
        windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
        visibility: Math.floor(Math.random() * 10) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        condition: currentCondition,
        description: this.getConditionDescription(currentCondition),
        precipitationChance: Math.floor(Math.random() * 60),
        uvIndex: Math.floor(Math.random() * 10) + 1,
        highToday: Math.round(baseTemp + 5),
        lowToday: Math.round(baseTemp - 10),
        sunrise: "2024-03-20T06:30:00Z",
        sunset: "2024-03-20T18:30:00Z",
airQuality: {
          aqi: Math.floor(Math.random() * 100) + 20,
          pm25: Math.floor(Math.random() * 30) + 5,
          ozone: Math.floor(Math.random() * 80) + 40
        },
        pollen: {
          overall: ["Low", "Moderate", "High", "Very High"][Math.floor(Math.random() * 4)],
          tree: Math.floor(Math.random() * 5) + 1,
          grass: Math.floor(Math.random() * 5) + 1,
          weed: Math.floor(Math.random() * 5) + 1
        },
        healthRecommendations: this.generateHealthRecommendations(
          Math.floor(Math.random() * 100) + 20,
          ["Low", "Moderate", "High", "Very High"][Math.floor(Math.random() * 4)]
        )
      },
      hourly: this.generateHourlyForecast(baseTemp, currentCondition),
      daily: this.generateDailyForecast(baseTemp),
      alerts: [],
      lastUpdated: new Date().toISOString()
    };
  }

  generateHourlyForecast(baseTemp, condition) {
    const forecast = [];
    for (let i = 0; i < 48; i++) {
      const date = new Date();
      date.setHours(date.getHours() + i);
      
      forecast.push({
        time: date.toISOString(),
        temperature: Math.round(baseTemp + (Math.random() - 0.5) * 10),
        condition: i % 6 === 0 ? this.getRandomCondition() : condition,
        precipitationChance: Math.floor(Math.random() * 50),
        windSpeed: Math.floor(Math.random() * 12) + 4
      });
    }
    return forecast;
  }

  generateDailyForecast(baseTemp) {
    const forecast = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        high: Math.round(baseTemp + (Math.random() - 0.3) * 15),
        low: Math.round(baseTemp - 15 + (Math.random() - 0.3) * 10),
        condition: this.getRandomCondition(),
        summary: this.getRandomSummary(),
        precipitationChance: Math.floor(Math.random() * 70),
        windSpeed: Math.floor(Math.random() * 15) + 5
      });
    }
    return forecast;
  }

  getRandomCondition() {
    const conditions = ["sunny", "partly-cloudy", "cloudy", "rainy", "stormy"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  getConditionDescription(condition) {
    const descriptions = {
      sunny: "Sunny",
      "partly-cloudy": "Partly Cloudy",
      cloudy: "Cloudy",
      rainy: "Light Rain",
      stormy: "Thunderstorms"
    };
    return descriptions[condition] || "Partly Cloudy";
  }

  getRandomSummary() {
    const summaries = [
      "Pleasant weather expected",
      "Ideal conditions for outdoor activities",
      "Typical seasonal weather",
      "Comfortable temperatures throughout the day",
      "Great day to be outside"
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }
generateHealthRecommendations(aqi, pollenLevel) {
    const recommendations = [];
    
    // AQI-based recommendations
    if (aqi <= 50) {
      recommendations.push("Excellent day for outdoor activities");
    } else if (aqi <= 100) {
      recommendations.push("Good day for most outdoor activities");
      recommendations.push("Sensitive individuals should watch for symptoms");
    } else if (aqi <= 150) {
      recommendations.push("Limit prolonged outdoor exertion");
      recommendations.push("Sensitive groups should avoid outdoor activities");
    } else if (aqi <= 200) {
      recommendations.push("Avoid prolonged outdoor activities");
      recommendations.push("Consider wearing a mask outdoors");
    } else {
      recommendations.push("Avoid all outdoor activities");
      recommendations.push("Stay indoors with air purifier if available");
    }

    // Pollen-based recommendations
    if (pollenLevel === "High" || pollenLevel === "Very High") {
      recommendations.push("Keep windows closed during high pollen times");
      recommendations.push("Consider taking allergy medication");
      if (pollenLevel === "Very High") {
        recommendations.push("Shower and change clothes after being outdoors");
      }
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const weatherService = new WeatherService();