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
import { getRandomFoods, formatFoodForDisplay, getFoodsByMealType } from '../../utils/foodData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [greetingMessage, setGreetingMessage] = useState('');

  // Mock user profile data
  const defaultUserProfile = {
    name: "Cape, Jhon lloyd",
    role: "Fitness Enthusiast",
    age: 28,
    sex: "Male",
    height: "5\'6\"",
    currentWeight: 145,
    targetWeight: 135,
    activityLevel: "Active",
    dailyBudget: 25.00
  };

  // Load today's meal plan data from CSV
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        console.log('Loading meals from CSV...');
        const foods = await getRandomFoods(4);
        console.log('Foods loaded:', foods);
        
        if (!foods || foods.length === 0) {
          console.warn('No foods returned from CSV');
          setTodaysMeals([]);
          setIsLoadingMeals(false);
          return;
        }
        
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
        
        const meals = foods.map((food, index) => {
          const formatted = formatFoodForDisplay(food);
          return {
            id: formatted.id,
            name: formatted.name,
            type: mealTypes[index] || 'Meal',
            image: formatted.imageUrl,
            
            // All values from CSV dataset
            servings: formatted.servings,
            prepTime: formatted.prepTime,
            cost: formatted.cost,
            calories: formatted.calories,
            protein: formatted.protein,
            carbs: formatted.carbs,
            fat: formatted.fat,
            fiber: formatted.fiber,
            sugar: formatted.sugar,
            sodium: formatted.sodium,
            cholesterol: formatted.cholesterol,
            
            // Additional info
            rating: parseFloat(formatted.popularityScore) || 4,
            logged: false,
            status: null
          };
        });
        
        console.log('Meals formatted:', meals);
        setTodaysMeals(meals);
      } catch (error) {
        console.error('Error loading meals:', error);
        setError(error.message);
        setTodaysMeals([]);
      } finally {
        setIsLoadingMeals(false);
      }
    };
    
    loadMeals();
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nutri_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const name = parsed.fullName || parsed.username || parsed.email || 'User';

        setUserProfile({
          name,
          role: 'Fitness Enthusiast',
          age: 28,
          sex: 'N/A',
          height: "5'6\"",
          currentWeight: 145,
          targetWeight: 135,
          activityLevel: 'Active',
          dailyBudget: 25.0
        });
      }

      const storedGreeting = localStorage.getItem('nutri_greeting');
      if (storedGreeting) {
        setGreetingMessage(storedGreeting);
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('nutri_token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/me/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to load profile', await response.text());
          return;
        }

        const data = await response.json();

        setUserProfile((prev) => {
          const base = prev || defaultUserProfile;
          return {
            ...base,
            name: data.full_name || data.username || data.email || base.name,
            age: data.age || base.age,
            sex: data.gender || base.sex,
            height: data.height_cm ? `${data.height_cm} cm` : base.height,
            currentWeight: data.current_weight_kg || base.currentWeight,
            targetWeight: data.target_weight_kg || base.targetWeight,
            activityLevel: data.activity_level || base.activityLevel,
            dailyBudget: base.dailyBudget,
          };
        });
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    fetchProfile();
  }, [navigate]);

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

  // Show error if there's one
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
              {greetingMessage || `Welcome back, ${userProfile?.name || 'User'}!`}
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
            <ProfileSummaryCard profile={userProfile || defaultUserProfile} />
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

          {/* Quick Actions */}
          <QuickActionMenu className="mb-8" />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;