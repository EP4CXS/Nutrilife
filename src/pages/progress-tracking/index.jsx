import React, { useState, useEffect } from 'react';
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
  const [kpiStats, setKpiStats] = useState({
    weeklyAdherence: 0,
    avgDailyNutrition: 0,
    budgetVariance: 0,
    mealsCompleted: 0,
    totalMeals: 0,
  });

  const [weeklyBudget, setWeeklyBudget] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'nutrition', label: 'Nutrition', icon: 'Apple' },
    { id: 'meals', label: 'Meal Logs', icon: 'BookOpen' },
    { id: 'budget', label: 'Budget', icon: 'Wallet' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  // Load weekly budget from profile (same API as dashboard)
  useEffect(() => {
    const token = localStorage.getItem('nutri_token');
    if (!token) return;

    const fetchProfileBudget = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/me/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error('Failed to load profile for progress tracking', await response.text());
          return;
        }

        const data = await response.json();
        const wb = data.budget_settings?.weeklyBudget;
        if (typeof wb === 'number') {
          setWeeklyBudget(wb);
        }
      } catch (e) {
        console.error('Error fetching profile for progress tracking', e);
      }
    };

    fetchProfileBudget();
  }, []);

  // Derive KPI stats from mealLogs and weekly budget
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mealLogs');
      const logs = raw ? JSON.parse(raw) : [];

      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6); // include today + previous 6 days

      let totalMeals = 0;
      let mealsCompleted = 0;
      let nutritionPercentSum = 0;
      let nutritionDays = 0;
      let totalCost = 0;

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

      logs.forEach((log) => {
        const logDate = new Date(log.date);
        if (logDate < sevenDaysAgo || logDate > now) return;

        const meals = log.meals || [];
        if (meals.length === 0) return;

        meals.forEach((meal) => {
          totalMeals += 1;
          if (meal.status === 'ate') {
            mealsCompleted += 1;
            totalCost += parseVal(meal.cost);
          }
        });

        // For avg daily nutrition %, compute based on eaten meals only
        const eatenMeals = meals.filter((m) => m.status === 'ate');
        if (eatenMeals.length > 0) {
          const totals = eatenMeals.reduce(
            (acc, meal) => ({
              calories: acc.calories + parseVal(meal.calories),
              protein: acc.protein + parseVal(meal.protein),
              carbs: acc.carbs + parseVal(meal.carbs),
              fat: acc.fat + parseVal(meal.fat),
              fiber: acc.fiber + parseVal(meal.fiber),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
          );

          const dayPercent =
            ((totals.calories / targets.calories) +
              (totals.protein / targets.protein) +
              (totals.carbs / targets.carbs) +
              (totals.fat / targets.fat) +
              (totals.fiber / targets.fiber)) /
            5;

          nutritionPercentSum += dayPercent * 100;
          nutritionDays += 1;
        }
      });

      const weeklyAdherence = totalMeals
        ? Math.round((mealsCompleted / totalMeals) * 100)
        : 0;

      const avgDailyNutrition = nutritionDays
        ? Math.round(nutritionPercentSum / nutritionDays)
        : 0;

      const budgetVariance = weeklyBudget != null
        ? Math.round((totalCost - weeklyBudget) * 100) / 100
        : 0;

      setKpiStats({
        weeklyAdherence,
        avgDailyNutrition,
        budgetVariance,
        mealsCompleted,
        totalMeals,
      });
    } catch (e) {
      console.error('Failed to derive KPI stats from meal logs', e);
      setKpiStats({
        weeklyAdherence: 0,
        avgDailyNutrition: 0,
        budgetVariance: 0,
        mealsCompleted: 0,
        totalMeals: 0,
      });
    }
  }, [weeklyBudget]);

  // KPI data based on derived stats
  const kpiData = [
    {
      title: 'Weekly Adherence',
      value: String(kpiStats.weeklyAdherence),
      unit: '%',
      trend: 'up',
      trendValue: '',
      icon: 'TrendingUp',
      color: 'success',
    },
    {
      title: 'Avg Daily Nutrition',
      value: String(kpiStats.avgDailyNutrition),
      unit: '%',
      trend: 'up',
      trendValue: '',
      icon: 'Apple',
      color: 'primary',
    },
    {
      title: 'Budget Variance',
      value: kpiStats.budgetVariance.toFixed(2),
      unit: '₱',
      trend: kpiStats.budgetVariance <= 0 ? 'up' : 'down',
      trendValue: '',
      icon: null,
      customIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning"
        >
          <path d="M6 3v18" />
          <path d="M6 3h9a4 4 0 0 1 0 8H6" />
          <line x1="6" y1="11" x2="16" y2="11" />
        </svg>
      ),
      color: 'warning',
    },
    {
      title: 'Meals Completed',
      value: String(kpiStats.mealsCompleted),
      unit: kpiStats.totalMeals ? `/${kpiStats.totalMeals}` : '',
      trend: 'up',
      trendValue: '',
      icon: 'CheckCircle',
      color: 'accent',
    },
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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Dark blur background with gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
        <div className="fixed inset-0 opacity-30 -z-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
        }} />
        
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