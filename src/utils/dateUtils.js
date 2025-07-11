import { format, isToday, isPast, isFuture, startOfDay, endOfDay } from "date-fns";

export const formatDate = (date, formatString = "MMM d, yyyy") => {
  if (!date) return "";
  return format(new Date(date), formatString);
};

export const formatRelativeDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  }
  
  if (isPast(dateObj)) {
    return "Overdue";
  }
  
  return formatDate(date, "MMM d");
};

export const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
};

export const isDueToday = (dueDate) => {
  if (!dueDate) return false;
  return isToday(new Date(dueDate));
};

export const isDueSoon = (dueDate, days = 3) => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

export const getDateRange = (startDate, endDate) => {
  return {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate))
  };
};

export const sortTasksByDate = (tasks, ascending = true) => {
  return tasks.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
};