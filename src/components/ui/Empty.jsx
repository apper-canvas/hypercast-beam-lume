import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Weather Data", 
  message = "Select a location to view weather information", 
  actionLabel = "Get Started",
  onAction 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="space-y-6">
          {/* Weather Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <ApperIcon name="CloudSun" className="h-10 w-10 text-slate-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center animate-pulse">
                <ApperIcon name="Search" className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Empty State Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-slate-600">
              {message}
            </p>
          </div>

          {/* Quick Suggestions */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Try searching for:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="MapPin" className="h-3 w-3" />
                City names
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="Hash" className="h-3 w-3" />
                ZIP codes
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="Building" className="h-3 w-3" />
                Landmarks
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="Globe" className="h-3 w-3" />
                Coordinates
              </div>
            </div>
          </div>

          {/* Action Button */}
          {onAction && (
            <Button 
              onClick={onAction}
              className="w-full"
              icon="Search"
            >
              {actionLabel}
            </Button>
          )}

          {/* Features Preview */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3">
              Once you select a location, you'll get:
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <ApperIcon name="Brain" className="h-4 w-4 text-primary-400" />
                <span className="text-xs text-slate-500">AI Insights</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ApperIcon name="Radar" className="h-4 w-4 text-secondary-400" />
                <span className="text-xs text-slate-500">Live Radar</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ApperIcon name="AlertTriangle" className="h-4 w-4 text-accent-400" />
                <span className="text-xs text-slate-500">Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Empty;