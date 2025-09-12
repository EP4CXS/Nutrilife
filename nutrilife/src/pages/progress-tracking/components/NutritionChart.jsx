import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const NutritionChart = () => {
  const [activeMetric, setActiveMetric] = useState('calories');
  const [chartType, setChartType] = useState('line');

  const nutritionData = [
    { date: '09/05', calories: 2100, protein: 120, carbs: 250, fat: 70, fiber: 28, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/06', calories: 2350, protein: 140, carbs: 280, fat: 78, fiber: 32, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/07', calories: 1950, protein: 110, carbs: 220, fat: 65, fiber: 25, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/08', calories: 2280, protein: 135, carbs: 265, fat: 76, fiber: 29, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/09', calories: 2150, protein: 125, carbs: 255, fat: 72, fiber: 31, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/10', calories: 2400, protein: 145, carbs: 290, fat: 80, fiber: 33, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 },
    { date: '09/11', calories: 2180, protein: 128, carbs: 260, fat: 74, fiber: 30, target_calories: 2200, target_protein: 130, target_carbs: 275, target_fat: 73, target_fiber: 30 }
  ];

  const metrics = [
    { key: 'calories', label: 'Calories', unit: 'kcal', color: '#2D7D32' },
    { key: 'protein', label: 'Protein', unit: 'g', color: '#558B2F' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: '#FF8F00' },
    { key: 'fat', label: 'Fat', unit: 'g', color: '#F44336' },
    { key: 'fiber', label: 'Fiber', unit: 'g', color: '#4CAF50' }
  ];

  const currentMetric = metrics?.find(m => m?.key === activeMetric);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value} {currentMetric?.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-lg font-semibold text-foreground font-heading">
          Nutrition Intake Tracking
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            iconName="TrendingUp"
            iconPosition="left"
          >
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            iconName="BarChart3"
            iconPosition="left"
          >
            Bar
          </Button>
        </div>
      </div>
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <Button
            key={metric?.key}
            variant={activeMetric === metric?.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMetric(metric?.key)}
            className="text-xs"
          >
            {metric?.label}
          </Button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={nutritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={currentMetric?.color}
                strokeWidth={3}
                dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 4 }}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey={`target_${activeMetric}`}
                stroke={currentMetric?.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target"
              />
            </LineChart>
          ) : (
            <BarChart data={nutritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Bar dataKey={activeMetric} fill={currentMetric?.color} name="Actual" />
              <Bar dataKey={`target_${activeMetric}`} fill={`${currentMetric?.color}40`} name="Target" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentMetric?.color }}
          />
          <span className="text-muted-foreground font-caption">Actual Intake</span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-1 rounded-full"
            style={{ backgroundColor: currentMetric?.color }}
          />
          <span className="text-muted-foreground font-caption">Target Goal</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;