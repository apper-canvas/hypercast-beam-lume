import React from "react";
import Card from "@/components/atoms/Card";
import WeatherAlert from "@/components/molecules/WeatherAlert";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const WeatherAlertsSection = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-success-100 rounded-full">
            <ApperIcon name="Shield" className="h-6 w-6 text-success-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">All Clear</h3>
            <p className="text-sm text-slate-600">
              No weather alerts for your location
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => 
    new Date(alert.endTime) > new Date()
  );

  const severityOrder = ["extreme", "severe", "moderate", "minor"];
  const sortedAlerts = activeAlerts.sort((a, b) => 
    severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="AlertTriangle" className="h-5 w-5 text-accent-500" />
        <h2 className="text-xl font-bold text-slate-900">
          Weather Alerts ({activeAlerts.length})
        </h2>
      </div>
      
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {sortedAlerts.map((alert, index) => (
          <motion.div
            key={alert.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WeatherAlert alert={alert} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WeatherAlertsSection;