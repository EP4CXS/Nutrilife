import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetSummary = ({ 
  totalCost, 
  budgetPerDay, 
  selectedDays, 
  completedCost, 
  remainingCost 
}) => {
  const totalBudget = budgetPerDay * selectedDays;
  const budgetUsagePercentage = totalBudget > 0 ? Math.min((totalCost / totalBudget) * 100, 100) : 0;
  const isOverBudget = totalCost > totalBudget;
  const budgetDifference = Math.abs(totalCost - totalBudget);

  const getStatusColor = () => {
    if (isOverBudget) return 'text-destructive';
    if (budgetUsagePercentage > 80) return 'text-warning';
    return 'text-success';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return 'AlertTriangle';
    if (budgetUsagePercentage > 80) return 'AlertCircle';
    return 'CheckCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground font-heading">
          Budget Summary
        </h2>
        <Icon name="DollarSign" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Cost */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground font-heading">
            ${totalCost?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            Total Cost
          </div>
        </div>

        {/* Budget Allocated */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground font-heading">
            ${totalBudget?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            Budget ({selectedDays} days)
          </div>
        </div>

        {/* Completed Cost */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-success font-heading">
            ${completedCost?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            Items Bought
          </div>
        </div>

        {/* Remaining Cost */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-muted-foreground font-heading">
            ${remainingCost?.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            Still to Buy
          </div>
        </div>
      </div>
      {/* Budget Status */}
      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon()} 
            size={24} 
            className={getStatusColor()} 
          />
          <div>
            <div className={`font-semibold font-heading ${getStatusColor()}`}>
              {isOverBudget ? 'Over Budget' : budgetUsagePercentage > 80 ? 'Near Budget Limit' : 'Within Budget'}
            </div>
            <div className="text-sm text-muted-foreground font-body">
              {isOverBudget 
                ? `$${budgetDifference?.toFixed(2)} over budget`
                : `$${budgetDifference?.toFixed(2)} ${budgetUsagePercentage > 80 ? 'remaining' : 'under budget'}`
              }
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-foreground font-heading">
            {budgetUsagePercentage?.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground font-caption">
            Budget Used
          </div>
        </div>
      </div>
      {/* Budget Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-muted-foreground font-caption mb-2">
          <span>Budget Usage</span>
          <span>{budgetUsagePercentage?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget 
                ? 'bg-destructive' 
                : budgetUsagePercentage > 80 
                  ? 'bg-warning' :'bg-success'
            }`}
            style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;