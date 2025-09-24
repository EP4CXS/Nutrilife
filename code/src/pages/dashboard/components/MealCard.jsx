import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MealCard = ({ meal, onLogMeal }) => {
  const [isLogged, setIsLogged] = useState(meal?.logged || false);
  const [logStatus, setLogStatus] = useState(meal?.status || null);

  const handleLogMeal = (status) => {
    setIsLogged(true);
    setLogStatus(status);
    onLogMeal(meal?.id, status);
  };

  const getStatusColor = () => {
    if (!isLogged) return 'text-muted-foreground';
    return logStatus === 'ate' ? 'text-success' : 'text-warning';
  };

  const getStatusIcon = () => {
    if (!isLogged) return 'Clock';
    return logStatus === 'ate' ? 'CheckCircle' : 'XCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={meal?.image}
          alt={meal?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium font-caption">
            {meal?.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            <Icon name={getStatusIcon()} size={16} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
          {meal?.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-foreground font-body">
              {meal?.calories}
            </p>
            <p className="text-muted-foreground font-caption">Calories</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground font-body">
              {meal?.protein}g
            </p>
            <p className="text-muted-foreground font-caption">Protein</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-primary font-body">
              ${meal?.cost}
            </p>
            <p className="text-muted-foreground font-caption">Cost</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span className="font-caption">{meal?.prepTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={14}
                className={i < meal?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
              />
            ))}
          </div>
        </div>

        {!isLogged ? (
          <div className="flex space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleLogMeal('ate')}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Ate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogMeal('skipped')}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Skipped
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className={`text-sm font-medium ${getStatusColor()} font-body`}>
              {logStatus === 'ate' ? 'Meal completed!' : 'Meal skipped'}
            </p>
            {logStatus === 'skipped' && (
              <p className="text-xs text-muted-foreground mt-1 font-caption">
                Consider a healthy snack instead
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;