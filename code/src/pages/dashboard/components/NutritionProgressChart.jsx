import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const NutritionProgressChart = ({ nutritionData }) => {
  const chartData = [
    {
      name: 'Calories',
      current: nutritionData?.calories?.current,
      target: nutritionData?.calories?.target,
      unit: 'kcal',
      percentage: Math.round((nutritionData?.calories?.current / nutritionData?.calories?.target) * 100)
    },
    {
      name: 'Protein',
      current: nutritionData?.protein?.current,
      target: nutritionData?.protein?.target,
      unit: 'g',
      percentage: Math.round((nutritionData?.protein?.current / nutritionData?.protein?.target) * 100)
    },
    {
      name: 'Carbs',
      current: nutritionData?.carbs?.current,
      target: nutritionData?.carbs?.target,
      unit: 'g',
      percentage: Math.round((nutritionData?.carbs?.current / nutritionData?.carbs?.target) * 100)
    },
    {
      name: 'Fat',
      current: nutritionData?.fat?.current,
      target: nutritionData?.fat?.target,
      unit: 'g',
      percentage: Math.round((nutritionData?.fat?.current / nutritionData?.fat?.target) * 100)
    },
    {
      name: 'Fiber',
      current: nutritionData?.fiber?.current,
      target: nutritionData?.fiber?.target,
      unit: 'g',
      percentage: Math.round((nutritionData?.fiber?.current / nutritionData?.fiber?.target) * 100)
    }
  ];

  const getBarColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50'; // success
    if (percentage >= 70) return '#FF9800'; // warning
    return '#F44336'; // error
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground font-body">{label}</p>
          <p className="text-sm text-muted-foreground font-caption">
            {data?.current}{data?.unit} / {data?.target}{data?.unit} ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          Daily Nutrition Progress
        </h3>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>
      <div className="h-64 mb-6" aria-label="Daily Nutrition Progress Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#666666' }}
              axisLine={{ stroke: '#E0E0E0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666666' }}
              axisLine={{ stroke: '#E0E0E0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="current" radius={[4, 4, 0, 0]}>
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry?.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {chartData?.map((item) => (
          <div key={item?.name} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getBarColor(item?.percentage) }}
              />
              <span className="text-sm font-medium text-foreground font-body">
                {item?.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-caption">
              {item?.current}/{item?.target} {item?.unit}
            </p>
            <p className={`text-sm font-semibold font-body ${
              item?.percentage >= 90 ? 'text-success' : 
              item?.percentage >= 70 ? 'text-warning' : 'text-error'
            }`}>
              {item?.percentage}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionProgressChart;