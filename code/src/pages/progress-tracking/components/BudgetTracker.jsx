import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetTracker = () => {
  const [viewType, setViewType] = useState('weekly');

  const weeklyBudgetData = [
    { date: '09/05', spent: 28.50, budget: 35.00, meals: 6 },
    { date: '09/06', spent: 32.75, budget: 35.00, meals: 6 },
    { date: '09/07', spent: 26.20, budget: 35.00, meals: 5 },
    { date: '09/08', spent: 34.80, budget: 35.00, meals: 6 },
    { date: '09/09', spent: 29.90, budget: 35.00, meals: 5 },
    { date: '09/10', spent: 36.40, budget: 35.00, meals: 6 },
    { date: '09/11', spent: 31.25, budget: 35.00, meals: 6 }
  ];

  const categoryData = [
    { name: 'Breakfast', value: 68.50, color: '#2D7D32' },
    { name: 'Lunch', value: 95.20, color: '#558B2F' },
    { name: 'Dinner', value: 124.80, color: '#FF8F00' },
    { name: 'Snacks', value: 42.30, color: '#4CAF50' }
  ];

  const totalSpent = weeklyBudgetData?.reduce((sum, day) => sum + day?.spent, 0);
  const totalBudget = weeklyBudgetData?.reduce((sum, day) => sum + day?.budget, 0);
  const budgetVariance = totalSpent - totalBudget;
  const averageCostPerMeal = totalSpent / weeklyBudgetData?.reduce((sum, day) => sum + day?.meals, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ${entry?.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {data?.name}: ${data?.value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name="DollarSign" size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground font-body">
                Total Spent
              </h4>
              <p className="text-xl font-bold text-foreground font-heading">
                ${totalSpent?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
              <Icon name="Target" size={20} className="text-secondary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground font-body">
                Budget Goal
              </h4>
              <p className="text-xl font-bold text-foreground font-heading">
                ${totalBudget?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              budgetVariance > 0 ? 'bg-error/10' : 'bg-success/10'
            }`}>
              <Icon 
                name={budgetVariance > 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={20} 
                className={budgetVariance > 0 ? 'text-error' : 'text-success'} 
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground font-body">
                Variance
              </h4>
              <p className={`text-xl font-bold font-heading ${
                budgetVariance > 0 ? 'text-error' : 'text-success'
              }`}>
                {budgetVariance > 0 ? '+' : ''}${budgetVariance?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
              <Icon name="Calculator" size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground font-body">
                Avg/Meal
              </h4>
              <p className="text-xl font-bold text-foreground font-heading">
                ${averageCostPerMeal?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Spending Chart */}
        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Weekly Spending
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewType === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={viewType === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('daily')}
              >
                Daily
              </Button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyBudgetData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666666"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spent" fill="#2D7D32" name="Spent" />
                <Bar dataKey="budget" fill="#E0E0E0" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-foreground font-heading mb-6">
            Spending by Category
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData?.map((category) => (
              <div key={category?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground font-body">
                    {category?.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-caption">
                    ${category?.value?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Budget Recommendations */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
          Budget Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="TrendingUp" size={18} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Over Budget Alert
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  You're ${Math.abs(budgetVariance)?.toFixed(2)} over your weekly budget. Consider meal prep to reduce costs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Lightbulb" size={18} className="text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Cost Optimization
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Dinner accounts for 38% of your spending. Try batch cooking to reduce per-meal costs.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="Target" size={18} className="text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Goal Adjustment
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Based on your spending pattern, consider increasing your daily budget to $37.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name="ShoppingCart" size={18} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Shopping Tips
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Buy ingredients in bulk and focus on seasonal produce to reduce overall costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;