import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const Layout = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await taskService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

const handleAddCategory = () => {
// TODO: Implement add category modal
    console.log("Add category modal");
  };

  const handleAddTask = () => {
    // This would be handled by the child component
    console.log("Add task");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onAddCategory={handleAddCategory}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onAddCategory={handleAddCategory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 border-b border-gray-200 bg-surface">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
            <span>Menu</span>
          </Button>
        </div>

        {/* Header */}
        <Header
          onSearch={handleSearch}
          onAddTask={handleAddTask}
          stats={stats}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet context={{ 
            categories, 
            activeCategory, 
            searchQuery, 
            onStatsUpdate: loadStats,
            onCategoriesUpdate: loadCategories
          }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;