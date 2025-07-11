import categoriesData from "@/services/mockData/categories.json";
import taskService from "./taskService";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
    this.delay = 250;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(this.delay);
    const tasks = await taskService.getAll();
    
    return this.categories.map(category => ({
      ...category,
      taskCount: tasks.filter(t => t.categoryId === category.Id.toString() && !t.archived).length
    }));
  }

  async getById(id) {
    await this.delay(this.delay);
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) return null;
    
    const tasks = await taskService.getAll();
    const taskCount = tasks.filter(t => t.categoryId === id.toString() && !t.archived).length;
    
    return { ...category, taskCount };
  }

  async create(categoryData) {
    await this.delay(this.delay);
    const newCategory = {
      ...categoryData,
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await this.delay(this.delay);
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await this.delay(this.delay);
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }
}

export default new CategoryService();