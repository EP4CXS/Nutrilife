import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MealLogHistory = () => {
  const [mealLogs, setMealLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mealLogs');
      const parsed = raw ? JSON.parse(raw) : [];

      // Sort by date descending (most recent first)
      const sorted = parsed.sort((a, b) => (a.date < b.date ? 1 : -1));
      setMealLogs(sorted);

      if (sorted.length > 0) {
        setSelectedDate(sorted[0].date);
      }
    } catch (e) {
      console.error('Failed to load meal logs from storage', e);
      setMealLogs([]);
    }
  }, []);

  const dates = mealLogs?.map(log => log?.date);
  const currentLog = mealLogs?.find(log => log?.date === selectedDate);

  const getStatusIcon = (status) => {
    return status === 'ate' ? 'CheckCircle' : 'XCircle';
  };

  const getStatusColor = (status) => {
    return status === 'ate' ? 'text-success' : 'text-error';
  };

  const calculateDayStats = (meals) => {
    const totalMeals = meals?.length;
    const ateCount = meals?.filter(meal => meal?.status === 'ate')?.length;
    const adherence = Math.round((ateCount / totalMeals) * 100);
    const totalCalories = meals?.filter(meal => meal?.status === 'ate')?.reduce((sum, meal) => sum + meal?.calories, 0);
    
    return { adherence, totalCalories, ateCount, totalMeals };
  };

  const dayStats = currentLog ? calculateDayStats(currentLog?.meals) : null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          Meal Log History
        </h3>
        
        {/* Date Selector */}
        {dates?.length > 0 && (
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-muted-foreground" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e?.target?.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {dates?.map(date => (
                <option key={date} value={date}>
                  {new Date(date)?.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Empty state when no logs */}
      {!currentLog && (
        <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
          <p className="text-sm text-muted-foreground font-body">
            No meal logs yet. Log meals from the dashboard using the "Ate" or "Skipped" buttons.
          </p>
        </div>
      )}
      {/* Day Summary */}
      {dayStats && currentLog && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground font-heading">
              {dayStats?.adherence}%
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Adherence
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground font-heading">
              {dayStats?.totalCalories}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Calories
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground font-heading">
              {dayStats?.ateCount}/{dayStats?.totalMeals}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Meals
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground font-heading">
              {dayStats?.totalMeals - dayStats?.ateCount}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Skipped
            </div>
          </div>
        </div>
      )}
      {/* Meal List */}
      {currentLog && (
      <div className="space-y-3">
        {currentLog?.meals?.map((meal) => (
          <div
            key={meal?.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(meal?.status)}`}>
                <Icon name={getStatusIcon(meal?.status)} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground font-body">
                    {meal?.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    meal?.status === 'ate' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                  }`}>
                    {meal?.status === 'ate' ? 'Completed' : 'Skipped'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-caption">
                  {meal?.recipe} • {meal?.calories} cal
                </p>
                {meal?.time && (
                  <p className="text-xs text-muted-foreground font-caption mt-1">
                    Logged at {meal?.time}
                  </p>
                )}
              </div>
            </div>

            {meal?.status === 'skipped' && (
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                className="ml-4"
              >
                Add Snack
              </Button>
            )}
          </div>
        ))}
      </div>
      )}
      {/* Mobile Timeline View */}
      <div className="lg:hidden mt-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          {currentLog?.meals?.map((meal, index) => (
            <div key={meal?.id} className="relative flex items-start space-x-4 pb-4">
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-card border-2 ${
                meal?.status === 'ate' ? 'border-success' : 'border-error'
              }`}>
                <Icon name={getStatusIcon(meal?.status)} size={16} className={getStatusColor(meal?.status)} />
              </div>
              <div className="flex-1 min-w-0 pb-4">
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground font-body">
                      {meal?.name}
                    </h4>
                    {meal?.time && (
                      <span className="text-xs text-muted-foreground font-caption">
                        {meal?.time}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-caption">
                    {meal?.recipe}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-caption">
                      {meal?.calories} calories
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      meal?.status === 'ate' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                    }`}>
                      {meal?.status === 'ate' ? 'Completed' : 'Skipped'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealLogHistory;