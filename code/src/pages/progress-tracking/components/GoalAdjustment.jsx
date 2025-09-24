import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GoalAdjustment = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState({
    dailyCalories: 2200,
    protein: 130,
    carbs: 275,
    fat: 73,
    fiber: 30,
    dailyBudget: 35.00,
    weeklyBudget: 245.00,
    adherenceTarget: 85
  });

  const [tempGoals, setTempGoals] = useState(goals);

  const recommendations = [
    {
      type: 'calories',
      current: 2200,
      suggested: 2300,
      reason: 'Based on your activity level and recent weight changes',
      icon: 'Zap',
      color: 'text-warning'
    },
    {
      type: 'protein',
      current: 130,
      suggested: 140,
      reason: 'Increase protein for better muscle recovery',
      icon: 'Dumbbell',
      color: 'text-success'
    },
    {
      type: 'budget',
      current: 35.00,
      suggested: 37.00,
      reason: 'Adjust based on recent spending patterns',
      icon: 'DollarSign',
      color: 'text-primary'
    },
    {
      type: 'adherence',
      current: 85,
      suggested: 80,
      reason: 'More realistic target based on your lifestyle',
      icon: 'Target',
      color: 'text-accent'
    }
  ];

  const handleInputChange = (field, value) => {
    setTempGoals(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    setGoals(tempGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGoals(goals);
    setIsEditing(false);
  };

  const applyRecommendation = (recommendation) => {
    const fieldMap = {
      calories: 'dailyCalories',
      protein: 'protein',
      budget: 'dailyBudget',
      adherence: 'adherenceTarget'
    };
    
    const field = fieldMap?.[recommendation?.type];
    if (field) {
      setTempGoals(prev => ({
        ...prev,
        [field]: recommendation?.suggested
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Goals */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Current Goals
          </h3>
          <Button
            variant={isEditing ? 'outline' : 'default'}
            onClick={() => setIsEditing(!isEditing)}
            iconName={isEditing ? 'X' : 'Edit'}
            iconPosition="left"
          >
            {isEditing ? 'Cancel' : 'Edit Goals'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nutrition Goals */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground font-body uppercase tracking-wide">
              Nutrition
            </h4>
            
            <Input
              label="Daily Calories"
              type="number"
              value={isEditing ? tempGoals?.dailyCalories : goals?.dailyCalories}
              onChange={(e) => handleInputChange('dailyCalories', e?.target?.value)}
              disabled={!isEditing}
              className="mb-3"
            />
            
            <Input
              label="Protein (g)"
              type="number"
              value={isEditing ? tempGoals?.protein : goals?.protein}
              onChange={(e) => handleInputChange('protein', e?.target?.value)}
              disabled={!isEditing}
              className="mb-3"
            />
            
            <Input
              label="Carbs (g)"
              type="number"
              value={isEditing ? tempGoals?.carbs : goals?.carbs}
              onChange={(e) => handleInputChange('carbs', e?.target?.value)}
              disabled={!isEditing}
              className="mb-3"
            />
            
            <Input
              label="Fat (g)"
              type="number"
              value={isEditing ? tempGoals?.fat : goals?.fat}
              onChange={(e) => handleInputChange('fat', e?.target?.value)}
              disabled={!isEditing}
              className="mb-3"
            />
            
            <Input
              label="Fiber (g)"
              type="number"
              value={isEditing ? tempGoals?.fiber : goals?.fiber}
              onChange={(e) => handleInputChange('fiber', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Budget Goals */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground font-body uppercase tracking-wide">
              Budget
            </h4>
            
            <Input
              label="Daily Budget ($)"
              type="number"
              step="0.01"
              value={isEditing ? tempGoals?.dailyBudget : goals?.dailyBudget}
              onChange={(e) => handleInputChange('dailyBudget', e?.target?.value)}
              disabled={!isEditing}
              className="mb-3"
            />
            
            <Input
              label="Weekly Budget ($)"
              type="number"
              step="0.01"
              value={isEditing ? tempGoals?.weeklyBudget : goals?.weeklyBudget}
              onChange={(e) => handleInputChange('weeklyBudget', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Performance Goals */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground font-body uppercase tracking-wide">
              Performance
            </h4>
            
            <Input
              label="Adherence Target (%)"
              type="number"
              min="0"
              max="100"
              value={isEditing ? tempGoals?.adherenceTarget : goals?.adherenceTarget}
              onChange={(e) => handleInputChange('adherenceTarget', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Check"
              iconPosition="left"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      {/* AI Recommendations */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Sparkles" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Smart Recommendations
          </h3>
        </div>

        <div className="space-y-4">
          {recommendations?.map((rec, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 bg-muted rounded-lg ${rec?.color}`}>
                  <Icon name={rec?.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground font-body capitalize">
                      {rec?.type} Goal
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground font-caption">
                        {rec?.current} →
                      </span>
                      <span className="font-medium text-foreground font-body">
                        {rec?.suggested}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-caption">
                    {rec?.reason}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyRecommendation(rec)}
                iconName="ArrowRight"
                iconPosition="right"
                className="ml-4"
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Progress Insights */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
          Progress Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
              <Icon name="TrendingUp" size={18} className="text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Improving Consistency
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Your meal adherence has improved by 12% over the past two weeks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg">
              <Icon name="Award" size={18} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Protein Goal Achievement
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  You've consistently met your protein goals for 5 days straight!
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Budget Variance
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Consider adjusting your daily budget or meal choices to stay on track.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-accent/10 rounded-lg">
              <Icon name="Calendar" size={18} className="text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground font-body">
                  Weekly Review
                </h4>
                <p className="text-sm text-muted-foreground font-caption">
                  Schedule weekly goal reviews to maintain momentum and adjust as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalAdjustment;