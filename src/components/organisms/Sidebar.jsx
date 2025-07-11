import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CategoryItem from "@/components/molecules/CategoryItem";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Sidebar = ({ categories, activeCategory, onCategoryChange, onAddCategory }) => {
  const navigationItems = [
    { to: "/", label: "All Tasks", icon: "List", count: categories.reduce((sum, cat) => sum + cat.taskCount, 0) },
    { to: "/archived", label: "Archived", icon: "Archive", count: 0 }
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-64 bg-surface border-r border-gray-200 h-full overflow-y-auto custom-scrollbar"
    >
      <div className="p-6 space-y-6">
        {/* Navigation */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Navigation
          </h2>
          {navigationItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.count > 0 && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Categories
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCategory}
              className="p-1 h-6 w-6 text-gray-400 hover:text-primary"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <CategoryItem
              category={{ Id: "all", name: "All Categories", icon: "Grid3x3", color: "#6B7280" }}
              isActive={activeCategory === "all"}
              onClick={() => onCategoryChange("all")}
              taskCount={categories.reduce((sum, cat) => sum + cat.taskCount, 0)}
            />
            
            {categories.map(category => (
              <CategoryItem
                key={category.Id}
                category={category}
                isActive={activeCategory === category.Id}
                onClick={onCategoryChange}
                taskCount={category.taskCount}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-12 p-4 border border-primary/20">
          <h3 className="text-sm font-semibold text-primary mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-medium text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.taskCount, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categories</span>
              <span className="font-medium text-gray-900">{categories.length}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;