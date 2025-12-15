import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { getAllFoods, formatFoodForDisplay } from '../../../utils/foodData';

const RecipeSelectionModal = ({ mealType, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [csvRecipes, setCsvRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recipes from CSV
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const foods = await getAllFoods();
        const formatted = foods.map(food => {
          const f = formatFoodForDisplay(food);
          return {
            id: f.id,
            title: f.name,
            image: f.imageUrl,
            calories: parseInt(f.calories) || 0,
            protein: parseFloat(f.protein) || 0,
            carbs: parseFloat(f.carbs) || 0,
            fat: parseFloat(f.fat) || 0,
            fiber: parseFloat(f.fiber) || 0,
            cost: parseFloat(f.cost.replace(/[^\d.-]/g, '')) || 5.00,
            prepTime: parseInt(f.prepTime) || 15,
            tags: f.tags.map(t => t.toLowerCase()),
            roleFit: f.roleFit.toLowerCase().split(',').map(r => r.trim())
          };
        });
        setCsvRecipes(formatted);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  // Fallback mock recipe data (not used if CSV loads)
  const mockRecipes = csvRecipes.length > 0 ? csvRecipes : [
    {
      id: 1,
      title: "Greek Yogurt Parfait with Berries",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      calories: 280,
      protein: 20,
      carbs: 35,
      fat: 8,
      fiber: 6,
      cost: 3.50,
      prepTime: 5,
      tags: ["breakfast", "healthy", "quick"],
      roleFit: ["student", "office-worker"]
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
      cost: 4.25,
      prepTime: 10,
      tags: ["breakfast", "healthy", "vegetarian"],
      roleFit: ["bodybuilder", "office-worker"]
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
      cost: 5.00,
      prepTime: 8,
      tags: ["breakfast", "protein", "smoothie"],
      roleFit: ["bodybuilder", "student"]
    },
    {
      id: 4,
      title: "Quinoa Buddha Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 16,
      fiber: 12,
      cost: 6.75,
      prepTime: 25,
      tags: ["lunch", "healthy", "vegan"],
      roleFit: ["office-worker", "family"]
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
      cost: 7.50,
      prepTime: 20,
      tags: ["lunch", "protein", "low-carb"],
      roleFit: ["bodybuilder", "office-worker"]
    },
    {
      id: 6,
      title: "Salmon with Roasted Vegetables",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
      calories: 450,
      protein: 32,
      carbs: 25,
      fat: 28,
      fiber: 6,
      cost: 12.00,
      prepTime: 35,
      tags: ["dinner", "protein", "omega-3"],
      roleFit: ["bodybuilder", "family"]
    },
    {
      id: 7,
      title: "Mixed Nuts and Fruit",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400",
      calories: 180,
      protein: 6,
      carbs: 15,
      fat: 12,
      fiber: 4,
      cost: 2.25,
      prepTime: 2,
      tags: ["snack", "quick", "healthy"],
      roleFit: ["student", "office-worker"]
    },
    {
      id: 8,
      title: "Protein Energy Balls",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
      calories: 220,
      protein: 12,
      carbs: 20,
      fat: 10,
      fiber: 5,
      cost: 1.75,
      prepTime: 15,
      tags: ["snack", "protein", "homemade"],
      roleFit: ["bodybuilder", "student"]
    }
  ];

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'cheapest', label: 'Cheapest First' },
    { value: 'quickest', label: 'Quickest First' },
    { value: 'highest-protein', label: 'Highest Protein' },
    { value: 'lowest-calories', label: 'Lowest Calories' }
  ];

  useEffect(() => {
    let filtered = mockRecipes?.filter(recipe => 
      recipe?.tags?.includes(mealType) &&
      recipe?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    // Sort recipes
    switch (sortBy) {
      case 'cheapest':
        filtered?.sort((a, b) => a?.cost - b?.cost);
        break;
      case 'quickest':
        filtered?.sort((a, b) => a?.prepTime - b?.prepTime);
        break;
      case 'highest-protein':
        filtered?.sort((a, b) => b?.protein - a?.protein);
        break;
      case 'lowest-calories':
        filtered?.sort((a, b) => a?.calories - b?.calories);
        break;
      default:
        // Keep recommended order
        break;
    }

    setFilteredRecipes(filtered);
  }, [mealType, searchTerm, sortBy]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Select Recipe for {mealType?.charAt(0)?.toUpperCase() + mealType?.slice(1)}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              iconName="Search"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by..."
            />
          </div>
        </div>

        {/* Recipe List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredRecipes?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body">
                No recipes found for your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes?.map((recipe) => (
                <div
                  key={recipe?.id}
                  className="bg-muted/30 border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => onSelect(recipe)}
                >
                  <div className="relative mb-3">
                    <Image
                      src={recipe?.image}
                      alt={recipe?.title}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-caption">
                      {recipe?.prepTime}min
                    </div>
                  </div>

                  <h3 className="font-medium text-foreground mb-2 line-clamp-2 font-body">
                    {recipe?.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3 font-caption">
                    <div>Calories: {recipe?.calories}</div>
                    <div>Protein: {recipe?.protein}g</div>
                    <div>Cost: ₱{recipe?.cost}</div>
                    <div>Prep: {recipe?.prepTime}min</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {recipe?.tags?.slice(0, 2)?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-caption"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSelectionModal;