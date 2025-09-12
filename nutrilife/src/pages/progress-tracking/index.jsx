import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import components
import KPICard from './components/KPICard';
import NutritionChart from './components/NutritionChart';
import MealLogHistory from './components/MealLogHistory';
import BudgetTracker from './components/BudgetTracker';
import GoalAdjustment from './components/GoalAdjustment';
import ExportData from './components/ExportData';

const ProgressTracking = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'nutrition', label: 'Nutrition', icon: 'Apple' },
    { id: 'meals', label: 'Meal Logs', icon: 'BookOpen' },
    { id: 'budget', label: 'Budget', icon: 'DollarSign' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  // KPI data
  const kpiData = [
    {
      title: 'Weekly Adherence',
      value: '78',
      unit: '%',
      trend: 'up',
      trendValue: '+5%',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Avg Daily Nutrition',
      value: '92',
      unit: '%',
      trend: 'up',
      trendValue: '+3%',
      icon: 'Apple',
      color: 'primary'
    },
    {
      title: 'Budget Variance',
      value: '+4.80',
      unit: '$',
      trend: 'up',
      trendValue: '+2.1%',
      icon: 'DollarSign',
      color: 'warning'
    },
    {
      title: 'Meals Completed',
      value: '33',
      unit: '/42',
      trend: 'up',
      trendValue: '+8%',
      icon: 'CheckCircle',
      color: 'accent'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData?.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))}
            </div>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NutritionChart />
              <MealLogHistory />
            </div>
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('goals')}
                  iconName="Target"
                  iconPosition="left"
                  className="justify-start"
                >
                  Adjust Goals
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('export')}
                  iconName="Download"
                  iconPosition="left"
                  className="justify-start"
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  iconName="Calendar"
                  iconPosition="left"
                  className="justify-start"
                >
                  View Calendar
                </Button>
              </div>
            </div>
          </div>
        );
      case 'nutrition':
        return <NutritionChart />;
      case 'meals':
        return <MealLogHistory />;
      case 'budget':
        return <BudgetTracker />;
      case 'goals':
        return <GoalAdjustment />;
      case 'export':
        return <ExportData />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Progress Tracking - NutriLife</title>
        <meta name="description" content="Track your meal plan adherence, nutrition intake, and budget performance with comprehensive analytics and insights." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6">
              <Breadcrumb />
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
                    Progress Tracking
                  </h1>
                  <p className="text-muted-foreground font-body mt-1">
                    Monitor your nutrition journey and meal plan performance
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              {/* Desktop Tabs */}
              <div className="hidden lg:flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      activeTab === tab?.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="font-body">{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Tab Selector */}
              <div className="lg:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e?.target?.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {tabs?.map((tab) => (
                    <option key={tab?.id} value={tab?.id}>
                      {tab?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {renderTabContent()}
            </div>

            {/* Mobile Bottom Navigation Spacer */}
            <div className="h-20 lg:hidden" />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
          <div className="grid grid-cols-3 gap-1 p-2">
            {tabs?.slice(0, 3)?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors duration-150 touch-target ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span className="text-xs font-caption">{tab?.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 p-2 pt-0">
            {tabs?.slice(3)?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors duration-150 touch-target ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span className="text-xs font-caption">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressTracking;