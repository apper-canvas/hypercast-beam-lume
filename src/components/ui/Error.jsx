import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="h-8 w-8 text-error-600" />
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Oops! Weather Data Unavailable
            </h2>
            <p className="text-slate-600">
              {message}
            </p>
          </div>

          {/* Weather Conditions that might cause errors */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              This might be due to:
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-center gap-2">
                <ApperIcon name="Wifi" className="h-3 w-3 text-slate-400" />
                Network connectivity issues
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="Server" className="h-3 w-3 text-slate-400" />
                Weather service temporarily unavailable
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="MapPin" className="h-3 w-3 text-slate-400" />
                Location data not accessible
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full"
                icon="RotateCcw"
              >
                Try Again
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full"
              icon="Home"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              If the problem persists, please check your internet connection or try again later.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Error;