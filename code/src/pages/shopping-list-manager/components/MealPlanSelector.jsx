import React from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const MealPlanSelector = ({ 
  availableDays, 
  selectedDays, 
  onDayToggle, 
  onGenerateList, 
  isGenerating 
}) => {
  const allSelected = selectedDays?.length === availableDays?.length;
  const someSelected = selectedDays?.length > 0 && selectedDays?.length < availableDays?.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onDayToggle([]);
    } else {
      onDayToggle(availableDays?.map(day => day?.id));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground font-heading">
          Generate from Meal Plans
        </h2>
        <Icon name="Calendar" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {/* Select All Checkbox */}
        <div className="pb-2 border-b border-border">
          <Checkbox
            label="Select All Days"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={handleSelectAll}
            className="font-medium"
          />
        </div>

        {/* Day Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {availableDays?.map((day) => (
            <div
              key={day?.id}
              className={`p-3 rounded-lg border transition-all duration-150 ${
                selectedDays?.includes(day?.id)
                  ? 'border-primary bg-primary/5' :'border-border bg-muted/30'
              }`}
            >
              <Checkbox
                label={day?.name}
                description={`${day?.mealCount} meals • $${day?.estimatedCost?.toFixed(2)}`}
                checked={selectedDays?.includes(day?.id)}
                onChange={() => {
                  if (selectedDays?.includes(day?.id)) {
                    onDayToggle(selectedDays?.filter(id => id !== day?.id));
                  } else {
                    onDayToggle([...selectedDays, day?.id]);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={onGenerateList}
            loading={isGenerating}
            disabled={selectedDays?.length === 0}
            iconName="ShoppingCart"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            {isGenerating ? 'Generating List...' : `Generate List (${selectedDays?.length} days)`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanSelector;