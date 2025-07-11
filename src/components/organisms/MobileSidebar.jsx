import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import CategoryItem from "@/components/molecules/CategoryItem";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  categories, 
  activeCategory, 
  onCategoryChange, 
  onAddCategory 
}) => {
  const navigationItems = [
    { to: "/", label: "All Tasks", icon: "List", count: categories.reduce((sum, cat) => sum + cat.taskCount, 0) },
    { to: "/archived", label: "Archived", icon: "Archive", count: 0 }
  ];

  const handleCategoryChange = (categoryId) => {
    onCategoryChange(categoryId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-gray-200 z-50 lg:hidden overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-8 flex items-center justify-center">
                    <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Navigation
                </h2>
                {navigationItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
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
                    onClick={() => handleCategoryChange("all")}
                    taskCount={categories.reduce((sum, cat) => sum + cat.taskCount, 0)}
                  />
                  
                  {categories.map(category => (
                    <CategoryItem
                      key={category.Id}
                      category={category}
                      isActive={activeCategory === category.Id}
                      onClick={handleCategoryChange}
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
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;