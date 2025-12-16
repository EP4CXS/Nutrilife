import React, { useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import RecipeGrid from './components/RecipeGrid';
import { getAllFoods, formatFoodForDisplay } from '../../utils/foodData';
import { usePersistentState } from '../../utils/usePersistentState';

const RecipeBrowser = () => {
  const [filters, setFilters] = usePersistentState(
    'nutrilife_recipe_browser_filters',
    {
      protein: 'all',
      costRange: [0, 200], // Updated to accommodate Philippine peso prices (₱35-180)
      prepTime: 'all',
      roleFit: [],
      search: ''
    }
  );

  const [sortBy, setSortBy] = usePersistentState(
    'nutrilife_recipe_browser_sort',
    'recommended'
  );
  const [viewMode, setViewMode] = usePersistentState(
    'nutrilife_recipe_browser_view_mode',
    'grid'
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = usePersistentState(
    'nutrilife_recipe_browser_filter_panel_open',
    false
  );
  const [loading, setLoading] = usePersistentState(
    'nutrilife_recipe_browser_loading',
    true
  );
  const [recipes, setRecipes] = usePersistentState(
    'nutrilife_recipe_browser_recipes',
    []
  );

  // Load recipes from CSV data
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      // Already loaded in this tab; do not re-fetch or reset state
      setLoading(false);
      return;
    }

    const loadRecipes = async () => {
      try {
        const foods = await getAllFoods();
        const formattedRecipes = foods.map(food => {
          const formatted = formatFoodForDisplay(food);
          
          // Parse cost - extract first number from range like "120-150"
          const costStr = formatted.cost.replace(/[^\d.-]/g, '');
          const costValue = costStr.includes('-') 
            ? parseFloat(costStr.split('-')[0]) 
            : parseFloat(costStr) || 0;
          
          return {
            id: formatted.id,
            title: formatted.name,
            image: formatted.imageUrl,
            nutrition: {
              calories: formatted.caloriesRaw || 0,
              protein: formatted.proteinRaw || 0,
              carbs: formatted.carbsRaw || 0,
              fat: formatted.fatRaw || 0,
              fiber: formatted.fiberRaw || 0,
              sugar: formatted.sugarRaw || 0,
              sodium: formatted.sodiumRaw || 0,
              cholesterol: formatted.cholesterolRaw || 0
            },
            prepTime: parseInt(formatted.prepTime) || 30,
            prepTimeRaw: formatted.prepTime,
            costPerServing: costValue,
            costDisplay: formatted.cost,
            rating: parseFloat(formatted.popularityScore) || 4,
            roleFit: formatted.roleFit ? formatted.roleFit.toLowerCase().split(',').map(r => r.trim()) : [],
            proteinType: formatted.tags.some(t => t.toLowerCase().includes('vegetarian')) ? 'vegetarian' : 
                        formatted.tags.some(t => t.toLowerCase().includes('vegan')) ? 'vegan' : 
                        formatted.ingredients.some(i => i.toLowerCase().includes('chicken')) ? 'chicken' :
                        formatted.ingredients.some(i => i.toLowerCase().includes('pork')) ? 'pork' :
                        formatted.ingredients.some(i => i.toLowerCase().includes('beef')) ? 'beef' :
                        formatted.ingredients.some(i => i.toLowerCase().includes('fish') || i.toLowerCase().includes('tuna') || i.toLowerCase().includes('salmon')) ? 'fish' : 'all',
            tags: formatted.tags,
            servings: formatted.servings
          };
        });
        
        console.log('Total recipes loaded:', formattedRecipes.length);
        console.log('Sample protein values:', formattedRecipes.slice(0, 10).map(r => ({ name: r.title, protein: r.nutrition.protein })));
        
        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [recipes, setLoading]);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    console.log('Filtering recipes. Total recipes:', recipes?.length);
    console.log('Active filters:', filters);
    
    let filtered = recipes?.filter(recipe => {
      // Role Fit filter (checkboxes)
      if (filters?.roleFit?.length > 0) {
        const hasMatchingRole = filters.roleFit.some(selectedRole => {
          const selected = selectedRole.toLowerCase().trim().replace(/\s+/g, ' ');
          
          // Check if any of the recipe's role fit values match
          return recipe.roleFit.some(recipeRole => {
            const role = recipeRole.toLowerCase().trim().replace(/\s+/g, ' ');
            
            // Normalize variations: "body builder" and "bodybuilder" should match
            const normalizeRole = (r) => r.replace(/\s+/g, '');
            const normalizedRole = normalizeRole(role);
            const normalizedSelected = normalizeRole(selected);
            
            // Multiple matching strategies:
            // 1. Exact match
            // 2. Normalized match (without spaces)
            // 3. Contains match (for plurals like "student" matches "students")
            // 4. Word-based match (any word in role matches selected)
            const exactMatch = role === selected;
            const normalizedMatch = normalizedRole === normalizedSelected || 
                                   normalizedRole.includes(normalizedSelected) ||
                                   normalizedSelected.includes(normalizedRole);
            const containsMatch = role.includes(selected) || selected.includes(role);
            
            return exactMatch || normalizedMatch || containsMatch;
          });
        });
        
        if (!hasMatchingRole) {
          return false;
        }
      }

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

    console.log('Filtered recipes count:', filtered?.length);

    // Apply sorting/filtering based on selection
    switch (sortBy) {
      case 'cheapest':
        filtered?.sort((a, b) => a?.costPerServing - b?.costPerServing);
        break;
      case 'quickest':
        filtered?.sort((a, b) => a?.prepTime - b?.prepTime);
        break;
      case 'high-protein':
        // Filter to show ONLY high protein foods (> 10g)
        filtered = filtered?.filter(recipe => {
          const proteinValue = parseFloat(recipe?.nutrition?.protein) || 0;
          console.log('Recipe:', recipe.title, 'Protein:', recipe?.nutrition?.protein, 'Parsed:', proteinValue);
          return proteinValue > 10;
        });
        // Then sort by protein descending
        filtered?.sort((a, b) => {
          const proteinA = parseFloat(a?.nutrition?.protein) || 0;
          const proteinB = parseFloat(b?.nutrition?.protein) || 0;
          return proteinB - proteinA;
        });
        break;
      case 'highest-rated':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'recommended':
      default:
        // Keep original order or sort by popularity
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
    }

    return filtered;
  }, [recipes, filters, sortBy]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.protein !== 'all') count++;
    if (filters?.costRange?.[0] > 0 || filters?.costRange?.[1] < 200) count++;
    if (filters?.prepTime !== 'all') count++;
    if (filters?.roleFit?.length > 0) count++;
    if (filters?.search) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
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
                activeFilterCount={getActiveFilterCount()}
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