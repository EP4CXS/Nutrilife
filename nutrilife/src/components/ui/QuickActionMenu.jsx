import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const QuickActionMenu = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Browse Recipes',
      icon: 'Search',
      action: () => navigate('/recipe-browser'),
      variant: 'outline',
      description: 'Find new recipes to add to your plan'
    },
    {
      label: 'Generate Plan',
      icon: 'Sparkles',
      action: () => navigate('/meal-plan-generator'),
      variant: 'default',
      description: 'Create a new meal plan'
    },
    {
      label: 'Shopping List',
      icon: 'ShoppingCart',
      action: () => navigate('/shopping-list-manager'),
      variant: 'secondary',
      description: 'View your current shopping list'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground font-heading">
        Quick Actions
      </h3>
      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.label}
            className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg flex-shrink-0">
                <Icon name={action?.icon} size={20} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground font-body mb-1">
                  {action?.label}
                </h4>
                <p className="text-xs text-muted-foreground font-caption mb-3">
                  {action?.description}
                </p>
                <Button
                  variant={action?.variant}
                  size="sm"
                  onClick={action?.action}
                  className="w-full"
                >
                  {action?.label}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        {quickActions?.map((action) => (
          <Button
            key={action?.label}
            variant={action?.variant}
            onClick={action?.action}
            iconName={action?.icon}
            iconPosition="left"
            className="w-full justify-start touch-target"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionMenu;