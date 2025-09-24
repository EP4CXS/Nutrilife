import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose, 
  recipeCount = 0 
}) => {
  const proteinOptions = [
    { value: 'all', label: 'All Proteins' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'beef', label: 'Beef' },
    { value: 'fish', label: 'Fish' },
    { value: 'pork', label: 'Pork' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' }
  ];

  const prepTimeOptions = [
    { value: 'all', label: 'Any Time' },
    { value: '15', label: 'Under 15 min' },
    { value: '30', label: 'Under 30 min' },
    { value: '45', label: 'Under 45 min' },
    { value: '60', label: 'Under 1 hour' }
  ];

  const roleFitOptions = [
    { value: 'student', label: 'Student' },
    { value: 'bodybuilder', label: 'Bodybuilder' },
    { value: 'office-worker', label: 'Office Worker' },
    { value: 'senior', label: 'Senior Citizen' },
    { value: 'family', label: 'Family' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleRoleFitChange = (role, checked) => {
    const updatedRoles = checked
      ? [...filters?.roleFit, role]
      : filters?.roleFit?.filter(r => r !== role);
    
    handleFilterChange('roleFit', updatedRoles);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      protein: 'all',
      costRange: [0, 50],
      prepTime: 'all',
      roleFit: [],
      search: ''
    });
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters?.protein !== 'all') count++;
    if (filters?.costRange?.[0] > 0 || filters?.costRange?.[1] < 50) count++;
    if (filters?.prepTime !== 'all') count++;
    if (filters?.roleFit?.length > 0) count++;
    if (filters?.search) count++;
    return count;
  };

  const panelContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Filter Recipes
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            {recipeCount} recipes found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <Input
          label="Search Recipes"
          type="search"
          placeholder="Search by ingredients or recipe name..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
        />
      </div>

      {/* Protein Type */}
      <div>
        <Select
          label="Protein Type"
          options={proteinOptions}
          value={filters?.protein}
          onChange={(value) => handleFilterChange('protein', value)}
        />
      </div>

      {/* Cost Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2 font-body">
          Cost Range: ${filters?.costRange?.[0]} - ${filters?.costRange?.[1]}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="50"
            value={filters?.costRange?.[0]}
            onChange={(e) => handleFilterChange('costRange', [parseInt(e?.target?.value), filters?.costRange?.[1]])}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="50"
            value={filters?.costRange?.[1]}
            onChange={(e) => handleFilterChange('costRange', [filters?.costRange?.[0], parseInt(e?.target?.value)])}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Prep Time */}
      <div>
        <Select
          label="Preparation Time"
          options={prepTimeOptions}
          value={filters?.prepTime}
          onChange={(value) => handleFilterChange('prepTime', value)}
        />
      </div>

      {/* Role Fit */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3 font-body">
          Role Fit
        </label>
        <div className="space-y-2">
          {roleFitOptions?.map((role) => (
            <Checkbox
              key={role?.value}
              label={role?.label}
              checked={filters?.roleFit?.includes(role?.value)}
              onChange={(e) => handleRoleFitChange(role?.value, e?.target?.checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile slide-out panel
  if (isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
        
        {/* Panel */}
        <div className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-50 overflow-y-auto lg:hidden">
          <div className="p-6">
            {panelContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:block w-80 bg-card border border-border rounded-lg p-6 h-fit sticky top-6">
      {panelContent}
    </div>
  );
};

export default FilterPanel;