import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const NutritionPanel = ({ nutrition }) => {
  const macroData = [
    { name: 'Protein', value: nutrition?.protein, color: '#2D7D32', unit: 'g' },
    { name: 'Carbs', value: nutrition?.carbs, color: '#FF8F00', unit: 'g' },
    { name: 'Fat', value: nutrition?.fat, color: '#F44336', unit: 'g' }
  ];

  const nutritionFacts = [
    { label: 'Calories', value: nutrition?.calories, unit: 'kcal', dailyValue: Math.round((nutrition?.calories / 2000) * 100) },
    { label: 'Protein', value: nutrition?.protein, unit: 'g', dailyValue: Math.round((nutrition?.protein / 50) * 100) },
    { label: 'Carbohydrates', value: nutrition?.carbs, unit: 'g', dailyValue: Math.round((nutrition?.carbs / 300) * 100) },
    { label: 'Fat', value: nutrition?.fat, unit: 'g', dailyValue: Math.round((nutrition?.fat / 65) * 100) },
    { label: 'Fiber', value: nutrition?.fiber, unit: 'g', dailyValue: Math.round((nutrition?.fiber / 25) * 100) },
    { label: 'Sugar', value: nutrition?.sugar, unit: 'g', dailyValue: Math.round((nutrition?.sugar / 50) * 100) },
    { label: 'Sodium', value: nutrition?.sodium, unit: 'mg', dailyValue: Math.round((nutrition?.sodium / 2300) * 100) }
  ];

  const getDailyValueColor = (value) => {
    if (value >= 100) return 'text-error';
    if (value >= 75) return 'text-warning';
    if (value >= 50) return 'text-primary';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="BarChart3" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground font-heading">
          Nutrition Information
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrition Facts Table */}
        <div>
          <h3 className="text-lg font-medium text-foreground font-body mb-4">
            Nutrition Facts
          </h3>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="space-y-3">
              {nutritionFacts?.map((fact, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="text-sm font-medium text-foreground font-body">
                    {fact?.label}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-foreground font-mono">
                      {fact?.value}{fact?.unit}
                    </span>
                    <span className={`text-xs font-medium ${getDailyValueColor(fact?.dailyValue)}`}>
                      {fact?.dailyValue}% DV
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-caption">
                * Percent Daily Values are based on a 2,000 calorie diet
              </p>
            </div>
          </div>
        </div>

        {/* Visual Charts */}
        <div className="space-y-6">
          {/* Macronutrient Breakdown */}
          <div>
            <h3 className="text-lg font-medium text-foreground font-body mb-4">
              Macronutrient Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}g`, name]}
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {macroData?.map((macro, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: macro?.color }}
                  />
                  <span className="text-sm text-muted-foreground font-caption">
                    {macro?.name}: {macro?.value}g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Value Chart */}
          <div>
            <h3 className="text-lg font-medium text-foreground font-body mb-4">
              Daily Value Percentages
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionFacts?.slice(0, 4)} layout="horizontal">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="label" width={60} fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Daily Value']}
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="dailyValue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPanel;