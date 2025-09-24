import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ShoppingListHeader = ({ 
  totalItems, 
  completedItems, 
  totalCost, 
  onExportCSV, 
  onClearCompleted, 
  onResetList 
}) => {
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Icon name="ShoppingCart" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-heading">
                Shopping List
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                {completedItems} of {totalItems} items completed ({completionPercentage}%)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground font-heading">
                ${totalCost?.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground font-caption">
                Total Cost
              </p>
            </div>
            
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary stroke-current"
                  strokeWidth="3"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-foreground font-heading">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            iconName="Download"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Export CSV
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearCompleted}
            iconName="Trash2"
            iconPosition="left"
            disabled={completedItems === 0}
            className="flex-1 sm:flex-none"
          >
            Clear Done
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onResetList}
            iconName="RotateCcw"
            iconPosition="left"
            disabled={totalItems === 0}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListHeader;