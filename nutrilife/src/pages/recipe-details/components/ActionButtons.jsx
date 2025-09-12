import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionButtons = ({ recipe, onAddToPlan, onAddToShoppingList, onSaveToFavorites }) => {
  const [isAddingToPlan, setIsAddingToPlan] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [selectedMeal, setSelectedMeal] = useState('lunch');

  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast', icon: 'Coffee' },
    { value: 'lunch', label: 'Lunch', icon: 'Sun' },
    { value: 'dinner', label: 'Dinner', icon: 'Moon' },
    { value: 'snack', label: 'Snack', icon: 'Cookie' }
  ];

  const handleAddToPlan = async () => {
    if (!showDatePicker) {
      setShowDatePicker(true);
      return;
    }

    setIsAddingToPlan(true);
    try {
      await onAddToPlan({
        recipe,
        date: selectedDate,
        meal: selectedMeal
      });
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error adding to plan:', error);
    } finally {
      setIsAddingToPlan(false);
    }
  };

  const handleAddToShoppingList = async () => {
    setIsAddingToList(true);
    try {
      await onAddToShoppingList(recipe?.ingredients);
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    } finally {
      setIsAddingToList(false);
    }
  };

  const handleSaveToFavorites = async () => {
    setIsSaving(true);
    try {
      await onSaveToFavorites(recipe);
    } catch (error) {
      console.error('Error saving to favorites:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalCost = () => {
    return (recipe?.costPerServing * recipe?.servings)?.toFixed(2);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Zap" size={24} className="text-accent" />
        <h2 className="text-xl font-semibold text-foreground font-heading">
          Quick Actions
        </h2>
      </div>
      {/* Recipe Summary */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground font-caption">Total Cost</p>
            <p className="text-lg font-semibold text-success font-mono">${getTotalCost()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-caption">Prep Time</p>
            <p className="text-lg font-semibold text-foreground font-mono">{recipe?.prepTime}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-caption">Servings</p>
            <p className="text-lg font-semibold text-foreground font-mono">{recipe?.servings}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-caption">Calories</p>
            <p className="text-lg font-semibold text-foreground font-mono">{recipe?.nutrition?.calories}</p>
          </div>
        </div>
      </div>
      {/* Date and Meal Selection */}
      {showDatePicker && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-foreground font-body mb-3">
            Add to Meal Plan
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground font-caption mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-muted-foreground font-caption mb-2">
                Select Meal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealOptions?.map((meal) => (
                  <button
                    key={meal?.value}
                    onClick={() => setSelectedMeal(meal?.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedMeal === meal?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name={meal?.icon} size={16} />
                    <span className="font-body">{meal?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          onClick={handleAddToPlan}
          loading={isAddingToPlan}
          iconName={showDatePicker ? "Calendar" : "Plus"}
          iconPosition="left"
          className="w-full touch-target"
        >
          {showDatePicker ? "Confirm Add to Plan" : "Add to Meal Plan"}
        </Button>

        {showDatePicker && (
          <Button
            variant="outline"
            onClick={() => setShowDatePicker(false)}
            iconName="X"
            iconPosition="left"
            className="w-full"
          >
            Cancel
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={handleAddToShoppingList}
            loading={isAddingToList}
            iconName="ShoppingCart"
            iconPosition="left"
            className="touch-target"
          >
            Add to Shopping List
          </Button>

          <Button
            variant="outline"
            onClick={handleSaveToFavorites}
            loading={isSaving}
            iconName="Heart"
            iconPosition="left"
            className="touch-target"
          >
            Save to Favorites
          </Button>
        </div>
      </div>
      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground font-caption">
            <p className="mb-1">
              Adding to meal plan will automatically calculate nutritional values for your daily goals.
            </p>
            <p>
              Shopping list items will be organized by category for easier grocery shopping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;