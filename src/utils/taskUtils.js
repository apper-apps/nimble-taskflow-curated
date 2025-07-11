import { isPast } from 'date-fns';

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "gray";
  }
};

export const getPriorityIcon = (priority) => {
  switch (priority) {
    case "high":
      return "AlertTriangle";
    case "medium":
      return "Circle";
    case "low":
      return "Minus";
    default:
      return "Circle";
  }
};

export const getStatusColor = (task) => {
  if (task.completed) return "success";
  if (task.dueDate && isPast(new Date(task.dueDate))) return "error";
  return "primary";
};

export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  // Filter by status
  if (filters.status && filters.status !== "all") {
    switch (filters.status) {
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      case "pending":
        filtered = filtered.filter(task => !task.completed);
        break;
      case "overdue":
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && isPast(new Date(task.dueDate))
        );
        break;
    }
  }

  // Filter by priority
  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  // Filter by category
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(task => task.categoryId === filters.category);
  }

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const sortTasks = (tasks, sortBy, ascending = true) => {
  return tasks.sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case "title":
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valueA = priorityOrder[a.priority] || 0;
        valueB = priorityOrder[b.priority] || 0;
        break;
      case "dueDate":
        valueA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
        valueB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
        break;
      case "created":
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
      case "category":
        valueA = a.categoryId || "";
        valueB = b.categoryId || "";
        break;
      default:
        return 0;
    }

    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;
    return 0;
  });
};

export const calculateTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(task => 
    !task.completed && task.dueDate && isPast(new Date(task.dueDate))
  ).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};