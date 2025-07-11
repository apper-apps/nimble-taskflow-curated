import tasksData from "@/services/mockData/tasks.json";
import { format } from "date-fns";
import React from "react";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  // Helper function to simulate API delay
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(300);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await this.delay(300);
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      archived: false
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }
async update(id, updates) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    return true;
  }
async markComplete(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    this.tasks[index] = {
      ...this.tasks[index],
      completed: true,
      completedAt: new Date().toISOString()
    };
    return { ...this.tasks[index] };
  }

  async markIncomplete(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    this.tasks[index] = {
      ...this.tasks[index],
      completed: false,
      completedAt: null
    };
    return { ...this.tasks[index] };
  }
async archive(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    this.tasks[index] = {
      ...this.tasks[index],
      archived: true
    };
    return { ...this.tasks[index] };
  }

  async restore(id) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    this.tasks[index] = {
      ...this.tasks[index],
      archived: false
    };
    return { ...this.tasks[index] };
  }
async getStats() {
    await this.delay(300);
    const today = format(new Date(), "yyyy-MM-dd");
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = format(startOfWeek, "yyyy-MM-dd");
    
    const completedTasks = this.tasks.filter(t => t.completed && !t.archived);
    const completedToday = completedTasks.filter(t => 
      t.completedAt && format(new Date(t.completedAt), "yyyy-MM-dd") === today
    );
    const completedThisWeek = completedTasks.filter(t => 
      t.completedAt && format(new Date(t.completedAt), "yyyy-MM-dd") >= weekStart
    );
    
    return {
      totalTasks: this.tasks.filter(t => !t.archived).length,
      completedToday: completedToday.length,
      completedThisWeek: completedThisWeek.length,
      currentStreak: this.calculateStreak(),
      longestStreak: this.calculateLongestStreak()
    };
  }

  calculateStreak() {
    const completedTasks = this.tasks
      .filter(t => t.completed && t.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    if (completedTasks.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const hasTasksOnDate = completedTasks.some(t => 
        format(new Date(t.completedAt), "yyyy-MM-dd") === dateStr
      );
      
      if (hasTasksOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  calculateLongestStreak() {
    const completedTasks = this.tasks
      .filter(t => t.completed && t.completedAt)
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    
    if (completedTasks.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = null;
    
    const uniqueDates = [...new Set(completedTasks.map(t => 
      format(new Date(t.completedAt), "yyyy-MM-dd")
    ))];
    
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      
      if (lastDate && (currentDate - lastDate) === 24 * 60 * 60 * 1000) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = currentDate;
    }
    
    return longestStreak;
  }
}

export default new TaskService();