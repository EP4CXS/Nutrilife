import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const BudgetSettings = ({ data, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const budgetPriorityOptions = [
    { value: '', label: 'Select Budget Priority' },
    { value: 'lowest-cost', label: 'Lowest Cost (Focus on savings)' },
    { value: 'balanced', label: 'Balanced (Cost vs Quality)' },
    { value: 'quality-first', label: 'Quality First (Premium ingredients)' },
    { value: 'convenience', label: 'Convenience (Time-saving options)' }
  ];

  const shoppingPreferenceOptions = [
    { value: '', label: 'Select Shopping Preference' },
    { value: 'grocery-store', label: 'Traditional Grocery Store' },
    { value: 'bulk-warehouse', label: 'Warehouse/Bulk Shopping' },
    { value: 'farmers-market', label: 'Farmers Market/Local' },
    { value: 'online-delivery', label: 'Online Grocery Delivery' },
    { value: 'mixed', label: 'Mix of Different Sources' }
  ];

  const calculateDailyBudget = () => {
    if (data?.weeklyBudget) {
      return (parseFloat(data?.weeklyBudget) / 7)?.toFixed(2);
    }
    return '0.00';
  };

  const getBudgetRecommendations = () => {
    const budget = parseFloat(data?.weeklyBudget) || 0;
    
    if (budget < 50) {
      return {
        category: 'Budget-Conscious',
        tips: [
          'Focus on rice, beans, and seasonal vegetables',
          'Buy in bulk and cook in batches',
          'Use generic/store brands when possible',
          'Plan meals around sales and discounts'
        ]
      };
    } else if (budget < 100) {
      return {
        category: 'Moderate Budget',
        tips: [
          'Mix of protein sources including chicken and fish',
          'Include some organic produce',
          'Explore international cuisines with affordable ingredients',
          'Plan for both fresh and frozen options'
        ]
      };
    } else {
      return {
        category: 'Flexible Budget',
        tips: [
          'Premium protein sources like wild-caught fish',
          'Organic and locally-sourced ingredients',
          'Specialty items and gourmet ingredients',
          'Focus on quality and variety over cost'
        ]
      };
    }
  };

  const recommendations = data?.weeklyBudget ? getBudgetRecommendations() : null;

  return (
    <div className="space-y-6">
      {/* Weekly Budget */}
      <div>
        <label className="block text-sm font-medium text-foreground font-body mb-2">
          Weekly Meal Budget
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            value={data?.weeklyBudget || ''}
            onChange={(e) => handleChange('weeklyBudget', e?.target?.value)}
            placeholder="0.00"
            min="20"
            max="1000"
            step="5"
            className="pl-8"
            required
          />
        </div>
        {data?.weeklyBudget && (
          <p className="text-sm text-muted-foreground font-caption mt-1">
            Daily average: ${calculateDailyBudget()}
          </p>
        )}
      </div>

      {/* Budget Priority */}
      <Select
        label="Budget Priority"
        value={data?.budgetPriority || ''}
        onChange={(value) => handleChange('budgetPriority', value)}
        options={budgetPriorityOptions}
        required
      />

      {/* Shopping Preference */}
      <Select
        label="Preferred Shopping Method"
        value={data?.shoppingPreference || ''}
        onChange={(value) => handleChange('shoppingPreference', value)}
        options={shoppingPreferenceOptions}
      />

      {/* Organic Preference */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="organic-preference"
          checked={data?.organicPreference || false}
          onChange={(checked) => handleChange('organicPreference', checked)}
        />
        <label htmlFor="organic-preference" className="text-sm font-medium text-foreground font-body">
          I prefer organic ingredients when possible
        </label>
      </div>

      {/* Budget Recommendations */}
      {recommendations && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground font-body mb-2">
            Budget Category: {recommendations?.category}
          </h4>
          <p className="text-xs text-muted-foreground font-caption mb-3">
            Based on your budget, here are some meal planning tips:
          </p>
          <ul className="text-xs text-muted-foreground font-caption space-y-1">
            {recommendations?.tips?.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Budget Breakdown Examples */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground font-body mb-3">
          Example Weekly Budget Breakdown
        </h4>
        <div className="space-y-2 text-xs font-caption">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget Meals ($30-50/week):</span>
            <span className="text-foreground">Rice, beans, seasonal vegetables</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Moderate Meals ($50-100/week):</span>
            <span className="text-foreground">Chicken, fish, mix of fresh/frozen</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Premium Meals ($100+/week):</span>
            <span className="text-foreground">Organic, specialty, gourmet ingredients</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground font-body mb-2">
          Optimizing Your Food Budget
        </h4>
        <p className="text-xs text-muted-foreground font-caption">
          We'll help you create cost-effective meal plans that fit your budget while meeting your nutritional goals. Our recipes include cost-per-serving estimates to help you stay on track.
        </p>
      </div>
    </div>
  );
};

export default BudgetSettings;