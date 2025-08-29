import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ApperIcon name="Cloud" className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center animate-bounce">
            <ApperIcon name="Sun" className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Loading Weather Data</h2>
          <p className="text-slate-600">Getting the latest hyperlocal forecasts...</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s"
              }}
            />
          ))}
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded-md mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
                </div>
              </div>
              <div className="h-8 bg-slate-200 rounded-md mb-2"></div>
              <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Loading Tips */}
        <div className="max-w-md mx-auto mt-8">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Lightbulb" className="h-4 w-4 text-accent-500" />
              <span className="text-sm font-medium text-slate-900">Pro Tip</span>
            </div>
            <p className="text-sm text-slate-600">
              HyperCast uses AI to analyze multiple data sources for the most accurate local forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;