import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, categories, onToggleComplete, onEdit, onDelete, onArchive }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

const categoryId = task.category_id_c?.Id || task.category_id_c || task.categoryId;
  const category = categories.find(c => c.Id.toString() === categoryId?.toString());
const dueDate = task.due_date_c || task.dueDate;
  const completed = task.completed_c || task.completed;
  const isOverdue = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate)) && !completed;

  const handleToggleComplete = async () => {
if (completed) {
      await onToggleComplete(task.Id);
      return;
    }

    setIsCompleting(true);
    setTimeout(async () => {
      await onToggleComplete(task.Id);
      setIsCompleting(false);
    }, 300);
  };

  const priorityConfig = {
    high: { color: "error", icon: "AlertTriangle", label: "High" },
    medium: { color: "warning", icon: "Circle", label: "Medium" },
    low: { color: "success", icon: "Minus", label: "Low" }
  };

const priority = priorityConfig[task.priority_c || task.priority] || priorityConfig.medium;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isCompleting ? 0.5 : 1, 
          y: 0,
          scale: isCompleting ? 0.95 : 1
        }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => setShowActions(false)}
        className={cn(
          "bg-surface rounded-12 p-4 border transition-all duration-200 cursor-pointer group",
          task.completed 
            ? "border-success/30 bg-success/5" 
            : isOverdue 
              ? "border-error/30 bg-error/5" 
              : "border-gray-200 hover:border-primary/30 hover:shadow-md"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Checkbox
checked={completed}
              onChange={handleToggleComplete}
              className={cn(
                "transition-all duration-200",
                isCompleting && "animate-pulse"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-gray-900 text-sm leading-tight",
completed && "line-through text-gray-500"
              )}>
{task.title_c || task.title}
              </h3>
              
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-primary"
                    >
                      <ApperIcon name="Edit2" className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.Id)}
                      className="p-1 h-6 w-6 text-gray-400 hover:text-error"
                    >
                      <ApperIcon name="Trash2" className="w-3 h-3" />
                    </Button>
{completed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onArchive(task.Id)}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-warning"
                      >
                        <ApperIcon name="Archive" className="w-3 h-3" />
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

{(task.description_c || task.description) && (
              <p className={cn(
                "text-sm text-gray-600 mt-1 line-clamp-2",
                completed && "text-gray-400"
              )}>
{task.description_c || task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              {/* Priority Badge */}
              <div className="flex items-center gap-1">
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
isOverdue && !completed && "animate-pulse",
                    priority.color === "error" && "bg-error",
                    priority.color === "warning" && "bg-warning",
                    priority.color === "success" && "bg-success"
                  )}
                />
                <span className="text-xs text-gray-500">{priority.label}</span>
              </div>

              {/* Category Badge */}
              {category && (
                <Badge variant="gray" size="sm" className="flex items-center gap-1">
                  <ApperIcon name={category.icon} className="w-3 h-3" />
                  {category.name}
                </Badge>
              )}

              {/* Due Date */}
{dueDate && (
                <div className="flex items-center gap-1 ml-auto">
                  <ApperIcon 
                    name="Calendar" 
                    className={cn(
                      "w-3 h-3",
isOverdue && !completed ? "text-error" : "text-gray-400"
                    )} 
                  />
                  <span className={cn(
                    "text-xs",
isOverdue && !completed ? "text-error font-medium" : "text-gray-500"
                  )}>
{isToday(new Date(dueDate)) ? "Today" : format(new Date(dueDate), "MMM d")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskCard;