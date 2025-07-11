import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ type = "tasks", onAction, actionLabel }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks yet",
          description: "Get started by creating your first task to stay organized and productive.",
          gradient: "from-primary/20 to-secondary/20",
          iconColor: "text-primary",
        };
      case "completed":
        return {
          icon: "Trophy",
          title: "No completed tasks",
          description: "Complete some tasks to see your achievements and track your progress.",
          gradient: "from-success/20 to-success/10",
          iconColor: "text-success",
        };
      case "archived":
        return {
          icon: "Archive",
          title: "No archived tasks",
          description: "Archive completed tasks to keep your workspace clean and organized.",
          gradient: "from-gray-300/20 to-gray-200/20",
          iconColor: "text-gray-500",
        };
      case "search":
        return {
          icon: "Search",
          title: "No matching tasks",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          gradient: "from-info/20 to-info/10",
          iconColor: "text-info",
        };
      case "category":
        return {
          icon: "FolderOpen",
          title: "No tasks in this category",
          description: "Create a new task or move existing tasks to this category.",
          gradient: "from-accent/20 to-accent/10",
          iconColor: "text-accent",
        };
      default:
        return {
          icon: "Inbox",
          title: "Nothing here",
          description: "This area is empty. Add some content to get started.",
          gradient: "from-gray-300/20 to-gray-200/20",
          iconColor: "text-gray-500",
        };
    }
  };

  const config = getEmptyConfig();

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
        className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center mb-6`}
      >
        <ApperIcon name={config.icon} className={`w-10 h-10 ${config.iconColor}`} />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        {config.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6 max-w-md"
      >
        {config.description}
      </motion.p>
      
      {onAction && actionLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;