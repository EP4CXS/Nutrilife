import React from 'react';
import RecipeCard from './RecipeCard';
import Icon from '../../../components/AppIcon';

const RecipeGrid = ({ recipes, viewMode, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="animate-spin">
            <Icon name="Loader2" size={20} />
          </div>
          <span className="font-body">Loading recipes...</span>
        </div>
      </div>
    );
  }

  if (recipes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
          No recipes found
        </h3>
        <p className="text-muted-foreground font-body max-w-md">
          Try adjusting your filters or search terms to find more recipes that match your preferences.
        </p>
      </div>
    );
  }

  const gridClasses = viewMode === 'list' ?'space-y-4' :'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

  return (
    <div className={gridClasses}>
      {recipes?.map((recipe) => (
        <RecipeCard
          key={recipe?.id}
          recipe={recipe}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;