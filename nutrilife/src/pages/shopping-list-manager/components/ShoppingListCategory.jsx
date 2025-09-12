import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ShoppingListCategory = ({ 
  category, 
  items, 
  onItemToggle, 
  onItemRemove, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const completedItems = items?.filter(item => item?.completed)?.length;
  const totalItems = items?.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      produce: 'Apple',
      proteins: 'Beef',
      dairy: 'Milk',
      pantry: 'Package',
      frozen: 'Snowflake',
      beverages: 'Coffee',
      snacks: 'Cookie',
      other: 'ShoppingBag'
    };
    return iconMap?.[categoryId] || 'ShoppingBag';
  };

  const formatQuantity = (quantity, unit) => {
    if (quantity === 1 && unit === 'pieces') {
      return '1';
    }
    return `${quantity} ${unit}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-4">
      {/* Category Header */}
      <div 
        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <Icon name={getCategoryIcon(category?.id)} size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground font-heading">
              {category?.name}
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              {completedItems} of {totalItems} items • {completionPercentage}% complete
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 relative">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current"
                strokeWidth="4"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <Icon 
            name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>
      </div>
      {/* Category Items */}
      {!isCollapsed && (
        <div className="divide-y divide-border">
          {items?.map((item) => (
            <div
              key={item?.id}
              className={`flex items-center justify-between p-4 transition-all duration-150 ${
                item?.completed ? 'bg-muted/20 opacity-60' : 'hover:bg-muted/10'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Checkbox
                  checked={item?.completed}
                  onChange={(e) => onItemToggle(item?.id, e?.target?.checked)}
                  size="lg"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium font-body truncate ${
                      item?.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>
                      {item?.name}
                    </h4>
                    {item?.isManual && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        Custom
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground font-caption">
                      {formatQuantity(item?.quantity, item?.unit)}
                    </span>
                    {item?.estimatedCost > 0 && (
                      <span className="text-sm font-medium text-foreground font-body">
                        ${item?.estimatedCost?.toFixed(2)}
                      </span>
                    )}
                    {item?.recipes && item?.recipes?.length > 0 && (
                      <span className="text-xs text-muted-foreground font-caption">
                        Used in {item?.recipes?.length} recipe{item?.recipes?.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Item Actions */}
              <div className="flex items-center space-x-2 ml-3">
                {item?.isManual && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onItemRemove(item?.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingListCategory;