import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ForecastCard from "@/components/molecules/ForecastCard";
import ApperIcon from "@/components/ApperIcon";

const ForecastSection = ({ weatherData }) => {
  const [activeTab, setActiveTab] = useState("hourly");

  if (!weatherData) return null;

  const tabs = [
    { id: "hourly", label: "48 Hours", icon: "Clock" },
    { id: "daily", label: "10 Days", icon: "Calendar" }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Weather Forecast</h2>
        
        <div className="flex bg-slate-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md ${
                activeTab === tab.id 
                  ? "shadow-sm" 
                  : "hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === "hourly" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Clock" className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Next 48 hours</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {weatherData.hourly.slice(0, 48).map((forecast, index) => (
              <ForecastCard
                key={index}
                forecast={forecast}
                type="hourly"
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "daily" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Calendar" className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">10-day forecast</span>
          </div>
          
          <div className="grid gap-3">
            {weatherData.daily.slice(0, 10).map((forecast, index) => (
              <ForecastCard
                key={index}
                forecast={forecast}
                type="daily"
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ForecastSection;