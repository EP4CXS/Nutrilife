import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import Button from '../../components/ui/Button';
import ProfileSummaryCard from './components/ProfileSummaryCard';

import NutritionProgressChart from './components/NutritionProgressChart';
import QuickStatsGrid from './components/QuickStatsGrid';
import TodaysMealPlan from './components/TodaysMealPlan';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock user profile data
  const userProfile = {
    name: "Donard Lleno",
    role: "Fitness Enthusiast",
    age: 20,
    sex: "Male",
    height: "5\'9\"",
    currentWeight: 145,
    targetWeight: 135,
    activityLevel: "Active",
    dailyBudget: 25.00
  };

  // Mock today's meal plan data
  const [todaysMeals, setTodaysMeals] = useState([
    {
      id: 1,
      name: "Greek Yogurt Parfait with Berries",
      type: "Breakfast",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      calories: 320,
      protein: 18,
      cost: 4.50,
      prepTime: 5,
      rating: 5,
      logged: false,
      status: null
    },
    {
      id: 2,
      name: "Grilled Chicken Salad Bowl",
      type: "Lunch",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop",
      calories: 450,
      protein: 35,
      cost: 8.75,
      prepTime: 15,
      rating: 4,
      logged: false,
      status: null
    },
    {
      id: 3,
      name: "Baked Salmon with Quinoa",
      type: "Dinner",
      image: "https://images.pixabay.com/photos/2014/11/05/15/57/salmon-518032_1280.jpg?w=400&h=300&fit=crop",
      calories: 520,
      protein: 42,
      cost: 12.25,
      prepTime: 25,
      rating: 5,
      logged: false,
      status: null
    },
    {
      id: 4,
      name: "Mixed Nuts & Apple",
      type: "Snacks",
      image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=300&fit=crop",
      calories: 180,
      protein: 6,
      cost: 2.50,
      prepTime: 2,
      rating: 4,
      logged: false,
      status: null
    }
  ]);

  // Mock nutrition progress data
  const nutritionData = {
    calories: { current: 1285, target: 1470 },
    protein: { current: 89, target: 101 },
    carbs: { current: 145, target: 184 },
    fat: { current: 42, target: 49 },
    fiber: { current: 18, target: 25 }
  };

  // Mock quick stats data
  const quickStats = {
    mealsLogged: 2,
    totalMeals: 4,
    weeklyAdherence: 85,
    budgetUsed: 15.75,
    dailyBudget: 25.00,
    recipesTried: 23
  };

  const handleLogMeal = (mealId, status) => {
    setTodaysMeals(prevMeals =>
      prevMeals?.map(meal =>
        meal?.id === mealId
          ? { ...meal, logged: true, status }
          : meal
      )
    );
  };

  const handleRegeneratePlan = () => {
    navigate('/meal-plan-generator');
  };

  const handleViewProgress = () => {
    navigate('/progress-tracking');
  };

  const handleManageShoppingList = () => {
    navigate('/shopping-list-manager');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
              Welcome back, {userProfile?.name}!
            </h1>
            <p className="text-muted-foreground font-body">
              Here's your nutrition overview for today, {new Date()?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="mb-8">
            <ProfileSummaryCard profile={userProfile} />
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-8">
            <QuickStatsGrid stats={quickStats} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Today's Meal Plan - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <TodaysMealPlan 
                meals={todaysMeals} 
                onLogMeal={handleLogMeal}
              />
            </div>

            {/* Nutrition Progress - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <NutritionProgressChart nutritionData={nutritionData} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button
              variant="default"
              onClick={handleRegeneratePlan}
              iconName="RefreshCw"
              iconPosition="left"
              className="w-full touch-target"
            >
              Regenerate Meal Plan
            </Button>
            <Button
              variant="outline"
              onClick={handleViewProgress}
              iconName="BarChart3"
              iconPosition="left"
              className="w-full touch-target"
            >
              View Detailed Progress
            </Button>
            <Button
              variant="secondary"
              onClick={handleManageShoppingList}
              iconName="ShoppingCart"
              iconPosition="left"
              className="w-full touch-target"
            >
              Manage Shopping List
            </Button>
          </div>

          {/* Quick Actions */}
          <QuickActionMenu className="mb-8" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;