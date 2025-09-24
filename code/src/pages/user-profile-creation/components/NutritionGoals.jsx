import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const NutritionGoals = ({ data, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleMacroChange = (macro, value) => {
    const newRatios = { ...data?.macroRatios, [macro]: parseInt(value) };
    const total = newRatios?.protein + newRatios?.carbs + newRatios?.fat;
    
    if (total <= 100) {
      onUpdate({ macroRatios: newRatios });
    }
  };

  const handleArrayToggle = (field, item) => {
    const currentArray = data?.[field] || [];
    const newArray = currentArray?.includes(item)
      ? currentArray?.filter(i => i !== item)
      : [...currentArray, item];
    onUpdate({ [field]: newArray });
  };

  const primaryGoalOptions = [
    { value: '', label: 'Select Primary Goal' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'weight-gain', label: 'Weight Gain' },
    { value: 'muscle-gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Weight Maintenance' },
    { value: 'general-health', label: 'General Health & Wellness' },
    { value: 'athletic-performance', label: 'Athletic Performance' }
  ];

  const nutritionalFocusOptions = [
    'High Protein', 'Low Carb', 'Heart Healthy', 'Anti-Inflammatory', 
    'High Fiber', 'Low Sodium', 'Diabetic Friendly', 'Brain Health'
  ];

  const calculateCalories = () => {
    if (!data?.currentWeight || !data?.height || !data?.age || !data?.gender || !data?.activityLevel) {
      return '';
    }

    // Basic BMR calculation using Harris-Benedict equation
    let bmr;
    if (data?.gender === 'male') {
      bmr = 88.362 + (13.397 * (data?.currentWeight * 0.453592)) + (4.799 * (data?.height * 2.54)) - (5.677 * data?.age);
    } else {
      bmr = 447.593 + (9.247 * (data?.currentWeight * 0.453592)) + (3.098 * (data?.height * 2.54)) - (4.330 * data?.age);
    }

    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'extremely-active': 1.9
    };

    const tdee = bmr * (activityMultipliers?.[data?.activityLevel] || 1.2);
    
    // Adjust for goal
    let adjustedCalories = tdee;
    switch (data?.primaryGoal) {
      case 'weight-loss':
        adjustedCalories = tdee - 500; // 1lb per week
        break;
      case 'weight-gain': case'muscle-gain':
        adjustedCalories = tdee + 300;
        break;
      default:
        adjustedCalories = tdee;
    }

    return Math.round(adjustedCalories);
  };

  const suggestedCalories = calculateCalories();
  const macroTotal = (data?.macroRatios?.protein || 0) + (data?.macroRatios?.carbs || 0) + (data?.macroRatios?.fat || 0);

  return (
    <div className="space-y-6">
      {/* Primary Goal */}
      <Select
        label="Primary Health Goal"
        value={data?.primaryGoal || ''}
        onChange={(value) => handleChange('primaryGoal', value)}
        options={primaryGoalOptions}
        required
      />

      {/* Calorie Target */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground font-body">
            Daily Calorie Target
          </label>
          {suggestedCalories && (
            <button
              type="button"
              onClick={() => handleChange('targetCalories', suggestedCalories?.toString())}
              className="text-xs text-primary hover:text-primary/80 font-body"
            >
              Use Suggested: {suggestedCalories} calories
            </button>
          )}
        </div>
        <Input
          type="number"
          value={data?.targetCalories || ''}
          onChange={(e) => handleChange('targetCalories', e?.target?.value)}
          placeholder="Enter daily calorie target"
          min="1200"
          max="4000"
          required
        />
      </div>

      {/* Macro Ratios */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-3">
          Macronutrient Ratios (Total: {macroTotal}%)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-caption mb-1 block">
              Protein %
            </label>
            <Input
              type="number"
              value={data?.macroRatios?.protein || 25}
              onChange={(e) => handleMacroChange('protein', e?.target?.value)}
              min="10"
              max="50"
              className={macroTotal > 100 ? 'border-destructive' : ''}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-caption mb-1 block">
              Carbs %
            </label>
            <Input
              type="number"
              value={data?.macroRatios?.carbs || 45}
              onChange={(e) => handleMacroChange('carbs', e?.target?.value)}
              min="10"
              max="70"
              className={macroTotal > 100 ? 'border-destructive' : ''}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-caption mb-1 block">
              Fat %
            </label>
            <Input
              type="number"
              value={data?.macroRatios?.fat || 30}
              onChange={(e) => handleMacroChange('fat', e?.target?.value)}
              min="15"
              max="60"
              className={macroTotal > 100 ? 'border-destructive' : ''}
            />
          </div>
        </div>
        {macroTotal !== 100 && (
          <p className="text-xs text-destructive font-caption mt-2">
            Macro ratios must total 100%. Current total: {macroTotal}%
          </p>
        )}
      </div>

      {/* Nutritional Focus */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-3">
          Nutritional Focus Areas (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {nutritionalFocusOptions?.map(focus => (
            <Checkbox
              key={focus}
              id={`focus-${focus}`}
              label={focus}
              checked={data?.nutritionalFocus?.includes(focus)}
              onChange={() => handleArrayToggle('nutritionalFocus', focus)}
            />
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground font-body mb-2">
          Understanding Your Goals
        </h4>
        <ul className="text-xs text-muted-foreground font-caption space-y-1">
          <li>• <strong>Weight Loss:</strong> Creates a moderate calorie deficit</li>
          <li>• <strong>Muscle Gain:</strong> Higher protein with slight calorie surplus</li>
          <li>• <strong>Maintenance:</strong> Balanced macros at maintenance calories</li>
          <li>• <strong>General Health:</strong> Focus on nutrient-dense, balanced meals</li>
        </ul>
      </div>
    </div>
  );
};

export default NutritionGoals;