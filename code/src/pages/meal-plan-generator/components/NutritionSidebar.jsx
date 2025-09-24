import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NutritionSidebar = ({ mealPlan, planConfig, onExportToShoppingList, onSavePlan }) => {
  // Calculate totals from meal plan
  const calculateTotals = () => {
    if (!mealPlan || mealPlan?.length === 0) {
      return {
        dailyAverage: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, cost: 0 },
        weeklyTotal: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, cost: 0 }
      };
    }

    let weeklyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, cost: 0 };

    mealPlan?.forEach(day => {
      if (day?.meals) {
        Object.values(day?.meals)?.forEach(meal => {
          if (meal) {
            weeklyTotals.calories += meal?.calories || 0;
            weeklyTotals.protein += meal?.protein || 0;
            weeklyTotals.carbs += meal?.carbs || 0;
            weeklyTotals.fat += meal?.fat || 0;
            weeklyTotals.fiber += meal?.fiber || 0;
            weeklyTotals.cost += meal?.cost || 0;
          }
        });
      }
    });

    const dailyAverage = {
      calories: Math.round(weeklyTotals?.calories / mealPlan?.length),
      protein: Math.round(weeklyTotals?.protein / mealPlan?.length),
      carbs: Math.round(weeklyTotals?.carbs / mealPlan?.length),
      fat: Math.round(weeklyTotals?.fat / mealPlan?.length),
      fiber: Math.round(weeklyTotals?.fiber / mealPlan?.length),
      cost: Math.round((weeklyTotals?.cost / mealPlan?.length) * 100) / 100
    };

    return { dailyAverage, weeklyTotal: weeklyTotals };
  };

  const { dailyAverage, weeklyTotal } = calculateTotals();

  // Target values from config
  const targets = {
    calories: planConfig?.targetCalories || 2000,
    protein: Math.round((planConfig?.targetCalories || 2000) * 0.3 / 4), // 30% of calories from protein
    carbs: Math.round((planConfig?.targetCalories || 2000) * 0.4 / 4), // 40% of calories from carbs
    fat: Math.round((planConfig?.targetCalories || 2000) * 0.3 / 9), // 30% of calories from fat
    fiber: 25, // Recommended daily fiber
    cost: planConfig?.dailyBudget || 25
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getProgressColor = (percentage) => {
    if (percentage < 80) return 'text-warning';
    if (percentage > 120) return 'text-destructive';
    return 'text-success';
  };

  const nutritionItems = [
    { key: 'calories', label: 'Calories', unit: 'kcal', icon: 'Zap' },
    { key: 'protein', label: 'Protein', unit: 'g', icon: 'Beef' },
    { key: 'carbs', label: 'Carbs', unit: 'g', icon: 'Wheat' },
    { key: 'fat', label: 'Fat', unit: 'g', icon: 'Droplets' },
    { key: 'fiber', label: 'Fiber', unit: 'g', icon: 'Leaf' },
    { key: 'cost', label: 'Cost', unit: '$', icon: 'DollarSign' }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Nutrition Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Daily Nutrition
          </h3>
          <Icon name="Target" size={20} className="text-muted-foreground" />
        </div>

        <div className="space-y-4">
          {nutritionItems?.map((item) => {
            const current = dailyAverage?.[item?.key];
            const target = targets?.[item?.key];
            const percentage = getProgressPercentage(current, target);
            const colorClass = getProgressColor(percentage);

            return (
              <div key={item?.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground font-body">
                      {item?.label}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${colorClass} font-caption`}>
                    {current}{item?.unit} / {target}{item?.unit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage < 80 ? 'bg-warning' :
                      percentage > 120 ? 'bg-destructive' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Weekly Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Weekly Summary
          </h3>
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-foreground font-heading">
              {Math.round(weeklyTotal?.calories)}
            </p>
            <p className="text-xs text-muted-foreground font-caption">
              Total Calories
            </p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-success font-heading">
              ${Math.round(weeklyTotal?.cost * 100) / 100}
            </p>
            <p className="text-xs text-muted-foreground font-caption">
              Total Cost
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground font-heading">
              {Math.round(weeklyTotal?.protein)}g
            </p>
            <p className="text-xs text-muted-foreground font-caption">Protein</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground font-heading">
              {Math.round(weeklyTotal?.carbs)}g
            </p>
            <p className="text-xs text-muted-foreground font-caption">Carbs</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground font-heading">
              {Math.round(weeklyTotal?.fat)}g
            </p>
            <p className="text-xs text-muted-foreground font-caption">Fat</p>
          </div>
        </div>
      </div>
      {/* Optimization Suggestions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Suggestions
          </h3>
          <Icon name="Lightbulb" size={20} className="text-muted-foreground" />
        </div>

        <div className="space-y-3">
          {dailyAverage?.protein < targets?.protein * 0.8 && (
            <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning font-body">
                  Low Protein
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Consider adding more protein-rich foods to meet your goals.
                </p>
              </div>
            </div>
          )}

          {dailyAverage?.cost > targets?.cost * 1.1 && (
            <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Icon name="DollarSign" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive font-body">
                  Over Budget
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Try selecting more cost-effective recipes to stay within budget.
                </p>
              </div>
            </div>
          )}

          {dailyAverage?.fiber < targets?.fiber * 0.7 && (
            <div className="flex items-start space-x-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Icon name="Leaf" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary font-body">
                  Add More Fiber
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Include more vegetables and whole grains for better nutrition.
                </p>
              </div>
            </div>
          )}

          {dailyAverage?.calories >= targets?.calories * 0.9 && 
           dailyAverage?.calories <= targets?.calories * 1.1 &&
           dailyAverage?.protein >= targets?.protein * 0.9 && (
            <div className="flex items-start space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-success font-body">
                  Great Balance!
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Your meal plan meets your nutritional goals well.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          onClick={onSavePlan}
          iconName="Save"
          iconPosition="left"
          className="w-full touch-target"
        >
          Save Meal Plan
        </Button>
        
        <Button
          variant="secondary"
          onClick={onExportToShoppingList}
          iconName="ShoppingCart"
          iconPosition="left"
          className="w-full touch-target"
        >
          Export to Shopping List
        </Button>
      </div>
    </div>
  );
};

export default NutritionSidebar;