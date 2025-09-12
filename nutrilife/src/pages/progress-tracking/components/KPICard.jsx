import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, trend, trendValue, icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center justify-center w-10 h-10 bg-${color}/10 rounded-lg`}>
          <Icon name={icon} size={20} className={`text-${color}`} />
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span className="text-sm font-medium">{trendValue}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground font-body">
          {title}
        </h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
            {value}
          </span>
          <span className="text-sm text-muted-foreground font-caption">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;