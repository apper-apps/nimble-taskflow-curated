import taskService from "./taskService";
import { toast } from "react-toastify";

class CategoryService {
  constructor() {
    this.tableName = 'category_c';
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const categories = response.data || [];
      const tasks = await taskService.getAll();
      
      return categories.map(category => ({
        ...category,
        name: category.Name,
        color: category.color_c,
        icon: category.icon_c,
        taskCount: tasks.filter(t => 
          parseInt(t.category_id_c?.Id || t.category_id_c) === category.Id && !t.archived_c
        ).length
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const category = response.data;
      if (!category) return null;

      const tasks = await taskService.getAll();
      const taskCount = tasks.filter(t => 
        parseInt(t.category_id_c?.Id || t.category_id_c) === category.Id && !t.archived_c
      ).length;

      return {
        ...category,
        name: category.Name,
        color: category.color_c,
        icon: category.icon_c,
        taskCount
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const records = [{
        Name: categoryData.name || categoryData.Name || 'Untitled Category',
        color_c: categoryData.color || categoryData.color_c || '#6B7280',
        icon_c: categoryData.icon || categoryData.icon_c || 'Folder'
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
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            ...category,
            name: category.Name,
            color: category.color_c,
            icon: category.icon_c,
            taskCount: 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const records = [{
        Id: parseInt(id),
        ...(updates.name !== undefined && { Name: updates.name }),
        ...(updates.Name !== undefined && { Name: updates.Name }),
        ...(updates.color !== undefined && { color_c: updates.color }),
        ...(updates.color_c !== undefined && { color_c: updates.color_c }),
        ...(updates.icon !== undefined && { icon_c: updates.icon }),
        ...(updates.icon_c !== undefined && { icon_c: updates.icon_c })
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
          console.error(`Failed to update categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            ...category,
            name: category.Name,
            color: category.color_c,
            icon: category.icon_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error.message);
      return false;
    }
  }
}

export default new CategoryService();
