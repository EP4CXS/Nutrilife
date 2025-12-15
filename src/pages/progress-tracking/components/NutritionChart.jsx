import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const NutritionChart = () => {
  const [activeMetric, setActiveMetric] = useState('calories');
  const [chartType, setChartType] = useState('line');
  const [nutritionData, setNutritionData] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mealLogs');
      const logs = raw ? JSON.parse(raw) : [];

      // Default daily targets (could be driven by profile in future)
      const targets = {
        calories: 2000,
        protein: 75,
        carbs: 250,
        fat: 70,
        fiber: 30,
      };

      const parseVal = (val) => {
        if (typeof val === 'string') {
          const num = parseFloat(val.replace(/[^\d.-]/g, ''));
          return Number.isFinite(num) ? num : 0;
        }
        const num = parseFloat(val);
        return Number.isFinite(num) ? num : 0;
      };

      const data = logs
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((log) => {
          const eatenMeals = (log.meals || []).filter((meal) => meal?.status === 'ate');
          const totals = eatenMeals.reduce(
            (acc, meal) => ({
              calories: acc.calories + parseVal(meal?.calories),
              protein: acc.protein + parseVal(meal?.protein),
              carbs: acc.carbs + parseVal(meal?.carbs),
              fat: acc.fat + parseVal(meal?.fat),
              fiber: acc.fiber + parseVal(meal?.fiber),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
          );

          const dateLabel = new Date(log.date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
          });

          return {
            date: dateLabel,
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fat: totals.fat,
            fiber: totals.fiber,
            target_calories: targets.calories,
            target_protein: targets.protein,
            target_carbs: targets.carbs,
            target_fat: targets.fat,
            target_fiber: targets.fiber,
          };
        });

      setNutritionData(data);
    } catch (e) {
      console.error('Failed to load nutrition data from meal logs', e);
      setNutritionData([]);
    }
  }, []);

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