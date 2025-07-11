import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange,
  categories 
}) => {
  const statusOptions = [
    { value: "all", label: "All Tasks", icon: "List" },
    { value: "pending", label: "Pending", icon: "Clock" },
    { value: "completed", label: "Completed", icon: "CheckCircle" },
    { value: "overdue", label: "Overdue", icon: "AlertTriangle" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "created", label: "Created Date" },
    { value: "title", label: "Title" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-12 border border-gray-200"
    >
      {/* Status Filter */}
      <div className="flex gap-2">
        {statusOptions.map(option => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange("status", option.value)}
            className="flex items-center gap-2"
          >
            <ApperIcon name={option.icon} className="w-4 h-4" />
            {option.label}
          </Button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

      {/* Priority Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Priority:</label>
        <Select
          value={filters.priority}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="w-36"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Category:</label>
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="w-36"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.Id} value={category.Id.toString()}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm font-medium text-gray-700">Sort:</label>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-32"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Clear Filters */}
      {(filters.status !== "all" || filters.priority !== "all" || filters.category !== "all") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange("clear")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="X" className="w-4 h-4" />
          Clear
        </Button>
      )}
    </motion.div>
  );
};

export default FilterBar;