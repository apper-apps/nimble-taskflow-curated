import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CategoryItem = ({ category, isActive, onClick, taskCount }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category.Id)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
          : "hover:bg-gray-50 border border-transparent"
      )}
    >
      <div 
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{ backgroundColor: category.color + "20" }}
      >
        <ApperIcon 
          name={category.icon} 
          className="w-3 h-3" 
          style={{ color: category.color }}
        />
      </div>
      
      <span className={cn(
        "flex-1 font-medium text-sm",
        isActive ? "text-primary" : "text-gray-700"
      )}>
        {category.name}
      </span>
      
      {taskCount > 0 && (
        <Badge 
          variant={isActive ? "primary" : "gray"} 
          size="sm"
          className="text-xs"
        >
          {taskCount}
        </Badge>
      )}
    </motion.div>
  );
};

export default CategoryItem;