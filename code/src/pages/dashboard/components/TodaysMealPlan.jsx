import React from 'react';
import MealCard from './MealCard';
import Icon from '../../../components/AppIcon';

const TodaysMealPlan = ({ meals, onLogMeal }) => {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  
  const getMealsByType = (type) => {
    return meals?.filter(meal => meal?.type?.toLowerCase() === type?.toLowerCase());
  };

  const getTotalNutrition = () => {
    return meals?.reduce((total, meal) => ({
      calories: total?.calories + meal?.calories,
      protein: total?.protein + meal?.protein,
      cost: total?.cost + meal?.cost
    }), { calories: 0, protein: 0, cost: 0 });
  };

  const totalNutrition = getTotalNutrition();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Today's Meal Plan
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            {new Date()?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-foreground font-body">
              {totalNutrition?.calories}
            </p>
            <p className="text-muted-foreground font-caption">Total Calories</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground font-body">
              {totalNutrition?.protein}g
            </p>
            <p className="text-muted-foreground font-caption">Total Protein</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-primary font-body">
              ${totalNutrition?.cost?.toFixed(2)}
            </p>
            <p className="text-muted-foreground font-caption">Total Cost</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {mealTypes?.map((mealType) => {
          const typeMeals = getMealsByType(mealType);
          
          if (typeMeals?.length === 0) {
            return (
              <div key={mealType} className="border border-dashed border-border rounded-lg p-6 text-center">
                <Icon name="Plus" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-body">
                  No {mealType?.toLowerCase()} planned
                </p>
              </div>
            );
          }

          return (
            <div key={mealType}>
              <h4 className="text-md font-semibold text-foreground font-heading mb-3">
                {mealType}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeMeals?.map((meal) => (
                  <MealCard
                    key={meal?.id}
                    meal={meal}
                    onLogMeal={onLogMeal}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysMealPlan;