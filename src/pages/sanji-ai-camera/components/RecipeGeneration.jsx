import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getFoodsByIngredient, getRandomFoods, formatFoodForDisplay } from '../../../utils/foodData';

const RecipeGeneration = ({ 
  ingredients = [], 
  onRecipeSelect, 
  isGenerating = false 
}) => {
  const navigate = useNavigate();
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  // Convert CSV food data to recipe format
  const convertFoodToRecipe = (food, matchPercentage = 85) => {
    const formatted = formatFoodForDisplay(food);
    const prepTimeNum = parseInt(formatted.prepTime) || 30;
    
    return {
      id: formatted.id,
      name: formatted.name,
      description: formatted.description,
      difficulty: formatted.difficulty,
      prepTime: prepTimeNum,
      cookTime: 0,
      totalTime: prepTimeNum,
      
      // All values from CSV
      servings: formatted.servings,
      cost: formatted.cost,
      calories: formatted.calories,
      
      rating: (parseFloat(formatted.popularityScore) || 4) + 0.5,
      image: formatted.imageUrl, // Always no_image.png
      ingredients: formatted.ingredients.map((ing, idx) => ({
        name: ing,
        amount: '1 serving',
        available: idx < ingredients.length
      })),
      instructions: formatted.description ? formatted.description.split('.').filter(s => s.trim()).map(s => s.trim()) : ['Prepare according to traditional methods'],
      
      // Complete nutrition from CSV
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
      tags: formatted.tags,
      matchPercentage
    };
  };

  useEffect(() => {
    if (ingredients?.length > 0 && !isGenerating) {
      // Load recipes from CSV based on ingredients
      const loadRecipes = async () => {
        try {
          let recipes = [];
          
          // Try to find recipes matching ingredients
          for (const ingredient of ingredients.slice(0, 3)) {
            const foods = await getFoodsByIngredient(ingredient.name);
            if (foods.length > 0) {
              recipes.push(...foods.slice(0, 2));
            }
          }
          
          // If not enough matches, add random popular foods
          if (recipes.length < 3) {
            const randomFoods = await getRandomFoods(5);
            recipes.push(...randomFoods);
          }
          
          // Remove duplicates and convert to recipe format
          const uniqueRecipes = Array.from(new Map(recipes.map(r => [r.id, r])).values());
          const formattedRecipes = uniqueRecipes
            .slice(0, 6)
            .map((food, idx) => convertFoodToRecipe(food, 95 - (idx * 5)));
          
          setGeneratedRecipes(formattedRecipes);
        } catch (error) {
          console.error('Error loading recipes:', error);
          // Fallback to random foods
          const randomFoods = await getRandomFoods(5);
          const formattedRecipes = randomFoods.map((food, idx) => convertFoodToRecipe(food, 85 - (idx * 5)));
          setGeneratedRecipes(formattedRecipes);
        }
      };
      
      setTimeout(() => {
        loadRecipes();
      }, 2000);
    }
  }, [ingredients, isGenerating]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'hard': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTimeColor = (time) => {
    if (time <= 30) return 'text-success';
    if (time <= 60) return 'text-warning';
    return 'text-error';
  };

  const filteredRecipes = generatedRecipes?.filter(recipe => {
    const difficultyMatch = filterDifficulty === 'all' || recipe?.difficulty?.toLowerCase() === filterDifficulty;
    const timeMatch = filterTime === 'all' || 
      (filterTime === 'quick' && recipe?.totalTime <= 30) ||
      (filterTime === 'medium' && recipe?.totalTime > 30 && recipe?.totalTime <= 60) ||
      (filterTime === 'long' && recipe?.totalTime > 60);
    
    return difficultyMatch && timeMatch;
  });

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    onRecipeSelect?.(recipe);
  };

  const navigateToRecipeDetails = (recipe) => {
    navigate('/recipe-details', { state: { recipe } });
  };

  const getAvailableIngredientsCount = (recipe) => {
    return recipe?.ingredients?.filter(ing => ing?.available)?.length;
  };

  const getMissingIngredients = (recipe) => {
    return recipe?.ingredients?.filter(ing => !ing?.available);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Generated Recipes</h3>
          <p className="text-sm text-muted-foreground">
            {filteredRecipes?.length} recipe{filteredRecipes?.length !== 1 ? 's' : ''} found using your ingredients
          </p>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-organic text-sm"
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time:</span>
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-organic text-sm"
          >
            <option value="all">All</option>
            <option value="quick">Quick (&lt; 30 min)</option>
            <option value="medium">Medium (30-60 min)</option>
            <option value="long">Long (&gt; 60 min)</option>
          </select>
        </div>
      </div>
      {/* Recipe Cards */}
      <div className="grid gap-6">
        {filteredRecipes?.map((recipe) => (
          <div key={recipe?.id} className="bg-card border border-border rounded-organic-lg overflow-hidden hover:shadow-elevated transition-ambient">
            <div className="md:flex">
              {/* Recipe Image */}
              <div className="md:w-1/3">
                <img
                  src={recipe?.image}
                  alt={recipe?.name}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>

              {/* Recipe Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-foreground mb-2">{recipe?.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {recipe?.description?.split('\n')?.[0]}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <Icon name="Star" size={16} className="text-warning fill-current" />
                    <span className="text-sm font-medium">{recipe?.rating}</span>
                  </div>
                </div>

                {/* Recipe Stats - Row 1: Serves, Prep Time, Cost, Calories, Protein */}
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-2 font-semibold">Basic Info</div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Serves</div>
                      <div className="text-sm font-medium">{recipe?.servings}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Prep Time</div>
                      <div className="text-sm font-medium">{recipe?.prepTime} min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Cost</div>
                      <div className="text-sm font-medium">₱{recipe?.cost}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Calories</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.calories} kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Protein</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.protein}g</div>
                    </div>
                  </div>
                </div>

                {/* Recipe Stats - Row 2: Carbs, Fat, Fiber, Sugar, Sodium, Cholesterol */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2 font-semibold">Nutrition Details</div>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Carbs</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.carbs}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Fat</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.fat}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Fiber</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.fiber}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Sugar</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.sugar}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Sodium</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.sodium}mg</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Cholesterol</div>
                      <div className="text-sm font-medium">{recipe?.nutrition?.cholesterol}mg</div>
                    </div>
                  </div>
                </div>

                {/* Ingredient Match */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Ingredient Match</span>
                    <span className="text-sm font-medium text-primary">{recipe?.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${recipe?.matchPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{getAvailableIngredientsCount(recipe)}/{recipe?.ingredients?.length} available</span>
                    {getMissingIngredients(recipe)?.length > 0 && (
                      <span>{getMissingIngredients(recipe)?.length} missing</span>
                    )}
                  </div>
                </div>

                {/* Missing Ingredients */}
                {getMissingIngredients(recipe)?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-2">Missing ingredients:</div>
                    <div className="flex flex-wrap gap-2">
                      {getMissingIngredients(recipe)?.slice(0, 3)?.map((ingredient, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-error/10 text-error rounded-full"
                        >
                          {ingredient?.name}
                        </span>
                      ))}
                      {getMissingIngredients(recipe)?.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                          +{getMissingIngredients(recipe)?.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe?.tags?.slice(0, 4)?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    onClick={() => navigateToRecipeDetails(recipe)}
                    iconName="BookOpen"
                    iconPosition="left"
                    className="flex-1"
                  >
                    View Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRecipeSelect(recipe)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add to Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* No Results */}
      {filteredRecipes?.length === 0 && generatedRecipes?.length > 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium text-foreground mb-2">No recipes match your filters</h4>
          <p className="text-muted-foreground mb-4">Try adjusting your difficulty or time preferences</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilterDifficulty('all');
              setFilterTime('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      {/* Empty State */}
      {generatedRecipes?.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <Icon name="ChefHat" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium text-foreground mb-2">No recipes generated yet</h4>
          <p className="text-muted-foreground">Capture ingredients to get AI-powered recipe suggestions</p>
        </div>
      )}
    </div>
  );
};

export default RecipeGeneration;