import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onSearch, onAddTask, stats }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-12 flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">Streamlined task management</p>
            </div>
          </div>
          
          {stats && (
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-600">
                  {stats.totalTasks} total tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-gray-600">
                  {stats.completedToday} completed today
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Zap" className="w-4 h-4 text-warning" />
                <span className="text-gray-600">
                  {stats.currentStreak} day streak
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-80 hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>
          
          <Button
            onClick={onAddTask}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="mt-4 md:hidden">
        <SearchBar onSearch={onSearch} />
      </div>
    </motion.header>
  );
};

export default Header;