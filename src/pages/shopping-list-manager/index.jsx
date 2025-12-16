import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ShoppingListHeader from './components/ShoppingListHeader';
import MealPlanSelector from './components/MealPlanSelector';
import ManualAddition from './components/ManualAddition';
import ShoppingListCategory from './components/ShoppingListCategory';
import BudgetSummary from './components/BudgetSummary';
import { usePersistentState } from '../../utils/usePersistentState';

const ShoppingListManager = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentState(
    'nutrilife_shopping_sidebar_collapsed',
    false
  );
  const [isGenerating, setIsGenerating] = usePersistentState(
    'nutrilife_shopping_is_generating',
    false
  );
  const [selectedDays, setSelectedDays] = usePersistentState(
    'nutrilife_shopping_selected_days',
    []
  );
  const [shoppingList, setShoppingList] = usePersistentState(
    'nutrilife_shopping_list',
    []
  );
  const [collapsedCategories, setCollapsedCategories] = usePersistentState(
    'nutrilife_shopping_collapsed_categories',
    {}
  );

  // Mock data for available meal plan days
  const availableDays = [
    { id: 'day1', name: 'Monday', mealCount: 3, estimatedCost: 12.50 },
    { id: 'day2', name: 'Tuesday', mealCount: 3, estimatedCost: 14.25 },
    { id: 'day3', name: 'Wednesday', mealCount: 3, estimatedCost: 11.75 },
    { id: 'day4', name: 'Thursday', mealCount: 3, estimatedCost: 13.80 },
    { id: 'day5', name: 'Friday', mealCount: 3, estimatedCost: 15.20 },
    { id: 'day6', name: 'Saturday', mealCount: 3, estimatedCost: 16.90 },
    { id: 'day7', name: 'Sunday', mealCount: 3, estimatedCost: 14.60 }
  ];

  // Categories for organizing shopping list
  const categories = [
    { id: 'produce', name: 'Produce & Fresh' },
    { id: 'proteins', name: 'Proteins & Meat' },
    { id: 'dairy', name: 'Dairy & Eggs' },
    { id: 'pantry', name: 'Pantry & Dry Goods' },
    { id: 'frozen', name: 'Frozen Foods' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'snacks', name: 'Snacks & Treats' },
    { id: 'other', name: 'Other Items' }
  ];

  // Mock user profile for budget calculation
  const userProfile = {
    dailyBudget: 15.00
  };

  // Generate shopping list from selected meal plan days
  const handleGenerateList = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock ingredients from meal plans
    const mockIngredients = [
      // Produce
      { id: '1', name: 'Organic Spinach', quantity: 2, unit: 'cups', category: 'produce', estimatedCost: 3.99, recipes: ['Green Smoothie', 'Spinach Salad'] },
      { id: '2', name: 'Bananas', quantity: 6, unit: 'pieces', category: 'produce', estimatedCost: 2.49, recipes: ['Protein Smoothie', 'Oatmeal Bowl'] },
      { id: '3', name: 'Avocados', quantity: 3, unit: 'pieces', category: 'produce', estimatedCost: 4.47, recipes: ['Avocado Toast', 'Buddha Bowl'] },
      { id: '4', name: 'Bell Peppers', quantity: 4, unit: 'pieces', category: 'produce', estimatedCost: 3.96, recipes: ['Stir Fry', 'Stuffed Peppers'] },
      
      // Proteins
      { id: '5', name: 'Chicken Breast', quantity: 2, unit: 'lbs', category: 'proteins', estimatedCost: 8.99, recipes: ['Grilled Chicken', 'Chicken Stir Fry'] },
      { id: '6', name: 'Salmon Fillets', quantity: 1, unit: 'lbs', category: 'proteins', estimatedCost: 12.99, recipes: ['Baked Salmon', 'Salmon Bowl'] },
      { id: '7', name: 'Greek Yogurt', quantity: 2, unit: 'cups', category: 'dairy', estimatedCost: 5.49, recipes: ['Breakfast Bowl', 'Smoothie'] },
      
      // Pantry
      { id: '8', name: 'Brown Rice', quantity: 2, unit: 'cups', category: 'pantry', estimatedCost: 3.29, recipes: ['Rice Bowl', 'Stir Fry'] },
      { id: '9', name: 'Quinoa', quantity: 1, unit: 'cups', category: 'pantry', estimatedCost: 4.99, recipes: ['Quinoa Salad', 'Buddha Bowl'] },
      { id: '10', name: 'Olive Oil', quantity: 1, unit: 'bottles', category: 'pantry', estimatedCost: 6.99, recipes: ['Salad Dressing', 'Cooking'] },
      
      // Dairy
      { id: '11', name: 'Eggs', quantity: 12, unit: 'pieces', category: 'dairy', estimatedCost: 3.49, recipes: ['Scrambled Eggs', 'Protein Bowl'] },
      { id: '12', name: 'Almond Milk', quantity: 1, unit: 'cartons', category: 'dairy', estimatedCost: 3.99, recipes: ['Smoothies', 'Cereal'] },
      
      // Frozen
      { id: '13', name: 'Frozen Berries', quantity: 2, unit: 'bags', category: 'frozen', estimatedCost: 7.98, recipes: ['Smoothie Bowl', 'Yogurt Parfait'] },
      
      // Beverages
      { id: '14', name: 'Green Tea', quantity: 1, unit: 'boxes', category: 'beverages', estimatedCost: 4.49, recipes: ['Daily Hydration'] }
    ];

    // Filter ingredients based on selected days (mock logic)
    const filteredIngredients = selectedDays?.length === availableDays?.length 
      ? mockIngredients 
      : mockIngredients?.slice(0, Math.max(8, selectedDays?.length * 2));

    const newItems = filteredIngredients?.map(ingredient => ({
      ...ingredient,
      completed: false,
      isManual: false
    }));

    setShoppingList(newItems);
    setIsGenerating(false);
  };

  // Add manual item to shopping list
  const handleAddManualItem = (item) => {
    setShoppingList(prev => [...prev, item]);
  };

  // Toggle item completion status
  const handleItemToggle = (itemId, completed) => {
    setShoppingList(prev => 
      prev?.map(item => 
        item?.id === itemId ? { ...item, completed } : item
      )
    );
  };

  // Remove manual item from shopping list
  const handleItemRemove = (itemId) => {
    setShoppingList(prev => prev?.filter(item => item?.id !== itemId));
  };

  // Export shopping list as CSV
  const handleExportCSV = () => {
    const headers = ['Item Name', 'Quantity', 'Unit', 'Category', 'Estimated Cost', 'Completed', 'Recipes'];
    const csvContent = [
      headers?.join(','),
      ...shoppingList?.map(item => [
        `"${item?.name}"`,
        item?.quantity,
        item?.unit,
        categories?.find(cat => cat?.id === item?.category)?.name || item?.category,
        item?.estimatedCost?.toFixed(2),
        item?.completed ? 'Yes' : 'No',
        `"${item?.recipes ? item?.recipes?.join('; ') : ''}"`
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shopping-list-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    window.URL?.revokeObjectURL(url);
  };

  // Clear completed items
  const handleClearCompleted = () => {
    setShoppingList(prev => prev?.filter(item => !item?.completed));
  };

  // Reset entire shopping list
  const handleResetList = () => {
    if (window.confirm('Are you sure you want to reset the entire shopping list? This action cannot be undone.')) {
      setShoppingList([]);
      setSelectedDays([]);
    }
  };

  // Toggle category collapse state
  const handleToggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev?.[categoryId]
    }));
  };

  // Calculate statistics
  const totalItems = shoppingList?.length;
  const completedItems = shoppingList?.filter(item => item?.completed)?.length;
  const totalCost = shoppingList?.reduce((sum, item) => sum + item?.estimatedCost, 0);
  const completedCost = shoppingList?.filter(item => item?.completed)?.reduce((sum, item) => sum + item?.estimatedCost, 0);
  const remainingCost = totalCost - completedCost;

  // Group items by category
  const itemsByCategory = categories?.map(category => ({
    ...category,
    items: shoppingList?.filter(item => item?.category === category?.id)
  }))?.filter(category => category?.items?.length > 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        
        <main className={`flex-1 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } mt-16`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Breadcrumb />
            
            <ShoppingListHeader
              totalItems={totalItems}
              completedItems={completedItems}
              totalCost={totalCost}
              onExportCSV={handleExportCSV}
              onClearCompleted={handleClearCompleted}
              onResetList={handleResetList}
            />

            {/* Empty State */}
            {shoppingList?.length === 0 && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center w-24 h-24 bg-muted rounded-full mx-auto mb-6">
                  <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground font-heading mb-2">
                  No Items in Shopping List
                </h3>
                <p className="text-muted-foreground font-body mb-6 max-w-md mx-auto">
                  Generate a shopping list from your meal plans or add custom items to get started with your grocery shopping.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="default"
                    onClick={() => navigate('/meal-plan-generator')}
                    iconName="Calendar"
                    iconPosition="left"
                  >
                    Create Meal Plan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recipe-browser')}
                    iconName="Search"
                    iconPosition="left"
                  >
                    Browse Recipes
                  </Button>
                </div>
              </div>
            )}

            {/* Main Content */}
            {shoppingList?.length === 0 && (
              <>
                <MealPlanSelector
                  availableDays={availableDays}
                  selectedDays={selectedDays}
                  onDayToggle={setSelectedDays}
                  onGenerateList={handleGenerateList}
                  isGenerating={isGenerating}
                />

                <ManualAddition
                  onAddItem={handleAddManualItem}
                  categories={categories}
                />
              </>
            )}

            {/* Shopping List Content */}
            {shoppingList?.length > 0 && (
              <>
                <BudgetSummary
                  totalCost={totalCost}
                  budgetPerDay={userProfile?.dailyBudget}
                  selectedDays={selectedDays?.length || 7}
                  completedCost={completedCost}
                  remainingCost={remainingCost}
                />

                <ManualAddition
                  onAddItem={handleAddManualItem}
                  categories={categories}
                />

                {/* Shopping List Categories */}
                <div className="space-y-4">
                  {itemsByCategory?.map(category => (
                    <ShoppingListCategory
                      key={category?.id}
                      category={category}
                      items={category?.items}
                      onItemToggle={handleItemToggle}
                      onItemRemove={handleItemRemove}
                      isCollapsed={collapsedCategories?.[category?.id] || false}
                      onToggleCollapse={() => handleToggleCategoryCollapse(category?.id)}
                    />
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/meal-plan-generator')}
                      iconName="Calendar"
                      iconPosition="left"
                    >
                      Update Meal Plan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/recipe-browser')}
                      iconName="Search"
                      iconPosition="left"
                    >
                      Find More Recipes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/progress-tracking')}
                      iconName="TrendingUp"
                      iconPosition="left"
                    >
                      View Progress
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden">
        {shoppingList?.length > 0 && (
          <Button
            variant="default"
            size="icon"
            className="floating-action w-14 h-14"
            onClick={handleExportCSV}
          >
            <Icon name="Download" size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShoppingListManager;