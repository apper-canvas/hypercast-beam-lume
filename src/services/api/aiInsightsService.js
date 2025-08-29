import insightsData from "@/services/mockData/aiInsights.json";

class AIInsightsService {
  constructor() {
    this.insights = [...insightsData];
  }

  async generateInsights(locationId) {
    await this.delay();
    const existingInsight = this.insights.find(insight => insight.locationId === locationId.toString());
    
    if (existingInsight) {
      return { ...existingInsight };
    }
    
    // Generate default insights for locations without specific data
    return this.generateDefaultInsights(locationId);
  }

  generateDefaultInsights(locationId) {
    const summaries = [
      "Beautiful weather conditions make this an excellent day for any outdoor plans you might have. Comfortable temperatures and pleasant conditions create the perfect atmosphere for activities.",
      "Today brings ideal weather with comfortable temperatures and clear conditions. Perfect opportunity to get outside and enjoy the pleasant atmosphere.",
      "Excellent weather conditions today with mild temperatures and favorable conditions for outdoor activities. Great day to make the most of being outside.",
      "Pleasant weather ahead with comfortable conditions throughout the day. Ideal for outdoor activities and enjoying time outside.",
      "Wonderful weather conditions with mild temperatures and clear skies. Perfect day to get outside and enjoy the pleasant conditions."
    ];

    const recommendations = [
      [
        { type: "clothing", title: "Comfortable Layers", description: "Light layers work best for today" },
        { type: "commute", title: "Pleasant Commute", description: "Great weather for walking or biking" },
        { type: "activity", title: "Outdoor Time", description: "Perfect day for outdoor activities" },
        { type: "health", title: "Stay Hydrated", description: "Keep water handy during activities" }
      ],
      [
        { type: "clothing", title: "Seasonal Wear", description: "Dress appropriately for the season" },
        { type: "activity", title: "Get Outside", description: "Take advantage of pleasant conditions" },
        { type: "commute", title: "Enjoy the Weather", description: "Great day for outdoor commuting" },
        { type: "outdoor", title: "Fresh Air", description: "Perfect time for outdoor activities" }
      ]
    ];

    const randomIndex = Math.floor(Math.random() * summaries.length);
    const recIndex = Math.floor(Math.random() * recommendations.length);

    return {
      Id: Math.max(...this.insights.map(i => i.Id)) + 1,
      locationId: locationId.toString(),
      summary: summaries[randomIndex],
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
      todayOutlook: "Pleasant conditions throughout the day with comfortable temperatures. Great opportunity for outdoor activities and enjoying the nice weather.",
      next48Hours: "Weather conditions remain favorable over the next two days. Consistent pleasant conditions make this a great time for planning outdoor activities.",
      tenDayTrend: "Extended period of pleasant weather conditions expected. Typical seasonal patterns with comfortable temperatures and favorable conditions for outdoor activities.",
      recommendations: recommendations[recIndex],
      generatedAt: new Date().toISOString()
    };
  }

  async refreshInsights(locationId) {
    await this.delay();
    // Simulate generating fresh insights
    return this.generateDefaultInsights(locationId);
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }
}

export const aiInsightsService = new AIInsightsService();