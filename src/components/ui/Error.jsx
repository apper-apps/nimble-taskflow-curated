import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry, type = "general" }) => {
  const getErrorConfig = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "AlertTriangle",
          title: "Unable to load tasks",
          description: "We're having trouble loading your tasks. Please try again.",
        };
      case "categories":
        return {
          icon: "FolderX",
          title: "Categories unavailable",
          description: "We couldn't load your task categories. Please try again.",
        };
      case "stats":
        return {
          icon: "BarChart3",
          title: "Statistics unavailable",
          description: "We couldn't load your task statistics. Please try again.",
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Something went wrong",
          description: "An unexpected error occurred. Please try again.",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={config.icon} className="w-8 h-8 text-error" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        {config.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-4 max-w-md"
      >
        {message || config.description}
      </motion.p>
      
      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;