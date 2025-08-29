import preferencesData from "@/services/mockData/userPreferences.json";

class UserPreferencesService {
  constructor() {
    this.preferences = { ...preferencesData[0] };
  }

  async getPreferences() {
    await this.delay();
    return { ...this.preferences };
  }

async updatePreferences(newPreferences) {
    await this.delay();
    this.preferences = { ...this.preferences, ...newPreferences };
    return { ...this.preferences };
  }

  async updateNotificationPreference(key, settings) {
    await this.delay();
    this.preferences.notifications = {
      ...this.preferences.notifications,
      [key]: settings
    };
    return { ...this.preferences };
  }

  async updateUnits(units) {
    await this.delay();
    this.preferences.units = units;
    return { ...this.preferences };
  }

async updateNotifications(notifications) {
    await this.delay();
    this.preferences.notifications = { ...this.preferences.notifications, ...notifications };
    return { ...this.preferences };
  }

  async updateNotificationSettings(key, settings) {
    await this.delay();
    this.preferences.notifications[key] = {
      ...this.preferences.notifications[key],
      ...settings
    };
    return { ...this.preferences };
  }

  async updateAccessibility(accessibility) {
    await this.delay();
    this.preferences.accessibility = { ...this.preferences.accessibility, ...accessibility };
    return { ...this.preferences };
  }

  async toggleLowDataMode() {
    await this.delay();
    this.preferences.lowDataMode = !this.preferences.lowDataMode;
    return { ...this.preferences };
  }

  async setRefreshInterval(interval) {
    await this.delay();
    this.preferences.refreshInterval = interval;
    return { ...this.preferences };
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const userPreferencesService = new UserPreferencesService();