import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PlanConfiguration from './components/PlanConfiguration';
import MealPlanCalendar from './components/MealPlanCalendar';
import NutritionSidebar from './components/NutritionSidebar';
import { getFoodsByMealType, getRandomFoods, formatFoodForDisplay } from '../../utils/foodData';

const MealPlanGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState([]);
  const [planConfig, setPlanConfig] = useState(null);
  const [showNutritionSidebar, setShowNutritionSidebar] = useState(true);
  const [csvRecipes, setCsvRecipes] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });

  // Load recipes from CSV
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allFoods = await getRandomFoods(50);
        
        const categorized = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };
        
        allFoods.forEach(food => {
          const formatted = formatFoodForDisplay(food);
          const recipe = {
            id: formatted.id,
            title: formatted.name,
            image: formatted.imageUrl,
            calories: parseInt(formatted.calories) || 0,
            protein: parseFloat(formatted.protein) || 0,
            carbs: parseFloat(formatted.carbs) || 0,
            fat: parseFloat(formatted.fat) || 0,
            fiber: parseFloat(formatted.fiber) || 0,
            cost: parseFloat(formatted.cost.replace(/[^\d.-]/g, '')) || 5.00,
            tags: formatted.tags || [],
            dietaryRestrictions: (formatted.dietaryRestrictions || '').toLowerCase()
          };
          
          const mealType = formatted.mealType.toLowerCase();
          if (mealType.includes('breakfast')) {
            categorized.breakfast.push(recipe);
          } else if (mealType.includes('lunch')) {
            categorized.lunch.push(recipe);
          } else if (mealType.includes('dinner')) {
            categorized.dinner.push(recipe);
          } else if (mealType.includes('snack')) {
            categorized.snacks.push(recipe);
          } else {
            // Distribute uncategorized foods
            const rand = Math.random();
            if (rand < 0.25) categorized.breakfast.push(recipe);
            else if (rand < 0.5) categorized.lunch.push(recipe);
            else if (rand < 0.75) categorized.dinner.push(recipe);
            else categorized.snacks.push(recipe);
          }
        });
        
        setCsvRecipes(categorized);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };
    
    loadRecipes();
  }, []);

  // Content-based scoring for a single recipe against plan configuration
  const scoreRecipe = (recipe, mealType, config) => {
    let score = 0;

    const prefs = config?.dietaryPreferences || {};

    const dietText = recipe?.dietaryRestrictions || '';
    const tags = recipe?.tags || [];

    if (prefs.vegetarian && dietText.includes('vegetarian')) score += 3;
    if (prefs.vegan && dietText.includes('vegan')) score += 3;
    if (prefs.glutenFree && dietText.includes('gluten-free')) score += 2;
    if (prefs.dairyFree && dietText.includes('dairy-free')) score += 2;

    if (prefs.lowCarb && recipe.carbs < 30) score += 2;
    if (prefs.highProtein && recipe.protein > 15) score += 2;

    const totalMealsPerDay = Object.values(config?.mealTypes || {}).filter(Boolean).length || 1;
    const targetPerMeal = (config?.targetCalories || 2000) / totalMealsPerDay;
    const calDiff = Math.abs((recipe.calories || 0) - targetPerMeal);
    if (calDiff < 100) score += 3;
    else if (calDiff < 200) score += 1;

    if (mealType === 'breakfast' && tags.some(t => t.toLowerCase().includes('breakfast'))) score += 1;
    if (mealType === 'lunch' && tags.some(t => t.toLowerCase().includes('lunch'))) score += 1;
    if (mealType === 'dinner' && tags.some(t => t.toLowerCase().includes('dinner'))) score += 1;
    if (mealType === 'snacks' && tags.some(t => t.toLowerCase().includes('snack'))) score += 1;

    if (config?.dailyBudget) {
      const maxPerMeal = config.dailyBudget;
      if (recipe.cost <= maxPerMeal) score += 2;
      if (recipe.cost > maxPerMeal * 1.5) score -= 2;
    }

    return score;
  };

  // Fallback mock recipe data (not used if CSV loads)
  const mockRecipes = csvRecipes.breakfast.length > 0 ? csvRecipes : {
    breakfast: [
      {
        id: 1,
        title: "Greek Yogurt Parfait with Berries",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
        calories: 280,
        protein: 20,
        carbs: 35,
        fat: 8,
        fiber: 6,
        cost: 3.50
      },
      {
        id: 2,
        title: "Avocado Toast with Poached Egg",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
        calories: 320,
        protein: 15,
        carbs: 25,
        fat: 22,
        fiber: 8,
        cost: 4.25
      },
      {
        id: 3,
        title: "Protein Smoothie Bowl",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
        calories: 350,
        protein: 25,
        carbs: 40,
        fat: 12,
        fiber: 10,
        cost: 5.00
      }
    ],
    lunch: [
      {
        id: 4,
        title: "Quinoa Buddha Bowl",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        calories: 420,
        protein: 18,
        carbs: 55,
        fat: 16,
        fiber: 12,
        cost: 6.75
      },
      {
        id: 5,
        title: "Grilled Chicken Salad",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
        calories: 380,
        protein: 35,
        carbs: 15,
        fat: 22,
        fiber: 8,
        cost: 7.50
      },
      {
        id: 6,
        title: "Turkey and Hummus Wrap",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        calories: 340,
        protein: 28,
        carbs: 30,
        fat: 14,
        fiber: 6,
        cost: 5.25
      }
    ],
    dinner: [
      {
        id: 7,
        title: "Salmon with Roasted Vegetables",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
        calories: 450,
        protein: 32,
        carbs: 25,
        fat: 28,
        fiber: 6,
        cost: 12.00
      },
      {
        id: 8,
        title: "Lean Beef Stir Fry",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        calories: 380,
        protein: 30,
        carbs: 20,
        fat: 20,
        fiber: 5,
        cost: 9.50
      },
      {
        id: 9,
        title: "Vegetarian Pasta Primavera",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
        calories: 360,
        protein: 14,
        carbs: 58,
        fat: 12,
        fiber: 8,
        cost: 6.00
      }
    ],
    snacks: [
      {
        id: 10,
        title: "Mixed Nuts and Fruit",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400",
        calories: 180,
        protein: 6,
        carbs: 15,
        fat: 12,
        fiber: 4,
        cost: 2.25
      },
      {
        id: 11,
        title: "Protein Energy Balls",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
        calories: 220,
        protein: 12,
        carbs: 20,
        fat: 10,
        fiber: 5,
        cost: 1.75
      }
    ]
  };

  const handleGeneratePlan = async (config) => {
    setIsGenerating(true);
    setPlanConfig(config);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedPlan = [];

    // Precompute sorted candidates per meal type so we can vary meals across days
    const breakfastCandidates = (mockRecipes?.breakfast || []).slice().sort((a, b) =>
      scoreRecipe(b, 'breakfast', config) - scoreRecipe(a, 'breakfast', config)
    );
    const lunchCandidates = (mockRecipes?.lunch || []).slice().sort((a, b) =>
      scoreRecipe(b, 'lunch', config) - scoreRecipe(a, 'lunch', config)
    );
    const dinnerCandidates = (mockRecipes?.dinner || []).slice().sort((a, b) =>
      scoreRecipe(b, 'dinner', config) - scoreRecipe(a, 'dinner', config)
    );
    const snackCandidates = (mockRecipes?.snacks || []).slice().sort((a, b) =>
      scoreRecipe(b, 'snacks', config) - scoreRecipe(a, 'snacks', config)
    );
    
    for (let day = 0; day < config?.planDays; day++) {
      const dayPlan = {
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
        meals: {}
      };

      if (config?.mealTypes?.breakfast && breakfastCandidates.length > 0) {
        const index = day % breakfastCandidates.length;
        dayPlan.meals.breakfast = breakfastCandidates[index];
      }

      if (config?.mealTypes?.lunch && lunchCandidates.length > 0) {
        const index = day % lunchCandidates.length;
        dayPlan.meals.lunch = lunchCandidates[index];
      }

      if (config?.mealTypes?.dinner && dinnerCandidates.length > 0) {
        const index = day % dinnerCandidates.length;
        dayPlan.meals.dinner = dinnerCandidates[index];
      }

      if (config?.mealTypes?.snacks && snackCandidates.length > 0) {
        const index = day % snackCandidates.length;
        dayPlan.meals.snacks = snackCandidates[index];
      }

      generatedPlan?.push(dayPlan);
    }

    setMealPlan(generatedPlan);
    setIsGenerating(false);
  };

  const handleMealReplace = (dayIndex, mealType, newRecipe) => {
    setMealPlan(prev => {
      const updated = [...prev];
      if (!updated?.[dayIndex]?.meals) {
        updated[dayIndex].meals = {};
      }
      updated[dayIndex].meals[mealType] = newRecipe;
      return updated;
    });
  };

  const handleMealRemove = (dayIndex, mealType) => {
    setMealPlan(prev => {
      const updated = [...prev];
      if (updated?.[dayIndex]?.meals) {
        delete updated?.[dayIndex]?.meals?.[mealType];
      }
      return updated;
    });
  };

  const handleSavePlan = () => {
    // Save to localStorage
    localStorage.setItem('savedMealPlan', JSON.stringify({
      plan: mealPlan,
      config: planConfig,
      savedAt: new Date()?.toISOString()
    }));

    // Show success feedback (in a real app, you'd use a toast notification)
    alert('Meal plan saved successfully!');
  };

  const handleExportToShoppingList = () => {
    // Navigate to shopping list with meal plan data
    navigate('/shopping-list-manager', { 
      state: { 
        fromMealPlan: true, 
        mealPlan: mealPlan 
      } 
    });
  };

  // Load saved meal plan on mount if available, otherwise initialize with default empty template
  useEffect(() => {
    const savedPlan = localStorage.getItem('savedMealPlan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setMealPlan(parsed?.plan || []);
        setPlanConfig(parsed?.config || null);
        return;
      } catch (error) {
        console.error('Error loading saved meal plan:', error);
      }
    }

    const defaultConfig = {
      planDays: 7,
      dailyBudget: 25,
      targetCalories: 2000,
      mealTypes: {
        breakfast: true,
        lunch: true,
        dinner: true,
        snacks: true
      }
    };

    const emptyPlan = [];
    for (let day = 0; day < defaultConfig.planDays; day++) {
      const dayPlan = {
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
        meals: {
          breakfast: null,
          lunch: null,
          dinner: null,
          snacks: null
        }
      };
      emptyPlan.push(dayPlan);
    }

    setPlanConfig(defaultConfig);
    setMealPlan(emptyPlan);
  }, []);

  // Auto-save plan whenever it changes so navigation doesn't reset it
  useEffect(() => {
    if (!planConfig || !mealPlan || mealPlan.length === 0) return;

    const payload = {
      plan: mealPlan,
      config: planConfig,
      savedAt: new Date()?.toISOString()
    };

    try {
      localStorage.setItem('savedMealPlan', JSON.stringify(payload));
    } catch (error) {
      console.error('Error auto-saving meal plan:', error);
    }
  }, [mealPlan, planConfig]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowNutritionSidebar(false);
      } else {
        setShowNutritionSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="pt-16">
        <div className="flex">
          {/* Main Content */}
          <div className={`flex-1 p-6 ${showNutritionSidebar ? 'lg:pr-80' : ''}`}>
            <Breadcrumb />
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground font-heading">
                  Meal Plan Generator
                </h1>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recipe-browser')}
                    iconName="Search"
                    iconPosition="left"
                    className="hidden sm:flex"
                  >
                    Browse Recipes
                  </Button>
                  {mealPlan?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNutritionSidebar(!showNutritionSidebar)}
                      className="lg:hidden"
                    >
                      <Icon name="BarChart3" size={20} />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground font-body">
                Create personalized meal plans optimized for your nutrition goals and budget.
              </p>
            </div>

            {/* Plan Configuration */}
            <PlanConfiguration 
              onGeneratePlan={handleGeneratePlan}
              isGenerating={isGenerating}
            />

            {/* Loading State */}
            {isGenerating && (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-foreground mb-2 font-heading">
                  Generating Your Meal Plan
                </h3>
                <p className="text-muted-foreground font-body">
                  Optimizing recipes based on your preferences and goals...
                </p>
              </div>
            )}

            {/* Meal Plan Calendar */}
            {!isGenerating && (
              <MealPlanCalendar
                mealPlan={mealPlan}
                onMealReplace={handleMealReplace}
                onMealRemove={handleMealRemove}
              />
            )}

            {/* Mobile Nutrition Summary */}
            {!showNutritionSidebar && mealPlan?.length > 0 && (
              <div className="mt-6 lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowNutritionSidebar(true)}
                  iconName="BarChart3"
                  iconPosition="left"
                  className="w-full touch-target"
                >
                  View Nutrition Summary
                </Button>
              </div>
            )}
          </div>

          {/* Nutrition Sidebar */}
          {showNutritionSidebar && mealPlan?.length > 0 && (
            <div className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l border-border overflow-y-auto z-40 lg:block hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground font-heading">
                    Nutrition Overview
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNutritionSidebar(false)}
                    className="lg:hidden"
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                
                <NutritionSidebar
                  mealPlan={mealPlan}
                  planConfig={planConfig}
                  onSavePlan={handleSavePlan}
                  onExportToShoppingList={handleExportToShoppingList}
                />
              </div>
            </div>
          )}

          {/* Mobile Nutrition Modal */}
          {showNutritionSidebar && mealPlan?.length > 0 && window.innerWidth < 1024 && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowNutritionSidebar(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-border overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground font-heading">
                      Nutrition Overview
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNutritionSidebar(false)}
                    >
                      <Icon name="X" size={20} />
                    </Button>
                  </div>
                  
                  <NutritionSidebar
                    mealPlan={mealPlan}
                    planConfig={planConfig}
                    onSavePlan={handleSavePlan}
                    onExportToShoppingList={handleExportToShoppingList}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MealPlanGenerator;