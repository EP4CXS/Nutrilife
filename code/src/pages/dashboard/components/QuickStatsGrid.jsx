import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsGrid = ({ stats }) => {
  const statItems = [
    {
      label: 'Meals Logged Today',
      value: `${stats?.mealsLogged}/${stats?.totalMeals}`,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Weekly Adherence',
      value: `${stats?.weeklyAdherence}%`,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Budget Used',
      value: `$${stats?.budgetUsed}/$${stats?.dailyBudget}`,
      icon: 'DollarSign',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Recipes Tried',
      value: stats?.recipesTried,
      icon: 'BookOpen',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground font-heading mb-1">
              {stat?.value}
            </p>
            <p className="text-sm text-muted-foreground font-caption">
              {stat?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;