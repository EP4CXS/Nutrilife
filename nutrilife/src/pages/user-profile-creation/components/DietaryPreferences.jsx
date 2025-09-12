import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const DietaryPreferences = ({ data, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleArrayToggle = (field, item) => {
    const currentArray = data?.[field] || [];
    const newArray = currentArray?.includes(item)
      ? currentArray?.filter(i => i !== item)
      : [...currentArray, item];
    onUpdate({ [field]: newArray });
  };

  const cookingSkillOptions = [
    { value: '', label: 'Select Cooking Skill Level' },
    { value: 'beginner', label: 'Beginner (Simple recipes, basic techniques)' },
    { value: 'intermediate', label: 'Intermediate (Comfortable with most techniques)' },
    { value: 'advanced', label: 'Advanced (Experienced with complex recipes)' },
    { value: 'expert', label: 'Expert (Professional level skills)' }
  ];

  const mealPrepTimeOptions = [
    { value: '', label: 'Select Meal Preparation Time' },
    { value: '15-min', label: '15 minutes or less' },
    { value: '30-min', label: '30 minutes or less' },
    { value: '45-min', label: '45 minutes or less' },
    { value: '60-min', label: '1 hour or less' },
    { value: 'no-limit', label: 'No time limit' }
  ];

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 
    'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Low-Fat', 'Whole30'
  ];

  const commonAllergies = [
    'Nuts', 'Peanuts', 'Shellfish', 'Fish', 'Eggs', 
    'Milk', 'Soy', 'Wheat', 'Sesame', 'Sulphites'
  ];

  const cuisineTypes = [
    'American', 'Mediterranean', 'Asian', 'Mexican', 'Italian', 
    'Indian', 'Middle Eastern', 'French', 'Thai', 'Japanese'
  ];

  return (
    <div className="space-y-6">
      {/* Cooking Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Cooking Skill Level"
          value={data?.cookingSkillLevel || ''}
          onChange={(value) => handleChange('cookingSkillLevel', value)}
          options={cookingSkillOptions}
          required
        />
        <Select
          label="Preferred Meal Prep Time"
          value={data?.mealPreparationTime || ''}
          onChange={(value) => handleChange('mealPreparationTime', value)}
          options={mealPrepTimeOptions}
          required
        />
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-3">
          Dietary Restrictions (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dietaryRestrictions?.map(restriction => (
            <Checkbox
              key={restriction}
              id={`restriction-${restriction}`}
              label={restriction}
              checked={data?.dietaryRestrictions?.includes(restriction)}
              onChange={() => handleArrayToggle('dietaryRestrictions', restriction)}
            />
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-3">
          Food Allergies (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonAllergies?.map(allergy => (
            <Checkbox
              key={allergy}
              id={`allergy-${allergy}`}
              label={allergy}
              checked={data?.allergies?.includes(allergy)}
              onChange={() => handleArrayToggle('allergies', allergy)}
            />
          ))}
        </div>
      </div>

      {/* Cuisine Preferences */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-3">
          Preferred Cuisines (Select your favorites)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cuisineTypes?.map(cuisine => (
            <Checkbox
              key={cuisine}
              id={`cuisine-${cuisine}`}
              label={cuisine}
              checked={data?.cuisinePreferences?.includes(cuisine)}
              onChange={() => handleArrayToggle('cuisinePreferences', cuisine)}
            />
          ))}
        </div>
      </div>

      {/* Additional Preferences */}
      <Input
        label="Foods you dislike (Optional)"
        value={data?.dislikedFoods?.join(', ') || ''}
        onChange={(e) => handleChange('dislikedFoods', e?.target?.value?.split(',')?.map(item => item?.trim())?.filter(Boolean))}
        placeholder="e.g. mushrooms, olives, spicy food"
      />

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground font-body mb-2">
          Customizing Your Experience
        </h4>
        <p className="text-xs text-muted-foreground font-caption">
          Your dietary preferences help us filter recipes and create meal plans that match your lifestyle, restrictions, and taste preferences.
        </p>
      </div>
    </div>
  );
};

export default DietaryPreferences;