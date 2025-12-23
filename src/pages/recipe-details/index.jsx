import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RecipeHeader from './components/RecipeHeader';
import NutritionPanel from './components/NutritionPanel';
import IngredientsSection from './components/IngredientsSection';
import InstructionsSection from './components/InstructionsSection';
import ActionButtons from './components/ActionButtons';
import { getFoodById, formatFoodForDisplay } from '../../utils/foodData';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams?.get('id');
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load recipe from CSV data
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        if (!recipeId) {
          console.error('No recipe ID provided');
          setLoading(false);
          return;
        }

        const food = await getFoodById(recipeId);
        if (!food) {
          console.error('Recipe not found:', recipeId);
          setLoading(false);
          return;
        }

        const formatted = formatFoodForDisplay(food);
        
        // Convert CSV food to recipe format
        const recipeData = {
          id: formatted.id,
          title: formatted.name,
          description: formatted.description,
          image: formatted.imageUrl, // Always no_image.png
          servings: formatted.servings,
          prepTime: formatted.prepTime,
          cookTime: '0 min',
          totalTime: formatted.prepTime,
          difficulty: formatted.difficulty,
          costPerServing: formatted.cost,
          tags: formatted.tags,
          roleFit: formatted.roleFit.split(',').map(r => ({
            role: r.trim(),
            fit: 'Good'
          })),
          nutrition: {
            calories: formatted.calories,
            protein: formatted.protein,
            carbs: formatted.carbs,
            fat: formatted.fat,
            fiber: formatted.fiber,
            sugar: formatted.sugar,
            sodium: formatted.sodium,
            cholesterol: formatted.cholesterol
          },
          ingredients: formatted.ingredients.map((ing, idx) => ({
            name: ing,
            quantity: 1,
            unit: 'serving',
            notes: ''
          })),
          instructions: formatted.description 
            ? formatted.description.split('.').filter(s => s.trim()).map((step, idx) => ({
                text: step.trim() + '.',
                time: idx === 0 ? formatted.prepTime : '',
                tip: ''
              }))
            : [{ text: 'Prepare according to traditional Filipino cooking methods.', time: formatted.prepTime, tip: '' }]
        };

        setRecipe(recipeData);
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);


  const handleAddToPlan = async (planData) => {
    // Mock implementation - would integrate with meal plan service
    console.log('Adding to meal plan:', planData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message (in real app, would use toast/notification)
    alert(`Recipe added to ${planData?.meal} on ${planData?.date}!`);
  };

  const handleAddToShoppingList = async (ingredients) => {
    // Mock implementation - would integrate with shopping list service
    console.log('Adding to shopping list:', ingredients);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show success message
    alert(`${ingredients?.length} ingredients added to shopping list!`);
  };

  const handleSaveToFavorites = async (recipe) => {
    // Mock implementation - would integrate with favorites service
    console.log('Saving to favorites:', recipe);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Show success message
    alert('Recipe saved to favorites!');
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Recipes', path: '/recipe-browser' },
    { label: recipe?.title || 'Recipe Details', path: '/recipe-details' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'ingredients', label: 'Ingredients', icon: 'ShoppingCart' },
    { id: 'instructions', label: 'Instructions', icon: 'ChefHat' },
    { id: 'nutrition', label: 'Nutrition', icon: 'BarChart3' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Dark blur background with gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
        <div className="fixed inset-0 opacity-30 -z-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
        }} />
        
        <Header />
        <main className="mt-16">
          <div className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-64 bg-muted rounded"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-48 bg-muted rounded"></div>
                  </div>
                  <div className="h-96 bg-muted rounded"></div>
                </div>
              </div>
            </div>
        </main>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Dark blur background with gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
        <div className="fixed inset-0 opacity-30 -z-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
        }} />
        
        <Header />
        <main className="mt-16">
          <div className="p-6">
              <div className="text-center py-12">
                <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground font-heading mb-2">
                  Recipe Not Found
                </h2>
                <p className="text-muted-foreground font-body mb-6">
                  The recipe you're looking for doesn't exist or has been removed.
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate('/recipe-browser')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Recipes
                </Button>
              </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="mt-16">
        <div className="p-4 lg:p-6">
            {/* Breadcrumb */}
            <Breadcrumb customBreadcrumbs={breadcrumbs} />
            
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                iconName="ArrowLeft"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Back
              </Button>

              <div className="mt-4 flex flex-wrap gap-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="font-body">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Desktop: Show all sections */}
                <div className="hidden lg:block space-y-6">
                  <IngredientsSection
                    ingredients={recipe?.ingredients}
                    servings={recipe?.servings}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                  <InstructionsSection
                    instructions={recipe?.instructions}
                    equipment={recipe?.equipment}
                  />
                  <NutritionPanel nutrition={recipe?.nutrition} />
                </div>

                {/* Mobile: Show active tab content */}
                <div className="lg:hidden">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold text-foreground font-heading mb-4">
                          Recipe Overview
                        </h2>
                        <p className="text-muted-foreground font-body mb-4">
                          {recipe?.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground font-caption">Total Time</p>
                            <p className="text-lg font-semibold text-foreground font-body">
                              {recipe?.totalTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-caption">Difficulty</p>
                            <p className="text-lg font-semibold text-foreground font-body">
                              {recipe?.difficulty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'ingredients' && (
                    <IngredientsSection
                      ingredients={recipe?.ingredients}
                      servings={recipe?.servings}
                      onAddToShoppingList={handleAddToShoppingList}
                    />
                  )}
                  
                  {activeTab === 'instructions' && (
                    <InstructionsSection
                      instructions={recipe?.instructions}
                      equipment={recipe?.equipment}
                    />
                  )}
                  
                  {activeTab === 'nutrition' && (
                    <NutritionPanel nutrition={recipe?.nutrition} />
                  )}
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                <ActionButtons
                  recipe={recipe}
                  onAddToPlan={handleAddToPlan}
                  onAddToShoppingList={handleAddToShoppingList}
                  onSaveToFavorites={handleSaveToFavorites}
                />

                {/* Related Actions */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                    More Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/recipe-browser')}
                      iconName="Search"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Find Similar Recipes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/meal-plan-generator')}
                      iconName="Calendar"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Generate Meal Plan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      iconName="Printer"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Print Recipe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetails;