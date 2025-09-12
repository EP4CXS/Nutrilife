import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MealLogHistory = () => {
  const [selectedDate, setSelectedDate] = useState('2025-09-11');

  const mealLogs = [
    {
      date: '2025-09-11',
      meals: [
        { id: 1, name: 'Breakfast', recipe: 'Protein Oatmeal Bowl', status: 'ate', time: '08:30', calories: 420 },
        { id: 2, name: 'Mid-Morning Snack', recipe: 'Greek Yogurt with Berries', status: 'skipped', time: null, calories: 180 },
        { id: 3, name: 'Lunch', recipe: 'Grilled Chicken Salad', status: 'ate', time: '12:45', calories: 520 },
        { id: 4, name: 'Afternoon Snack', recipe: 'Protein Smoothie', status: 'ate', time: '15:20', calories: 280 },
        { id: 5, name: 'Dinner', recipe: 'Salmon with Quinoa', status: 'ate', time: '19:15', calories: 680 },
        { id: 6, name: 'Evening Snack', recipe: 'Mixed Nuts', status: 'skipped', time: null, calories: 200 }
      ]
    },
    {
      date: '2025-09-10',
      meals: [
        { id: 7, name: 'Breakfast', recipe: 'Avocado Toast', status: 'ate', time: '08:15', calories: 380 },
        { id: 8, name: 'Mid-Morning Snack', recipe: 'Apple with Peanut Butter', status: 'ate', time: '10:30', calories: 220 },
        { id: 9, name: 'Lunch', recipe: 'Turkey Wrap', status: 'ate', time: '13:00', calories: 450 },
        { id: 10, name: 'Afternoon Snack', recipe: 'Protein Bar', status: 'skipped', time: null, calories: 240 },
        { id: 11, name: 'Dinner', recipe: 'Beef Stir Fry', status: 'ate', time: '18:45', calories: 620 },
        { id: 12, name: 'Evening Snack', recipe: 'Dark Chocolate', status: 'ate', time: '21:00', calories: 150 }
      ]
    },
    {
      date: '2025-09-09',
      meals: [
        { id: 13, name: 'Breakfast', recipe: 'Scrambled Eggs with Toast', status: 'ate', time: '08:45', calories: 450 },
        { id: 14, name: 'Mid-Morning Snack', recipe: 'Banana', status: 'ate', time: '10:15', calories: 120 },
        { id: 15, name: 'Lunch', recipe: 'Quinoa Buddha Bowl', status: 'ate', time: '12:30', calories: 580 },
        { id: 16, name: 'Afternoon Snack', recipe: 'Trail Mix', status: 'ate', time: '15:45', calories: 300 },
        { id: 17, name: 'Dinner', recipe: 'Grilled Fish with Vegetables', status: 'skipped', time: null, calories: 520 },
        { id: 18, name: 'Evening Snack', recipe: 'Herbal Tea', status: 'ate', time: '20:30', calories: 5 }
      ]
    }
  ];

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
      </div>
      {/* Day Summary */}
      {dayStats && (
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