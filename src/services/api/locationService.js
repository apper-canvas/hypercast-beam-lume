import locationsData from "@/services/mockData/locations.json";
import { offlineCache } from "@/services/offlineCache";

class LocationService {
  constructor() {
    this.locations = [...locationsData];
  }

  async getAll() {
    await this.delay();
    return [...this.locations];
  }

  async getById(id) {
    await this.delay();
    const location = this.locations.find(loc => loc.Id === parseInt(id));
    if (!location) {
      throw new Error(`Location with Id ${id} not found`);
    }
    return { ...location };
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.locations
      .filter(location => 
        location.name.toLowerCase().includes(searchTerm) ||
        location.region.toLowerCase().includes(searchTerm) ||
        location.country.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10)
      .map(location => ({ ...location }));
  }

  async getByCoordinates(lat, lng) {
    await this.delay();
    // For demo purposes, return the closest location or default location
    const defaultLocation = this.locations.find(loc => loc.Id === 1);
    return {
      ...defaultLocation,
      coordinates: { lat, lng }
    };
  }

  async getFavorites() {
    await this.delay();
    return this.locations
      .filter(location => location.isFavorite)
      .map(location => ({ ...location }));
  }

  async addToFavorites(id) {
    await this.delay();
    const location = this.locations.find(loc => loc.Id === parseInt(id));
    if (location) {
      location.isFavorite = true;
    }
    return location ? { ...location } : null;
  }

  async removeFromFavorites(id) {
    await this.delay();
    const location = this.locations.find(loc => loc.Id === parseInt(id));
    if (location) {
      location.isFavorite = false;
    }
    return location ? { ...location } : null;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const locationService = new LocationService();