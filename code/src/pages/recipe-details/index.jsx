import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import RecipeHeader from './components/RecipeHeader';
import NutritionPanel from './components/NutritionPanel';
import IngredientsSection from './components/IngredientsSection';
import InstructionsSection from './components/InstructionsSection';
import ActionButtons from './components/ActionButtons';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams?.get('id') || '1';
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock recipe data
  const mockRecipes = {
    '1': {
      id: '1',
      title: 'Grilled Chicken with Quinoa Bowl',
      description: 'A nutritious and protein-packed meal perfect for muscle building and weight management. Features perfectly seasoned grilled chicken breast served over fluffy quinoa with fresh vegetables.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      servings: 4,
      prepTime: '25 min',
      cookTime: '20 min',
      totalTime: '45 min',
      difficulty: 'Easy',
      costPerServing: 4.25,
      tags: ['High Protein', 'Gluten Free', 'Healthy', 'Meal Prep'],
      roleFit: [
        { role: 'Bodybuilder', fit: 'Excellent' },
        { role: 'Office Worker', fit: 'Good' },
        { role: 'Student', fit: 'Good' },
        { role: 'Senior', fit: 'Excellent' }
      ],
      nutrition: {
        calories: 485,
        protein: 42,
        carbs: 38,
        fat: 18,
        fiber: 6,
        sugar: 8,
        sodium: 650
      },
      ingredients: [
        { name: 'Chicken breast, boneless skinless', quantity: 1.5, unit: 'lbs', notes: 'Cut into 4 portions' },
        { name: 'Quinoa, uncooked', quantity: 1, unit: 'cup', notes: 'Rinse before cooking' },
        { name: 'Olive oil', quantity: 3, unit: 'tbsp', notes: 'Extra virgin preferred' },
        { name: 'Bell peppers, mixed colors', quantity: 2, unit: 'large', notes: 'Cut into strips' },
        { name: 'Red onion', quantity: 1, unit: 'medium', notes: 'Sliced thin' },
        { name: 'Cherry tomatoes', quantity: 1, unit: 'cup', notes: 'Halved' },
        { name: 'Garlic cloves', quantity: 3, unit: 'cloves', notes: 'Minced' },
        { name: 'Lemon juice', quantity: 2, unit: 'tbsp', notes: 'Fresh squeezed' },
        { name: 'Paprika', quantity: 1, unit: 'tsp', notes: 'Smoked preferred' },
        { name: 'Cumin', quantity: 0.5, unit: 'tsp', notes: 'Ground' },
        { name: 'Salt', quantity: 1, unit: 'tsp', notes: 'To taste' },
        { name: 'Black pepper', quantity: 0.5, unit: 'tsp', notes: 'Freshly ground' },
        { name: 'Fresh cilantro', quantity: 0.25, unit: 'cup', notes: 'Chopped for garnish' }
      ],
      instructions: [
        {
          text: 'Rinse quinoa under cold water until water runs clear. In a medium saucepan, bring 2 cups of water to boil. Add quinoa, reduce heat to low, cover and simmer for 15 minutes until water is absorbed.',
          time: '15 min',
          tip: 'Fluff quinoa with a fork after cooking for best texture'
        },
        {
          text: 'While quinoa cooks, season chicken breasts with salt, pepper, paprika, and cumin. Rub seasoning evenly on both sides and let rest for 5 minutes.',
          time: '5 min',
          tip: 'Let chicken come to room temperature for even cooking'
        },
        {
          text: 'Heat 1 tablespoon olive oil in a large skillet or grill pan over medium-high heat. Cook chicken breasts for 6-7 minutes per side until internal temperature reaches 165°F.',
          time: '14 min',
          temperature: '165°F',
          tip: 'Don\'t move chicken too early - let it develop a golden crust'
        },
        {
          text: 'Remove chicken from pan and let rest for 5 minutes, then slice into strips. Cover with foil to keep warm.',
          time: '5 min',
          tip: 'Resting allows juices to redistribute for tender chicken'
        },
        {
          text: 'In the same pan, add remaining olive oil. Sauté bell peppers and onion for 4-5 minutes until slightly softened but still crisp.',
          time: '5 min',
          tip: 'Keep vegetables slightly crisp for better texture and nutrition'
        },
        {
          text: 'Add garlic and cherry tomatoes to the pan. Cook for 2 minutes until tomatoes start to soften and garlic is fragrant.',
          time: '2 min',
          tip: 'Don\'t overcook garlic as it can become bitter'
        },
        {
          text: 'Fluff cooked quinoa with a fork and divide among 4 bowls. Top with sautéed vegetables and sliced chicken. Drizzle with lemon juice and garnish with fresh cilantro.',
          time: '3 min',
          tip: 'Serve immediately while warm for best flavor'
        }
      ],
      equipment: ['Large skillet or grill pan', 'Medium saucepan', 'Cutting board', 'Sharp knife', 'Measuring cups', 'Meat thermometer']
    }
  };

  useEffect(() => {
    // Simulate API call
    const loadRecipe = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const recipeData = mockRecipes?.[recipeId];
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          // Fallback to first recipe if ID not found
          setRecipe(mockRecipes?.['1']);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        setRecipe(mockRecipes?.['1']);
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          } mt-16`}>
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
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          } mt-16`}>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        } mt-16`}>
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
            </div>

            {/* Recipe Header */}
            <div className="mb-8">
              <RecipeHeader recipe={recipe} />
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6">
              <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg overflow-x-auto">
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
    </div>
  );
};

export default RecipeDetails;