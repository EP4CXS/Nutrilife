import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import RecipeSelectionModal from './RecipeSelectionModal';

const MealSlot = ({ mealType, meal, dayIndex, onReplace, onRemove, isMobile = false }) => {
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const handleReplaceClick = () => {
    setShowRecipeModal(true);
  };

  const handleRecipeSelect = (recipe) => {
    onReplace(dayIndex, mealType?.key, recipe);
    setShowRecipeModal(false);
  };

  const handleRemove = () => {
    onRemove(dayIndex, mealType?.key);
  };

  if (!meal) {
    return (
      <div className={`p-3 h-full flex flex-col justify-center ${isMobile ? 'bg-muted/30 rounded-lg' : ''}`}>
        <div className="text-center">
          <Icon name={mealType?.icon} size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground mb-1 font-body">
            {mealType?.label}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplaceClick}
            iconName="Plus"
            iconPosition="left"
            className="text-xs"
          >
            Add Meal
          </Button>
        </div>
        {showRecipeModal && (
          <RecipeSelectionModal
            mealType={mealType?.key}
            onSelect={handleRecipeSelect}
            onClose={() => setShowRecipeModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`p-3 h-full ${isMobile ? 'bg-card border border-border rounded-lg' : ''}`}>
      <div className="flex items-start space-x-2 mb-2">
        <Icon name={mealType?.icon} size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-1 font-caption">
            {mealType?.label}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReplaceClick}
            className="h-6 w-6"
          >
            <Icon name="RotateCcw" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-6 w-6 text-destructive hover:text-destructive"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Image
            src={meal?.image}
            alt={meal?.title}
            className="w-full h-16 object-cover rounded"
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-foreground line-clamp-2 font-body">
            {meal?.title}
          </h4>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground font-caption">
              {meal?.calories} cal
            </span>
            <span className="text-xs text-success font-caption">
              ${meal?.cost}
            </span>
          </div>
        </div>

        {isMobile && (
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-caption">
            <div>P: {meal?.protein}g</div>
            <div>C: {meal?.carbs}g</div>
            <div>F: {meal?.fat}g</div>
          </div>
        )}
      </div>
      {showRecipeModal && (
        <RecipeSelectionModal
          mealType={mealType?.key}
          onSelect={handleRecipeSelect}
          onClose={() => setShowRecipeModal(false)}
        />
      )}
    </div>
  );
};

export default MealSlot;