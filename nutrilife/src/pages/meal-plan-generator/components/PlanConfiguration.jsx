import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PlanConfiguration = ({ onGeneratePlan, isGenerating }) => {
  const [planDays, setPlanDays] = useState(7);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    lowCarb: false,
    highProtein: false
  });
  const [targetCalories, setTargetCalories] = useState(2000);
  const [mealTypes, setMealTypes] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: true
  });

  const planDurationOptions = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 5, label: '5 Days' },
    { value: 7, label: '7 Days' }
  ];

  const handleDietaryChange = (preference, checked) => {
    setDietaryPreferences(prev => ({
      ...prev,
      [preference]: checked
    }));
  };

  const handleMealTypeChange = (mealType, checked) => {
    setMealTypes(prev => ({
      ...prev,
      [mealType]: checked
    }));
  };

  const handleGeneratePlan = () => {
    const config = {
      planDays,
      dailyBudget,
      dietaryPreferences,
      targetCalories,
      mealTypes
    };
    onGeneratePlan(config);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground font-heading">
          Plan Configuration
        </h2>
        <Icon name="Settings" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Plan Duration */}
        <div>
          <Select
            label="Plan Duration"
            options={planDurationOptions}
            value={planDays}
            onChange={setPlanDays}
            className="mb-4"
          />
        </div>

        {/* Daily Budget */}
        <div>
          <Input
            label="Daily Budget ($)"
            type="number"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e?.target?.value))}
            min="5"
            max="100"
            step="5"
            className="mb-4"
          />
        </div>

        {/* Target Calories */}
        <div>
          <Input
            label="Target Calories"
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e?.target?.value))}
            min="1200"
            max="4000"
            step="100"
            className="mb-4"
          />
        </div>

        {/* Generate Button */}
        <div className="flex items-end">
          <Button
            variant="default"
            onClick={handleGeneratePlan}
            loading={isGenerating}
            iconName="Sparkles"
            iconPosition="left"
            className="w-full touch-target"
          >
            Generate Plan
          </Button>
        </div>
      </div>
      {/* Dietary Preferences */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground mb-3 font-body">
          Dietary Preferences
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(dietaryPreferences)?.map(([key, value]) => (
            <Checkbox
              key={key}
              label={key?.charAt(0)?.toUpperCase() + key?.slice(1)?.replace(/([A-Z])/g, ' $1')}
              checked={value}
              onChange={(e) => handleDietaryChange(key, e?.target?.checked)}
              size="sm"
            />
          ))}
        </div>
      </div>
      {/* Meal Types */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground mb-3 font-body">
          Include Meals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(mealTypes)?.map(([key, value]) => (
            <Checkbox
              key={key}
              label={key?.charAt(0)?.toUpperCase() + key?.slice(1)}
              checked={value}
              onChange={(e) => handleMealTypeChange(key, e?.target?.checked)}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanConfiguration;