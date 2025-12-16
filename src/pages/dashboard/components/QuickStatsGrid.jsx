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
      label: 'Daily Budget Remaining',
      value: `₱${(stats?.remainingDailyBudget ?? 0)?.toFixed(2)}`,
      icon: null,
      customIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-warning"
        >
          <path d="M6 3v18" />
          <path d="M6 3h9a4 4 0 0 1 0 8H6" />
          <line x1="6" y1="11" x2="16" y2="11" />
        </svg>
      ),
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
              {stat?.customIcon ? (
                stat.customIcon
              ) : (
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              )}
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