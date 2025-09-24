import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RecipeCard = ({ recipe, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [actionFeedback, setActionFeedback] = useState('');

  const handleViewDetails = () => {
    navigate(`/recipe-details?id=${recipe?.id}`);
  };

  const handleAddToMealPlan = () => {
    setActionFeedback('Added to meal plan!');
    setTimeout(() => setActionFeedback(''), 2000);
    // Mock functionality - would integrate with meal plan state
  };

  const handleAddToShoppingList = () => {
    setActionFeedback('Added to shopping list!');
    setTimeout(() => setActionFeedback(''), 2000);
    // Mock functionality - would integrate with shopping list state
  };

  const getRoleFitColor = (role) => {
    const colors = {
      'student': 'bg-blue-100 text-blue-800',
      'bodybuilder': 'bg-red-100 text-red-800',
      'office-worker': 'bg-green-100 text-green-800',
      'senior': 'bg-purple-100 text-purple-800',
      'family': 'bg-orange-100 text-orange-800'
    };
    return colors?.[role] || 'bg-gray-100 text-gray-800';
  };

  const formatRoleLabel = (role) => {
    const labels = {
      'student': 'Student',
      'bodybuilder': 'Bodybuilder',
      'office-worker': 'Office Worker',
      'senior': 'Senior',
      'family': 'Family'
    };
    return labels?.[role] || role;
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
        {actionFeedback && (
          <div className="mb-3 p-2 bg-success/10 text-success text-sm rounded-md font-caption">
            {actionFeedback}
          </div>
        )}
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={recipe?.image}
              alt={recipe?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground font-heading truncate">
                {recipe?.title}
              </h3>
              <div className="flex items-center space-x-1 text-warning ml-2">
                <Icon name="Star" size={16} className="fill-current" />
                <span className="text-sm font-medium font-caption">{recipe?.rating}</span>
              </div>
            </div>

            {/* Nutrition info */}
            <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
              <div>
                <span className="text-muted-foreground font-caption">Calories</span>
                <p className="font-medium text-foreground font-body">{recipe?.nutrition?.calories}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-caption">Protein</span>
                <p className="font-medium text-foreground font-body">{recipe?.nutrition?.protein}g</p>
              </div>
              <div>
                <span className="text-muted-foreground font-caption">Time</span>
                <p className="font-medium text-foreground font-body">{recipe?.prepTime}min</p>
              </div>
              <div>
                <span className="text-muted-foreground font-caption">Cost</span>
                <p className="font-medium text-foreground font-body">${recipe?.costPerServing}</p>
              </div>
            </div>

            {/* Tags and actions */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {recipe?.roleFit?.slice(0, 2)?.map((role) => (
                  <span
                    key={role}
                    className={`px-2 py-1 text-xs rounded-full font-caption ${getRoleFitColor(role)}`}
                  >
                    {formatRoleLabel(role)}
                  </span>
                ))}
                {recipe?.roleFit?.length > 2 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-caption">
                    +{recipe?.roleFit?.length - 2}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddToMealPlan}
                  iconName="Calendar"
                  iconSize={14}
                >
                  Plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddToShoppingList}
                  iconName="ShoppingCart"
                  iconSize={14}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {actionFeedback && (
        <div className="p-3 bg-success/10 text-success text-sm font-caption">
          {actionFeedback}
        </div>
      )}
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recipe?.image}
          alt={recipe?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Icon name="Star" size={14} className="text-warning fill-current" />
          <span className="text-sm font-medium font-caption">{recipe?.rating}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground font-heading mb-2 line-clamp-2">
          {recipe?.title}
        </h3>

        {/* Nutrition grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-warning" />
            <span className="text-muted-foreground font-caption">
              {recipe?.nutrition?.calories} cal
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Dumbbell" size={16} className="text-primary" />
            <span className="text-muted-foreground font-caption">
              {recipe?.nutrition?.protein}g protein
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground font-caption">
              {recipe?.prepTime} min
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="text-muted-foreground font-caption">
              ${recipe?.costPerServing}
            </span>
          </div>
        </div>

        {/* Role fit tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {recipe?.roleFit?.slice(0, 3)?.map((role) => (
            <span
              key={role}
              className={`px-2 py-1 text-xs rounded-full font-caption ${getRoleFitColor(role)}`}
            >
              {formatRoleLabel(role)}
            </span>
          ))}
          {recipe?.roleFit?.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-caption">
              +{recipe?.roleFit?.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddToMealPlan}
            iconName="Calendar"
            iconSize={14}
            title="Add to meal plan"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToShoppingList}
            iconName="ShoppingCart"
            iconSize={14}
            title="Add to shopping list"
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;