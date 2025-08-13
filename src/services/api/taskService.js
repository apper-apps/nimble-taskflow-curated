import { format } from "date-fns";
import { toast } from "react-toastify";

class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "archived_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const records = [{
        Name: taskData.title_c || taskData.title || 'Untitled Task',
        title_c: taskData.title_c || taskData.title,
        description_c: taskData.description_c || taskData.description,
        category_id_c: taskData.category_id_c ? parseInt(taskData.category_id_c) : (taskData.categoryId ? parseInt(taskData.categoryId) : null),
        priority_c: taskData.priority_c || taskData.priority || 'medium',
        due_date_c: taskData.due_date_c || taskData.dueDate,
        completed_c: false,
        completed_at_c: null,
        created_at_c: new Date().toISOString(),
        archived_c: false
      }];

      const params = { records };
      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const records = [{
        Id: parseInt(id),
        ...(updates.title_c !== undefined && { title_c: updates.title_c }),
        ...(updates.title !== undefined && { title_c: updates.title }),
        ...(updates.description_c !== undefined && { description_c: updates.description_c }),
        ...(updates.description !== undefined && { description_c: updates.description }),
        ...(updates.category_id_c !== undefined && { category_id_c: parseInt(updates.category_id_c) }),
        ...(updates.categoryId !== undefined && { category_id_c: parseInt(updates.categoryId) }),
        ...(updates.priority_c !== undefined && { priority_c: updates.priority_c }),
        ...(updates.priority !== undefined && { priority_c: updates.priority }),
        ...(updates.due_date_c !== undefined && { due_date_c: updates.due_date_c }),
        ...(updates.dueDate !== undefined && { due_date_c: updates.dueDate }),
        ...(updates.completed_c !== undefined && { completed_c: updates.completed_c }),
        ...(updates.completed !== undefined && { completed_c: updates.completed }),
        ...(updates.completed_at_c !== undefined && { completed_at_c: updates.completed_at_c }),
        ...(updates.completedAt !== undefined && { completed_at_c: updates.completedAt }),
        ...(updates.archived_c !== undefined && { archived_c: updates.archived_c }),
        ...(updates.archived !== undefined && { archived_c: updates.archived })
      }];

      const params = { records };
      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message);
      return false;
    }
  }

  async markComplete(id) {
    return await this.update(id, { 
      completed_c: true, 
      completed_at_c: new Date().toISOString() 
    });
  }

  async markIncomplete(id) {
    return await this.update(id, { 
      completed_c: false, 
      completed_at_c: null 
    });
  }

  async archive(id) {
    return await this.update(id, { archived_c: true });
  }

  async restore(id) {
    return await this.update(id, { archived_c: false });
  }

  async getStats() {
    try {
      const allTasks = await this.getAll();
      const today = format(new Date(), "yyyy-MM-dd");
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const weekStart = format(startOfWeek, "yyyy-MM-dd");
      
      const completedTasks = allTasks.filter(t => t.completed_c && !t.archived_c);
      const completedToday = completedTasks.filter(t => 
        t.completed_at_c && format(new Date(t.completed_at_c), "yyyy-MM-dd") === today
      );
      const completedThisWeek = completedTasks.filter(t => 
        t.completed_at_c && format(new Date(t.completed_at_c), "yyyy-MM-dd") >= weekStart
      );
      
      return {
        totalTasks: allTasks.filter(t => !t.archived_c).length,
        completedToday: completedToday.length,
        completedThisWeek: completedThisWeek.length,
        currentStreak: this.calculateStreak(allTasks),
        longestStreak: this.calculateLongestStreak(allTasks)
      };
    } catch (error) {
      console.error("Error calculating stats:", error?.response?.data?.message || error.message);
      return {
        totalTasks: 0,
        completedToday: 0,
        completedThisWeek: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }
  }

  calculateStreak(tasks) {
    const completedTasks = tasks
      .filter(t => t.completed_c && t.completed_at_c)
      .sort((a, b) => new Date(b.completed_at_c) - new Date(a.completed_at_c));
    
    if (completedTasks.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const hasTasksOnDate = completedTasks.some(t => 
        format(new Date(t.completed_at_c), "yyyy-MM-dd") === dateStr
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

  calculateLongestStreak(tasks) {
    const completedTasks = tasks
      .filter(t => t.completed_c && t.completed_at_c)
      .sort((a, b) => new Date(a.completed_at_c) - new Date(b.completed_at_c));
    
    if (completedTasks.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = null;
    
    const uniqueDates = [...new Set(completedTasks.map(t => 
      format(new Date(t.completed_at_c), "yyyy-MM-dd")
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