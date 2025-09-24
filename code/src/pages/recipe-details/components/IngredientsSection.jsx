import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IngredientsSection = ({ ingredients, servings, onAddToShoppingList }) => {
  const [selectedServings, setSelectedServings] = useState(servings);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const adjustQuantity = (originalQuantity, originalServings, newServings) => {
    const ratio = newServings / originalServings;
    const adjustedQuantity = originalQuantity * ratio;
    
    // Round to reasonable decimal places
    if (adjustedQuantity < 1) {
      return Math.round(adjustedQuantity * 100) / 100;
    } else if (adjustedQuantity < 10) {
      return Math.round(adjustedQuantity * 10) / 10;
    } else {
      return Math.round(adjustedQuantity);
    }
  };

  const handleServingChange = (change) => {
    const newServings = Math.max(1, selectedServings + change);
    setSelectedServings(newServings);
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev?.[index]
    }));
  };

  const handleAddAllToShoppingList = () => {
    const adjustedIngredients = ingredients?.map(ingredient => ({
      ...ingredient,
      quantity: adjustQuantity(ingredient?.quantity, servings, selectedServings)
    }));
    onAddToShoppingList(adjustedIngredients);
  };

  const handleAddSelectedToShoppingList = () => {
    const selectedIngredients = ingredients?.filter((_, index) => checkedIngredients?.[index])?.map(ingredient => ({
        ...ingredient,
        quantity: adjustQuantity(ingredient?.quantity, servings, selectedServings)
      }));
    
    if (selectedIngredients?.length > 0) {
      onAddToShoppingList(selectedIngredients);
    }
  };

  const selectedCount = Object.values(checkedIngredients)?.filter(Boolean)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="ShoppingCart" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Ingredients
          </h2>
        </div>
        
        {/* Serving Size Adjuster */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground font-caption">Servings:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleServingChange(-1)}
              disabled={selectedServings <= 1}
              className="w-8 h-8"
            >
              <Icon name="Minus" size={16} />
            </Button>
            <span className="text-lg font-semibold text-foreground font-mono w-8 text-center">
              {selectedServings}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleServingChange(1)}
              className="w-8 h-8"
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Ingredients List */}
      <div className="space-y-3 mb-6">
        {ingredients?.map((ingredient, index) => {
          const adjustedQuantity = adjustQuantity(ingredient?.quantity, servings, selectedServings);
          const isChecked = checkedIngredients?.[index] || false;
          
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                isChecked 
                  ? 'bg-primary/5 border-primary/20' :'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <button
                onClick={() => toggleIngredient(index)}
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                  isChecked
                    ? 'bg-primary border-primary' :'border-muted-foreground hover:border-primary'
                }`}
              >
                {isChecked && (
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium font-body ${
                    isChecked ? 'text-primary' : 'text-foreground'
                  }`}>
                    {ingredient?.name}
                  </span>
                  <span className={`text-sm font-mono ${
                    isChecked ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {adjustedQuantity} {ingredient?.unit}
                  </span>
                </div>
                {ingredient?.notes && (
                  <p className="text-xs text-muted-foreground font-caption mt-1">
                    {ingredient?.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleAddAllToShoppingList}
          iconName="ShoppingCart"
          iconPosition="left"
          className="flex-1"
        >
          Add All to Shopping List
        </Button>
        
        {selectedCount > 0 && (
          <Button
            variant="default"
            onClick={handleAddSelectedToShoppingList}
            iconName="Plus"
            iconPosition="left"
            className="flex-1"
          >
            Add Selected ({selectedCount}) to List
          </Button>
        )}
      </div>
      {selectedCount > 0 && (
        <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-body">
            <Icon name="Info" size={16} className="inline mr-1" />
            {selectedCount} ingredient{selectedCount !== 1 ? 's' : ''} selected for shopping list
          </p>
        </div>
      )}
    </div>
  );
};

export default IngredientsSection;