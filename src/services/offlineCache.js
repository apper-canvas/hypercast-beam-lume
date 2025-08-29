class OfflineCache {
  constructor() {
    this.storageKey = 'hypercast_offline_cache';
    this.networkKey = 'hypercast_network_status';
    this.maxCacheSize = 50; // Maximum number of cached items
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Initialize network status tracking
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.setNetworkStatus(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.setNetworkStatus(false);
    });
  }

  getNetworkStatus() {
    try {
      const status = localStorage.getItem(this.networkKey);
      return status ? JSON.parse(status) : { isOnline: this.isOnline, lastOnline: new Date().toISOString() };
    } catch (error) {
      return { isOnline: this.isOnline, lastOnline: new Date().toISOString() };
    }
  }

  setNetworkStatus(isOnline) {
    try {
      const status = {
        isOnline,
        lastOnline: isOnline ? new Date().toISOString() : this.getNetworkStatus().lastOnline
      };
      localStorage.setItem(this.networkKey, JSON.stringify(status));
    } catch (error) {
      console.warn('Failed to update network status:', error);
    }
  }

  getCache() {
    try {
      const cache = localStorage.getItem(this.storageKey);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.warn('Failed to load cache:', error);
      return {};
    }
  }

  setCache(cache) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache:', error);
      // If storage is full, try to clear old entries
      this.cleanupCache();
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(cache));
      } catch (retryError) {
        console.error('Failed to save cache after cleanup:', retryError);
      }
    }
  }

  generateCacheKey(type, identifier) {
    return `${type}_${identifier}`;
  }

  set(type, identifier, data, ttl = null) {
    const cache = this.getCache();
    const key = this.generateCacheKey(type, identifier);
    const expiresAt = new Date(Date.now() + (ttl || this.defaultTTL)).toISOString();

    cache[key] = {
      data,
      cachedAt: new Date().toISOString(),
      expiresAt,
      type,
      identifier
    };

    // Cleanup old entries if cache is getting too large
    const cacheKeys = Object.keys(cache);
    if (cacheKeys.length > this.maxCacheSize) {
      this.cleanupCache(cache);
    }

    this.setCache(cache);
  }

  get(type, identifier) {
    const cache = this.getCache();
    const key = this.generateCacheKey(type, identifier);
    const entry = cache[key];

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (new Date() > new Date(entry.expiresAt)) {
      this.remove(type, identifier);
      return null;
    }

    return {
      ...entry.data,
      _cached: true,
      _cachedAt: entry.cachedAt,
      _expiresAt: entry.expiresAt
    };
  }

  remove(type, identifier) {
    const cache = this.getCache();
    const key = this.generateCacheKey(type, identifier);
    delete cache[key];
    this.setCache(cache);
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  cleanupCache(existingCache = null) {
    const cache = existingCache || this.getCache();
    const now = new Date();
    let removed = 0;

    // Remove expired entries
    Object.keys(cache).forEach(key => {
      if (new Date(cache[key].expiresAt) < now) {
        delete cache[key];
        removed++;
      }
    });

    // If still too large, remove oldest entries
    const entries = Object.entries(cache).sort((a, b) => 
      new Date(a[1].cachedAt) - new Date(b[1].cachedAt)
    );

    while (entries.length > this.maxCacheSize * 0.8) { // Keep cache at 80% capacity
      const [key] = entries.shift();
      delete cache[key];
      removed++;
    }

    if (removed > 0) {
      this.setCache(cache);
    }

    return removed;
  }

  getCacheInfo() {
    const cache = this.getCache();
    const entries = Object.values(cache);
    const now = new Date();

    return {
      totalEntries: entries.length,
      validEntries: entries.filter(entry => new Date(entry.expiresAt) > now).length,
      expiredEntries: entries.filter(entry => new Date(entry.expiresAt) <= now).length,
      storageUsed: this.getStorageSize(),
      isOnline: this.isOnline,
      networkStatus: this.getNetworkStatus()
    };
  }

  getStorageSize() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      return 0;
    }
  }

  getLocationCache() {
    const cache = this.getCache();
    return Object.values(cache)
      .filter(entry => entry.type === 'weather')
      .map(entry => ({
        identifier: entry.identifier,
        cachedAt: entry.cachedAt,
        expiresAt: entry.expiresAt,
        locationName: entry.data.location?.name || `Location ${entry.identifier}`
      }))
      .sort((a, b) => new Date(b.cachedAt) - new Date(a.cachedAt));
  }

  // Preload commonly accessed locations
  async preloadLocations(locationIds, weatherService) {
    if (!this.isOnline) return;

    const promises = locationIds.map(async (locationId) => {
      try {
        // Only fetch if not cached or cache is stale
        const cached = this.get('weather', locationId);
        if (cached) return;

        const weatherData = await weatherService.getByLocationId(locationId);
        this.set('weather', locationId, weatherData);
      } catch (error) {
        console.warn(`Failed to preload location ${locationId}:`, error);
      }
    });

    await Promise.all(promises);
  }
}

export const offlineCache = new OfflineCache();