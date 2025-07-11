import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ title, value, icon, color = "primary", trend, description }) => {
  const colorClasses = {
    primary: "from-primary/20 to-secondary/20 text-primary",
    success: "from-success/20 to-success/10 text-success",
    warning: "from-warning/20 to-warning/10 text-warning",
    error: "from-error/20 to-error/10 text-error",
    info: "from-info/20 to-info/10 text-info",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-surface rounded-12 p-4 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="w-5 h-5" />
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            trend.direction === "up" ? "text-success" : "text-error"
          )}>
            <ApperIcon 
              name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
              className="w-3 h-3" 
            />
            {trend.percentage}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {title}
        </div>
        {description && (
          <div className="text-xs text-gray-500">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;