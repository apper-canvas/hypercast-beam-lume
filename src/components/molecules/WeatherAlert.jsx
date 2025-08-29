import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const WeatherAlert = ({ alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityConfig = (severity) => {
    const configs = {
      minor: {
        variant: "warning",
        icon: "AlertTriangle",
        bgClass: "bg-warning-50 border-warning-200"
      },
      moderate: {
        variant: "warning",
        icon: "AlertCircle",
        bgClass: "bg-warning-50 border-warning-200"
      },
      severe: {
        variant: "error",
        icon: "AlertOctagon",
        bgClass: "bg-error-50 border-error-200"
      },
      extreme: {
        variant: "error",
        icon: "Zap",
        bgClass: "bg-error-50 border-error-200"
      }
    };
    return configs[severity] || configs.minor;
  };

  const config = getSeverityConfig(alert.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-l-4 p-4 ${config.bgClass} transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <ApperIcon 
            name={config.icon} 
            className={`h-5 w-5 ${
              config.variant === "error" ? "text-error-600" : "text-warning-600"
            }`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">
              {alert.title}
            </h3>
            <Badge variant={config.variant} size="sm">
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-sm text-slate-700 mb-2">
            {alert.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" className="h-3 w-3" />
              <span>
                {format(new Date(alert.startTime), "MMM d, h:mm a")} - 
                {format(new Date(alert.endTime), "MMM d, h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="MapPin" className="h-3 w-3" />
              <span>{alert.area}</span>
            </div>
          </div>
          
          {alert.instructions && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                className="text-xs p-2"
              >
                {isExpanded ? "Hide Details" : "View Instructions"}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-200"
          >
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-1">
                <ApperIcon name="Info" className="h-4 w-4" />
                Safety Instructions
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line">
                {alert.instructions}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherAlert;