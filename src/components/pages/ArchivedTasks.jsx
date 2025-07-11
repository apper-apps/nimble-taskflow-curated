import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import taskService from "@/services/api/taskService";
import TaskList from "@/components/organisms/TaskList";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ArchivedTasks = () => {
  const { categories, onStatsUpdate } = useOutletContext();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, taskId: null, action: null });

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const loadArchivedTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data.filter(task => task.archived));
    } catch (err) {
      setError("Failed to load archived tasks");
      console.error("Error loading archived tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      await taskService.restore(taskId);
      toast.success("Task restored successfully!");
      await loadArchivedTasks();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to restore task");
      console.error("Error restoring task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      toast.success("Task permanently deleted");
      await loadArchivedTasks();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleRestoreClick = (taskId) => {
    setConfirmDialog({ open: true, taskId, action: "restore" });
  };

  const handleDeleteClick = (taskId) => {
    setConfirmDialog({ open: true, taskId, action: "delete" });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.taskId) {
      if (confirmDialog.action === "restore") {
        handleRestoreTask(confirmDialog.taskId);
      } else if (confirmDialog.action === "delete") {
        handleDeleteTask(confirmDialog.taskId);
      }
    }
    setConfirmDialog({ open: false, taskId: null, action: null });
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by archived date (most recent first)
    filtered.sort((a, b) => {
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt) - new Date(a.completedAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Custom TaskCard component for archived tasks
  const ArchivedTaskCard = ({ task, categories }) => {
    const category = categories.find(c => c.Id.toString() === task.categoryId);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="bg-surface rounded-12 p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-700 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-500 mb-2">{task.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {category && (
                <span className="flex items-center gap-1">
                  <ApperIcon name={category.icon} className="w-3 h-3" />
                  {category.name}
                </span>
              )}
              <span>•</span>
              <span>Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "Unknown"}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRestoreClick(task.Id)}
              className="p-1 h-8 w-8 text-success hover:text-success/80"
              title="Restore task"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(task.Id)}
              className="p-1 h-8 w-8 text-error hover:text-error/80"
              title="Delete permanently"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archived Tasks</h1>
          <p className="text-gray-600">
            {filteredTasks.length} archived {filteredTasks.length === 1 ? "task" : "tasks"}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search archived tasks..."
        />
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8">
          <ApperIcon name="Loader2" className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading archived tasks...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 mx-auto mb-4 text-error" />
          <p className="text-error mb-4">{error}</p>
          <Button onClick={loadArchivedTasks} variant="outline">
            Try Again
          </Button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-4 mx-auto">
            <ApperIcon name="Archive" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? "No matching archived tasks" : "No archived tasks"}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? "Try adjusting your search terms" 
              : "Archive completed tasks to keep your workspace organized"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <ArchivedTaskCard
              key={task.Id}
              task={task}
              categories={categories}
            />
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, taskId: null, action: null })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "restore" ? "Restore Task" : "Delete Task Permanently"}
        message={
          confirmDialog.action === "restore"
            ? "Are you sure you want to restore this task? It will be moved back to your active tasks."
            : "Are you sure you want to permanently delete this task? This action cannot be undone."
        }
        confirmLabel={confirmDialog.action === "restore" ? "Restore" : "Delete Permanently"}
        cancelLabel="Cancel"
        variant={confirmDialog.action === "restore" ? "info" : "danger"}
      />
    </div>
  );
};

export default ArchivedTasks;