import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportData = () => {
  const [selectedData, setSelectedData] = useState({
    mealLogs: true,
    nutritionData: true,
    budgetData: true,
    adherenceStats: false,
    goalHistory: false
  });
  
  const [dateRange, setDateRange] = useState({
    startDate: '2025-09-04',
    endDate: '2025-09-11'
  });
  
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const dataTypes = [
    {
      key: 'mealLogs',
      label: 'Meal Logs',
      description: 'Daily meal completion status and timestamps',
      icon: 'BookOpen',
      size: '2.3 KB'
    },
    {
      key: 'nutritionData',
      label: 'Nutrition Data',
      description: 'Daily calorie, protein, carb, fat, and fiber intake',
      icon: 'BarChart3',
      size: '1.8 KB'
    },
    {
      key: 'budgetData',
      label: 'Budget Data',
      description: 'Daily spending and cost per meal analysis',
      icon: 'DollarSign',
      size: '1.2 KB'
    },
    {
      key: 'adherenceStats',
      label: 'Adherence Statistics',
      description: 'Weekly adherence percentages and trends',
      icon: 'TrendingUp',
      size: '0.8 KB'
    },
    {
      key: 'goalHistory',
      label: 'Goal History',
      description: 'Historical changes to nutrition and budget goals',
      icon: 'Target',
      size: '0.5 KB'
    }
  ];

  const handleDataTypeChange = (key, checked) => {
    setSelectedData(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock CSV data
    const csvData = generateMockCSV();
    
    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nutrilife-progress-${dateRange?.startDate}-to-${dateRange?.endDate}.csv`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    window.URL?.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const generateMockCSV = () => {
    let csvContent = '';
    
    if (selectedData?.mealLogs) {
      csvContent += 'Date,Meal,Recipe,Status,Time,Calories\n';
      csvContent += '2025-09-11,Breakfast,Protein Oatmeal Bowl,ate,08:30,420\n';
      csvContent += '2025-09-11,Lunch,Grilled Chicken Salad,ate,12:45,520\n';
      csvContent += '2025-09-11,Dinner,Salmon with Quinoa,ate,19:15,680\n';
      csvContent += '\n';
    }
    
    if (selectedData?.nutritionData) {
      csvContent += 'Date,Calories,Protein,Carbs,Fat,Fiber,Target_Calories,Target_Protein,Target_Carbs,Target_Fat,Target_Fiber\n';
      csvContent += '2025-09-11,2180,128,260,74,30,2200,130,275,73,30\n';
      csvContent += '2025-09-10,2400,145,290,80,33,2200,130,275,73,30\n';
      csvContent += '\n';
    }
    
    if (selectedData?.budgetData) {
      csvContent += 'Date,Spent,Budget,Meals_Count,Cost_Per_Meal\n';
      csvContent += '2025-09-11,31.25,35.00,6,5.21\n';
      csvContent += '2025-09-10,36.40,35.00,6,6.07\n';
      csvContent += '\n';
    }
    
    return csvContent;
  };

  const selectedCount = Object.values(selectedData)?.filter(Boolean)?.length;
  const totalSize = dataTypes?.filter(type => selectedData?.[type?.key])?.reduce((sum, type) => sum + parseFloat(type?.size), 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground font-heading">
          Export Progress Data
        </h3>
      </div>
      {/* Date Range Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground font-body mb-3">
          Date Range
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground font-caption mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange?.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e?.target?.value }))}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground font-caption mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange?.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e?.target?.value }))}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      {/* Data Type Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground font-body mb-3">
          Select Data to Export
        </h4>
        <div className="space-y-3">
          {dataTypes?.map((dataType) => (
            <div
              key={dataType?.key}
              className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <Checkbox
                checked={selectedData?.[dataType?.key]}
                onChange={(e) => handleDataTypeChange(dataType?.key, e?.target?.checked)}
                className="mt-1"
              />
              
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                  <Icon name={dataType?.icon} size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-foreground font-body">
                      {dataType?.label}
                    </h5>
                    <span className="text-xs text-muted-foreground font-caption">
                      {dataType?.size}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-caption">
                    {dataType?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Export Format */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground font-body mb-3">
          Export Format
        </h4>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e?.target?.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm font-body">CSV</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="exportFormat"
              value="json"
              checked={exportFormat === 'json'}
              onChange={(e) => setExportFormat(e?.target?.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm font-body">JSON</span>
          </label>
        </div>
      </div>
      {/* Export Summary */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground font-body">
            Export Summary
          </span>
          <span className="text-sm text-muted-foreground font-caption">
            {selectedCount} data types selected
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-caption">
            Estimated file size:
          </span>
          <span className="font-medium text-foreground font-body">
            {totalSize?.toFixed(1)} KB
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground font-caption">
            Date range:
          </span>
          <span className="font-medium text-foreground font-body">
            {new Date(dateRange.startDate)?.toLocaleDateString()} - {new Date(dateRange.endDate)?.toLocaleDateString()}
          </span>
        </div>
      </div>
      {/* Export Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground font-caption">
          {selectedCount === 0 ? 'Select at least one data type to export' : 'Ready to export'}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            disabled={selectedCount === 0}
          >
            Preview
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            disabled={selectedCount === 0}
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>
      {/* Export History */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground font-body mb-3">
          Recent Exports
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground font-body">
                  nutrilife-progress-2025-09-04-to-2025-09-11.csv
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Exported 2 minutes ago • 6.8 KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconName="Download" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground font-body">
                  nutrilife-progress-2025-08-28-to-2025-09-04.csv
                </p>
                <p className="text-xs text-muted-foreground font-caption">
                  Exported 1 week ago • 7.2 KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconName="Download" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportData;