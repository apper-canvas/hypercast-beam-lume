import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { weatherService } from "@/services/api/weatherService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TripPlannerModal from "@/components/organisms/TripPlannerModal";

const SystemStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cache info
    const loadCacheInfo = () => {
      try {
        const info = weatherService.getCacheInfo();
        setCacheInfo(info);
      } catch (error) {
        console.warn('Failed to load cache info:', error);
      }
    };

    loadCacheInfo();
    const interval = setInterval(loadCacheInfo, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (isOnline, hasCache = false) => {
    if (isOnline) return 'success-500';
    if (hasCache) return 'warning-500';
    return 'error-500';
  };

  const getStatusText = (isOnline, hasCache = false) => {
    if (isOnline) return 'Live';
    if (hasCache) return 'Cached';
    return 'Offline';
  };

  const networkStatusColor = getStatusColor(isOnline);
  const networkStatusText = getStatusText(isOnline);
  const cacheStatusColor = getStatusColor(isOnline, cacheInfo?.validEntries > 0);
  const cacheStatusText = isOnline ? 'Active' : (cacheInfo?.validEntries > 0 ? 'Available' : 'Empty');

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-slate-600">Network</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 bg-${networkStatusColor} rounded-full`}></div>
          <span className={`text-${networkStatusColor} font-medium`}>{networkStatusText}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-slate-600">Weather Data</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 bg-${cacheStatusColor} rounded-full`}></div>
          <span className={`text-${cacheStatusColor} font-medium`}>{cacheStatusText}</span>
        </div>
      </div>

      {cacheInfo && (
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Cached Locations</span>
          <div className="flex items-center gap-1">
            <ApperIcon name="Database" className="h-3 w-3 text-slate-500" />
            <span className="text-slate-600 font-medium">{cacheInfo.validEntries}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-slate-600">AI Insights</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 bg-${networkStatusColor} rounded-full`}></div>
          <span className={`text-${networkStatusColor} font-medium`}>{isOnline ? 'Active' : 'Limited'}</span>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: "Home",
      description: "Weather overview and insights"
    },
    {
      name: "Interactive Map",
      path: "/map",
      icon: "Map",
      description: "Radar and satellite view"
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "Settings",
      description: "Preferences and configuration"
    }
];

  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);

const openTripPlanner = () => setIsTripPlannerOpen(true);
  const closeTripPlanner = () => setIsTripPlannerOpen(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
    className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    {/* Mobile Header */}
    <div
        className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="CloudSun" className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900">HyperCast</h1>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden">
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
            </Button>
        </div>
    </div>
    {/* Mobile Navigation Overlay */}
    {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
        <div
            className="fixed inset-y-0 left-0 w-80 bg-white/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 translate-x-0">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <ApperIcon name="CloudSun" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">HyperCast</h1>
                        <p className="text-sm text-slate-600">Weather Intelligence</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    {navigation.map(item => <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={(
                            {
                                isActive
                            }
                        ) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                            isActive ? "bg-primary-500 text-white shadow-lg" : "text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                        )}>
                        <ApperIcon name={item.icon} className="h-5 w-5" />
                        <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                    </NavLink>)}
                </nav>
                {/* Trip Planner Button */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                        onClick={openTripPlanner}
                        className="w-full justify-start"
                        variant="ghost"
                        icon="MapPin">Plan Trip
                                        </Button>
                </div>
            </div>
        </div>
    </div>}
    <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen">
            <div
                className="fixed top-0 left-0 w-64 h-full bg-white/80 backdrop-blur-md border-r border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <ApperIcon name="CloudSun" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">HyperCast</h1>
                        <p className="text-sm text-slate-600">Weather Intelligence</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    {navigation.map(item => <NavLink
                        key={item.name}
                        to={item.path}
                        className={(
                            {
                                isActive
                            }
                        ) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                            isActive ? "bg-primary-500 text-white shadow-lg" : "text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                        )}>
                        <ApperIcon name={item.icon} className="h-5 w-5" />
                        <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                    </NavLink>)}
                </nav>
                {/* Trip Planner Button - Mobile */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                        onClick={openTripPlanner}
                        className="w-full justify-start"
                        variant="ghost"
                        icon="MapPin">Plan Trip
                                      </Button>
                </div>
                {/* Weather Status Widget */}
                <div className="mt-8 glass-card p-4 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <ApperIcon name="Activity" className="h-4 w-4 text-success-500" />System Status
                                      </h3>
                    <SystemStatus />
                </div>
            </div>
        </div>
    </div>
    {/* Main Content */}
    <div className="flex-1 lg:ml-0">
        <div className="min-h-screen">
            <Outlet />
        </div>
    </div>
    {/* Trip Planner Modal */}
    <TripPlannerModal isOpen={isTripPlannerOpen} onClose={closeTripPlanner} />
</div>
  );
};

export default Layout;