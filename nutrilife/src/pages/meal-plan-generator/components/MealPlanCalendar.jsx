import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

import MealSlot from './MealSlot';

const MealPlanCalendar = ({ mealPlan, onMealReplace, onMealRemove }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(currentWeekStart);
    date?.setDate(date?.getDate() + dayIndex);
    return {
      name: days?.[date?.getDay()],
      date: date?.getDate(),
      month: date?.getMonth() + 1
    };
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: 'Coffee' },
    { key: 'lunch', label: 'Lunch', icon: 'Utensils' },
    { key: 'dinner', label: 'Dinner', icon: 'ChefHat' },
    { key: 'snacks', label: 'Snacks', icon: 'Cookie' }
  ];

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate?.setDate(newDate?.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const navigateDay = (direction) => {
    const newDay = Math.max(0, Math.min(mealPlan?.length - 1, selectedDay + direction));
    setSelectedDay(newDay);
  };

  if (!mealPlan || mealPlan?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2 font-heading">
          No Meal Plan Generated
        </h3>
        <p className="text-muted-foreground font-body">
          Configure your preferences and generate a meal plan to get started.
        </p>
      </div>
    );
  }

  // Mobile View - Single Day
  if (isMobileView) {
    const currentDay = mealPlan?.[selectedDay];
    const dayInfo = getDayName(selectedDay);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(-1)}
              disabled={selectedDay === 0}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            
            <div className="text-center">
              <h3 className="font-medium text-foreground font-heading">
                {dayInfo?.name}
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                {dayInfo?.month}/{dayInfo?.date}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay(1)}
              disabled={selectedDay === mealPlan?.length - 1}
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>
        {/* Mobile Meals */}
        <div className="p-4 space-y-4">
          {mealTypes?.map((mealType) => (
            <MealSlot
              key={mealType?.key}
              mealType={mealType}
              meal={currentDay?.meals?.[mealType?.key]}
              dayIndex={selectedDay}
              onReplace={onMealReplace}
              onRemove={onMealRemove}
              isMobile={true}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop View - Calendar Grid
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Header */}
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Meal Plan Calendar
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek(-1)}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <span className="text-sm text-muted-foreground font-caption px-4">
              {currentWeekStart?.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek(1)}
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {mealPlan?.map((_, dayIndex) => {
              const dayInfo = getDayName(dayIndex);
              return (
                <div key={dayIndex} className="p-4 text-center border-r border-border last:border-r-0">
                  <h3 className="font-medium text-foreground font-heading">
                    {dayInfo?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-caption">
                    {dayInfo?.month}/{dayInfo?.date}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Meal Rows */}
          {mealTypes?.map((mealType) => (
            <div key={mealType?.key} className="grid grid-cols-7 border-b border-border last:border-b-0">
              {mealPlan?.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-border last:border-r-0 min-h-[120px]">
                  <MealSlot
                    mealType={mealType}
                    meal={day?.meals?.[mealType?.key]}
                    dayIndex={dayIndex}
                    onReplace={onMealReplace}
                    onRemove={onMealRemove}
                    isMobile={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCalendar;