import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SortControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  onFilterToggle,
  activeFilterCount = 0 
}) => {
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'cheapest', label: 'Cheapest First' },
    { value: 'quickest', label: 'Quickest First' },
    { value: 'highest-protein', label: 'Highest Protein' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const viewModeOptions = [
    { value: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { value: 'list', icon: 'List', label: 'List View' }
  ];

  return (
    <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
      {/* Left side - Filter toggle (mobile) and sort */}
      <div className="flex items-center gap-3">
        {/* Mobile filter toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterToggle}
          className="lg:hidden relative"
          iconName="Filter"
          iconPosition="left"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Sort dropdown */}
        <div className="min-w-[200px]">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by..."
          />
        </div>
      </div>
      {/* Right side - View mode toggle */}
      <div className="flex items-center bg-muted rounded-lg p-1">
        {viewModeOptions?.map((option) => (
          <Button
            key={option?.value}
            variant={viewMode === option?.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(option?.value)}
            className="px-3"
            title={option?.label}
          >
            <Icon name={option?.icon} size={16} />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;