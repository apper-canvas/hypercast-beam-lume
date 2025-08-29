import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { locationService } from "@/services/api/locationService";

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchLocations();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const loadFavorites = async () => {
    const favoriteLocations = await locationService.getFavorites();
    setFavorites(favoriteLocations);
  };

  const searchLocations = async () => {
    setIsSearching(true);
    try {
      const results = await locationService.search(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = async (location) => {
    onLocationSelect(location);
    setSearchQuery("");
    setShowResults(false);
    
    if (!location.isFavorite) {
      await locationService.addToFavorites(location.Id);
      loadFavorites();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const location = await locationService.getByCoordinates(latitude, longitude);
          onLocationSelect(location);
        } catch (error) {
          console.error("Failed to get current location:", error);
        }
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder="Search cities, ZIP codes, or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          title="Use current location"
        >
          <ApperIcon name="MapPin" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-slate-500">
              <ApperIcon name="Loader2" className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((location) => (
                <button
                  key={location.Id}
                  className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center justify-between group"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div>
                    <div className="font-medium text-slate-900">{location.name}</div>
                    <div className="text-sm text-slate-500">{location.region}, {location.country}</div>
                  </div>
                  <ApperIcon 
                    name="MapPin" 
                    className="h-4 w-4 text-slate-400 group-hover:text-primary-600" 
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500">
              No locations found
            </div>
          )}
        </div>
      )}

      {/* Favorite Locations */}
      {favorites.length > 0 && !showResults && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Favorite Locations</h3>
          <div className="grid gap-2">
            {favorites.slice(0, 3).map((location) => (
              <button
                key={location.Id}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedLocation?.Id === location.Id
                    ? "border-primary-300 bg-primary-50"
                    : "border-slate-200 bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{location.name}</div>
                    <div className="text-sm text-slate-500">{location.timezone}</div>
                  </div>
                  <ApperIcon name="Star" className="h-4 w-4 text-accent-500 fill-current" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;