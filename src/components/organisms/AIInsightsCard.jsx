import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AIInsightsCard = ({ insights, weatherData }) => {
  if (!insights) return null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return "success";
    if (confidence >= 70) return "warning";
    return "secondary";
  };

  const getRecommendationIcon = (type) => {
    const iconMap = {
      clothing: "Shirt",
      commute: "Car",
      activity: "Activity",
      health: "Heart",
      outdoor: "TreePine",
      umbrella: "Umbrella"
    };
    return iconMap[type] || "Info";
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500 rounded-lg">
            <ApperIcon name="Brain" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Weather Insights</h2>
            <p className="text-sm text-slate-600">Personalized recommendations</p>
          </div>
        </div>
        
        <Badge variant={getConfidenceColor(insights.confidence)} size="sm">
          {insights.confidence}% confidence
        </Badge>
      </div>

      {/* AI Summary */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <ApperIcon name="MessageSquare" className="h-4 w-4 text-primary-500" />
          Today's Summary
        </h3>
        <p className="text-slate-700 leading-relaxed">
          {insights.summary}
        </p>
      </div>

      {/* Time-based Insights */}
      <div className="grid gap-4 mb-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <ApperIcon name="Sun" className="h-4 w-4 text-accent-500" />
            Today's Outlook
          </h4>
          <p className="text-sm text-slate-700">
            {insights.todayOutlook || "Mostly sunny with comfortable temperatures. Great day for outdoor activities."}
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <ApperIcon name="Clock" className="h-4 w-4 text-primary-500" />
            Next 48 Hours
          </h4>
          <p className="text-sm text-slate-700">
            {insights.next48Hours || "Weather conditions will remain stable with gradual temperature changes. No significant weather events expected."}
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <ApperIcon name="Calendar" className="h-4 w-4 text-secondary-500" />
            10-Day Trend
          </h4>
          <p className="text-sm text-slate-700">
            {insights.tenDayTrend || "Seasonal weather patterns with typical temperature fluctuations. Plan for varying conditions mid-week."}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ApperIcon name="Lightbulb" className="h-4 w-4 text-accent-500" />
            Smart Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3"
              >
                <div className="flex-shrink-0">
                  <ApperIcon 
                    name={getRecommendationIcon(rec.type)} 
                    className="h-5 w-5 text-slate-600"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">
                    {rec.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    {rec.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
        <Button variant="outline" size="sm" icon="RotateCcw">
          Refresh Insights
        </Button>
        <Button variant="ghost" size="sm" icon="Share2">
          Share
        </Button>
      </div>
    </Card>
  );
};

export default AIInsightsCard;