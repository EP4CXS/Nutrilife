import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import RecipeGrid from './components/RecipeGrid';

const RecipeBrowser = () => {
  const [filters, setFilters] = useState({
    protein: 'all',
    costRange: [0, 50],
    prepTime: 'all',
    roleFit: [],
    search: ''
  });

  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock recipe data
  const mockRecipes = [
    {
      id: 1,
      title: "Grilled Chicken with Quinoa Bowl",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      nutrition: {
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 12,
        fiber: 8
      },
      prepTime: 25,
      costPerServing: 8.50,
      rating: 4.8,
      roleFit: ['bodybuilder', 'office-worker'],
      proteinType: 'chicken',
      tags: ['high-protein', 'balanced', 'gluten-free']
    },
    {
      id: 2,
      title: "Budget-Friendly Lentil Curry",
      image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?w=400&h=300&fit=crop",
      nutrition: {
        calories: 320,
        protein: 18,
        carbs: 45,
        fat: 8,
        fiber: 12
      },
      prepTime: 30,
      costPerServing: 3.25,
      rating: 4.6,
      roleFit: ['student', 'vegetarian'],
      proteinType: 'vegetarian',
      tags: ['budget-friendly', 'vegetarian', 'high-fiber']
    },
    {
      id: 3,
      title: "Salmon and Sweet Potato",
      image: "https://images.pixabay.com/photos/2016/03/05/19/02/salmon-1238248_1280.jpg?w=400&h=300&fit=crop",
      nutrition: {
        calories: 520,
        protein: 42,
        carbs: 35,
        fat: 22,
        fiber: 6
      },
      prepTime: 20,
      costPerServing: 12.75,
      rating: 4.9,
      roleFit: ['bodybuilder', 'senior'],
      proteinType: 'fish',
      tags: ['omega-3', 'heart-healthy', 'premium']
    },
    {
      id: 4,
      title: "Quick Beef Stir Fry",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      nutrition: {
        calories: 380,
        protein: 28,
        carbs: 25,
        fat: 18,
        fiber: 4
      },
      prepTime: 15,
      costPerServing: 9.25,
      rating: 4.5,
      roleFit: ['office-worker', 'family'],
      proteinType: 'beef',
      tags: ['quick', 'family-friendly', 'asian-inspired']
    },
    {
      id: 5,
      title: "Vegetarian Buddha Bowl",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop",
      nutrition: {
        calories: 420,
        protein: 16,
        carbs: 55,
        fat: 14,
        fiber: 15
      },
      prepTime: 35,
      costPerServing: 6.50,
      rating: 4.7,
      roleFit: ['student', 'office-worker'],
      proteinType: 'vegetarian',
      tags: ['plant-based', 'colorful', 'nutrient-dense']
    },
    {
      id: 6,
      title: "Easy Pork Tenderloin",
      image: "https://images.pixabay.com/photos/2017/07/16/10/43/recipe-2509042_1280.jpg?w=400&h=300&fit=crop",
      nutrition: {
        calories: 340,
        protein: 32,
        carbs: 15,
        fat: 16,
        fiber: 3
      },
      prepTime: 40,
      costPerServing: 7.80,
      rating: 4.4,
      roleFit: ['family', 'senior'],
      proteinType: 'pork',
      tags: ['comfort-food', 'traditional', 'tender']
    },
    {
      id: 7,
      title: "Vegan Protein Power Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      nutrition: {
        calories: 480,
        protein: 22,
        carbs: 58,
        fat: 18,
        fiber: 18
      },
      prepTime: 25,
      costPerServing: 5.75,
      rating: 4.6,
      roleFit: ['student', 'bodybuilder'],
      proteinType: 'vegan',
      tags: ['vegan', 'high-protein', 'superfood']
    },
    {
      id: 8,
      title: "Family Chicken Casserole",
      image: "https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?w=400&h=300&fit=crop",
      nutrition: {
        calories: 390,
        protein: 26,
        carbs: 32,
        fat: 16,
        fiber: 5
      },
      prepTime: 45,
      costPerServing: 6.25,
      rating: 4.8,
      roleFit: ['family', 'senior'],
      proteinType: 'chicken',
      tags: ['family-size', 'comfort-food', 'make-ahead']
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = mockRecipes?.filter(recipe => {
      // Protein filter
      if (filters?.protein !== 'all' && recipe?.proteinType !== filters?.protein) {
        return false;
      }

      // Cost filter
      if (recipe?.costPerServing < filters?.costRange?.[0] || recipe?.costPerServing > filters?.costRange?.[1]) {
        return false;
      }

      // Prep time filter
      if (filters?.prepTime !== 'all') {
        const maxTime = parseInt(filters?.prepTime);
        if (recipe?.prepTime > maxTime) {
          return false;
        }
      }

      // Role fit filter
      if (filters?.roleFit?.length > 0) {
        const hasMatchingRole = filters?.roleFit?.some(role => recipe?.roleFit?.includes(role));
        if (!hasMatchingRole) {
          return false;
        }
      }

      // Search filter
      if (filters?.search) {
        const searchTerm = filters?.search?.toLowerCase();
        const matchesTitle = recipe?.title?.toLowerCase()?.includes(searchTerm);
        const matchesTags = recipe?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm));
        if (!matchesTitle && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    // Sort recipes
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'cheapest':
          return a?.costPerServing - b?.costPerServing;
        case 'quickest':
          return a?.prepTime - b?.prepTime;
        case 'highest-protein':
          return b?.nutrition?.protein - a?.nutrition?.protein;
        case 'rating':
          return b?.rating - a?.rating;
        case 'newest':
          return b?.id - a?.id;
        case 'recommended':
        default:
          return b?.rating - a?.rating;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const activeFilterCount = () => {
    let count = 0;
    if (filters?.protein !== 'all') count++;
    if (filters?.costRange?.[0] > 0 || filters?.costRange?.[1] < 50) count++;
    if (filters?.prepTime !== 'all') count++;
    if (filters?.roleFit?.length > 0) count++;
    if (filters?.search) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="flex gap-6 p-6">
          {/* Desktop Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={false}
            onClose={() => {}}
            recipeCount={filteredAndSortedRecipes?.length}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Breadcrumb />
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                Recipe Browser
              </h1>
              <p className="text-muted-foreground font-body">
                Discover recipes that match your dietary preferences, budget, and nutritional goals
              </p>
            </div>

            {/* Sort Controls */}
            <div className="mb-6">
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onFilterToggle={() => setIsFilterPanelOpen(true)}
                activeFilterCount={activeFilterCount()}
              />
            </div>

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={filteredAndSortedRecipes}
              viewMode={viewMode}
              loading={loading}
            />
          </div>
        </div>
      </main>
      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        recipeCount={filteredAndSortedRecipes?.length}
      />
    </div>
  );
};

export default RecipeBrowser;