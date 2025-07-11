import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import taskService from "@/services/api/taskService";
import TaskList from "@/components/organisms/TaskList";
import StatsOverview from "@/components/organisms/StatsOverview";
import TaskModal from "@/components/organisms/TaskModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { isToday, isPast } from "date-fns";

const TasksDashboard = () => {
  const { categories, activeCategory, searchQuery, onStatsUpdate } = useOutletContext();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, taskId: null });
  
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all"
  });
  const [sortBy, setSortBy] = useState("dueDate");

  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data.filter(task => !task.archived));
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const data = await taskService.getStats();
      setStats(data);
    } catch (err) {
      setStatsError("Failed to load statistics");
      console.error("Error loading stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      toast.success("Task created successfully!");
      await loadTasks();
      await loadStats();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.update(editingTask.Id, taskData);
      toast.success("Task updated successfully!");
      await loadTasks();
      await loadStats();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task.completed) {
        await taskService.markIncomplete(taskId);
        toast.info("Task marked as incomplete");
      } else {
        await taskService.markComplete(taskId);
        toast.success("Task completed! 🎉");
      }
      await loadTasks();
      await loadStats();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully");
      await loadTasks();
      await loadStats();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await taskService.archive(taskId);
      toast.success("Task archived successfully");
      await loadTasks();
      await loadStats();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to archive task");
      console.error("Error archiving task:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "clear") {
      setFilters({ status: "all", priority: "all", category: "all" });
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleDeleteClick = (taskId) => {
    setConfirmDialog({ open: true, taskId });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.taskId) {
      handleDeleteTask(confirmDialog.taskId);
    }
    setConfirmDialog({ open: false, taskId: null });
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

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(task => task.categoryId === activeCategory.toString());
    }

    // Apply status filter
    if (filters.status !== "all") {
      switch (filters.status) {
        case "completed":
          filtered = filtered.filter(task => task.completed);
          break;
        case "pending":
          filtered = filtered.filter(task => !task.completed);
          break;
        case "overdue":
          filtered = filtered.filter(task => 
            !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
          );
          break;
      }
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply category filter from filter bar
    if (filters.category !== "all") {
      filtered = filtered.filter(task => task.categoryId === filters.category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const getEmptyType = () => {
    if (searchQuery) return "search";
    if (activeCategory !== "all") return "category";
    if (filters.status === "completed") return "completed";
    return "tasks";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <StatsOverview
        stats={stats}
        loading={statsLoading}
        error={statsError}
        onRetry={loadStats}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button
          onClick={handleAddTask}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        categories={categories}
        loading={loading}
        error={error}
        onRetry={loadTasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteClick}
        onArchive={handleArchiveTask}
        emptyType={getEmptyType()}
        emptyAction={handleAddTask}
        emptyActionLabel="Create Your First Task"
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={editingTask}
        categories={categories}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, taskId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default TasksDashboard;