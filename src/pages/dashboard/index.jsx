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
import { usePersistentState } from '../../utils/usePersistentState';

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [greetingMessage, setGreetingMessage] = usePersistentState(
    'nutrilife_dashboard_greeting',
    ''
  );

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
    weeklyBudget: 700,
    dailyBudget: 100.00
  };

  // Load today's meal plan data (persist across navigation in this tab)
  const [todaysMeals, setTodaysMeals] = usePersistentState(
    'nutrilife_dashboard_todays_meals',
    []
  );
  const [isLoadingMeals, setIsLoadingMeals] = usePersistentState(
    'nutrilife_dashboard_loading_meals',
    true
  );

  useEffect(() => {
    if (todaysMeals && todaysMeals.length > 0) {
      // Meals already loaded for this tab; don't reset when navigating back
      setIsLoadingMeals(false);
      return;
    }

    const loadMeals = async () => {
      try {
        // First, try to read from the saved meal plan used by the planner
        const savedPlanRaw = localStorage.getItem('savedMealPlan');
        if (savedPlanRaw) {
          try {
            const saved = JSON.parse(savedPlanRaw);
            const storedDayIndex = parseInt(localStorage.getItem('dashboardCurrentDayIndex') || '0', 10);
            const dayIndex = Number.isNaN(storedDayIndex) ? 0 : storedDayIndex;
            const firstDay = saved?.plan?.[dayIndex] || saved?.plan?.[0];
            const dayMeals = firstDay?.meals || {};

            const mappedMeals = ['breakfast', 'lunch', 'dinner', 'snacks']
              .map((key) => {
                const meal = dayMeals?.[key];
                if (!meal) return null;
                const typeLabel =
                  key === 'breakfast' ? 'Breakfast' :
                  key === 'lunch' ? 'Lunch' :
                  key === 'dinner' ? 'Dinner' :
                  'Snacks';

                return {
                  id: meal?.id,
                  name: meal?.title,
                  type: typeLabel,
                  image: meal?.image || meal?.imageUrl,
                  servings: meal?.servings,
                  prepTime: meal?.prepTime,
                  cost: meal?.cost,
                  calories: meal?.calories,
                  protein: meal?.protein,
                  carbs: meal?.carbs,
                  fat: meal?.fat,
                  fiber: meal?.fiber,
                  sugar: meal?.sugar,
                  sodium: meal?.sodium,
                  cholesterol: meal?.cholesterol,
                  rating: meal?.rating || 4,
                  logged: false,
                  status: null
                };
              })
              .filter(Boolean);

            if (mappedMeals.length > 0) {
              setTodaysMeals(mappedMeals);
              setIsLoadingMeals(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing saved meal plan for dashboard', e);
          }
        }

        // Fallback: load random meals from CSV if no saved plan exists yet
        const foods = await getRandomFoods(4);
        if (!foods || foods.length === 0) {
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
            rating: parseFloat(formatted.popularityScore) || 4,
            logged: false,
            status: null
          };
        });

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
  }, [todaysMeals, setIsLoadingMeals]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nutri_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const name = parsed.fullName || parsed.username || parsed.email || 'User';
        const storedWeekly =
          typeof parsed.weeklyBudget === 'number'
            ? parsed.weeklyBudget
            : typeof parsed.dailyBudget === 'number'
            ? parsed.dailyBudget * 7
            : null;

        setUserProfile({
          name,
          role: parsed.userType || 'Fitness Enthusiast',
          age: 28,
          sex: 'N/A',
          height: "5'6\"",
          currentWeight: parsed.currentWeight || 145,
          targetWeight: parsed.targetWeight || 135,
          activityLevel: 'Active',
          weeklyBudget: storedWeekly ?? defaultUserProfile.weeklyBudget,
          dailyBudget:
            storedWeekly != null
              ? Math.round((storedWeekly / 7) * 100) / 100
              : typeof parsed.dailyBudget === 'number'
              ? parsed.dailyBudget
              : defaultUserProfile.dailyBudget,
        });
      }

      const storedGreeting = localStorage.getItem('nutri_greeting');
      if (storedGreeting && !greetingMessage) {
        setGreetingMessage(storedGreeting);
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    }
  }, [greetingMessage, setGreetingMessage]);

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

          const weeklyBudget = data.budget_settings?.weeklyBudget || null;
          const dailyBudgetFromProfile = weeklyBudget
            ? Math.round((weeklyBudget / 7) * 100) / 100
            : base.dailyBudget;

          return {
            ...base,
            name: data.full_name || data.username || data.email || base.name,
            age: data.age || base.age,
            sex: data.gender || base.sex,
            height: data.height_cm ? `${data.height_cm} cm` : base.height,
            currentWeight: data.current_weight_kg || base.currentWeight,
            targetWeight: data.target_weight_kg || base.targetWeight,
            activityLevel: data.activity_level || base.activityLevel,
            weeklyBudget: weeklyBudget ?? base.weeklyBudget,
            dailyBudget: dailyBudgetFromProfile,
          };
        });
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Derive daily nutrition progress from today's logged meals
  const deriveNutritionData = () => {
    // Only count meals the user marked as "ate"
    const eatenMeals = todaysMeals?.filter((meal) => meal?.status === 'ate') || [];

    const totals = eatenMeals.reduce(
      (acc, meal) => {
        const parseVal = (val) => {
          if (typeof val === 'string') {
            const num = parseFloat(val.replace(/[^\d.-]/g, ''));
            return Number.isFinite(num) ? num : 0;
          }
          const num = parseFloat(val);
          return Number.isFinite(num) ? num : 0;
        };

        return {
          calories: acc.calories + parseVal(meal?.calories),
          protein: acc.protein + parseVal(meal?.protein),
          carbs: acc.carbs + parseVal(meal?.carbs),
          fat: acc.fat + parseVal(meal?.fat),
          fiber: acc.fiber + parseVal(meal?.fiber)
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    // Simple default targets (could later come from profile/goals)
    const targets = {
      calories: 2000,
      protein: 75,
      carbs: 250,
      fat: 70,
      fiber: 30
    };

    return {
      calories: { current: totals.calories, target: targets.calories },
      protein: { current: totals.protein, target: targets.protein },
      carbs: { current: totals.carbs, target: targets.carbs },
      fat: { current: totals.fat, target: targets.fat },
      fiber: { current: totals.fiber, target: targets.fiber }
    };
  };

  const nutritionData = deriveNutritionData();

  // Quick stats derived from today's plan and logged meals
  const deriveQuickStats = () => {
    const totalMeals = todaysMeals?.length || 0;
    const parseVal = (val) => {
      if (typeof val === 'string') {
        const num = parseFloat(val.replace(/[^\d.-]/g, ''));
        return Number.isFinite(num) ? num : 0;
      }
      const num = parseFloat(val);
      return Number.isFinite(num) ? num : 0;
    };

    let budgetUsed = 0;
    let dailyBudget = 0;
    let mealsLogged = 0;

    todaysMeals?.forEach((meal) => {
      const cost = parseVal(meal?.cost);
      dailyBudget += cost; // total planned cost for the day
      if (meal?.status) {
        mealsLogged += 1;
        if (meal?.status === 'ate') {
          budgetUsed += cost; // only count eaten meals
        }
      }
    });

    const weeklyAdherence = totalMeals
      ? Math.round((mealsLogged / totalMeals) * 100)
      : 0;

    const weeklyBudget =
      typeof userProfile?.weeklyBudget === 'number'
        ? userProfile.weeklyBudget
        : typeof userProfile?.dailyBudget === 'number'
        ? userProfile.dailyBudget * 7
        : 0;

    const averageDailyBudget = weeklyBudget ? weeklyBudget / 7 : 0;
    const remainingDailyBudget = Math.max(averageDailyBudget - budgetUsed, 0);

    return {
      mealsLogged,
      totalMeals,
      weeklyAdherence,
      budgetUsed,
      dailyBudget,
      averageDailyBudget,
      remainingDailyBudget,
      recipesTried: 23
    };
  };

  const quickStats = deriveQuickStats();

  const handleLogMeal = (mealId, status) => {
    setTodaysMeals(prevMeals => {
      const updatedMeals = prevMeals?.map(meal =>
        meal?.id === mealId
          ? { ...meal, logged: true, status }
          : meal
      );

      try {
        const now = new Date();
        const todayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

        const meal = prevMeals?.find(m => m?.id === mealId);
        if (meal) {
          const rawLogs = localStorage.getItem('mealLogs');
          const logs = rawLogs ? JSON.parse(rawLogs) : [];

          const timeString = now.toTimeString().slice(0, 5); // HH:MM

          const parseVal = (val) => {
            if (typeof val === 'string') {
              const num = parseFloat(val.replace(/[^\d.-]/g, ''));
              return Number.isFinite(num) ? num : 0;
            }
            const num = parseFloat(val);
            return Number.isFinite(num) ? num : 0;
          };

          const parsedCalories = parseVal(meal?.calories);
          const parsedProtein = parseVal(meal?.protein);
          const parsedCarbs = parseVal(meal?.carbs);
          const parsedFat = parseVal(meal?.fat);
          const parsedFiber = parseVal(meal?.fiber);
          const parsedCost = parseVal(meal?.cost);

          let dayLog = logs.find(log => log?.date === todayKey);
          const entry = {
            id: mealId,
            name: meal?.type,
            recipe: meal?.name,
            status,
            time: timeString,
            calories: parsedCalories,
            protein: parsedProtein,
            carbs: parsedCarbs,
            fat: parsedFat,
            fiber: parsedFiber,
            cost: parsedCost
          };

          if (dayLog) {
            const otherMeals = dayLog.meals?.filter(m => m?.id !== mealId) || [];
            dayLog.meals = [...otherMeals, entry];
          } else {
            dayLog = { date: todayKey, meals: [entry] };
            logs.push(dayLog);
          }

          localStorage.setItem('mealLogs', JSON.stringify(logs));
        }
      } catch (e) {
        console.error('Failed to persist meal log', e);
      }

      return updatedMeals;
    });

    // After logging, check if all meals for today have been decided (ate or skipped)
    setTodaysMeals(prevMeals => {
      const allLogged = prevMeals.length > 0 && prevMeals.every(meal => meal?.status);

      if (!allLogged) {
        return prevMeals;
      }

      try {
        const savedPlanRaw = localStorage.getItem('savedMealPlan');
        if (!savedPlanRaw) return prevMeals;

        const saved = JSON.parse(savedPlanRaw);
        const currentIndex = parseInt(localStorage.getItem('dashboardCurrentDayIndex') || '0', 10);
        const nextIndex = (Number.isNaN(currentIndex) ? 0 : currentIndex) + 1;

        const nextDay = saved?.plan?.[nextIndex];
        if (!nextDay) {
          // No more days in the plan; stay on current day
          return prevMeals;
        }

        const dayMeals = nextDay?.meals || {};
        const mappedMeals = ['breakfast', 'lunch', 'dinner', 'snacks']
          .map((key) => {
            const meal = dayMeals?.[key];
            if (!meal) return null;
            const typeLabel =
              key === 'breakfast' ? 'Breakfast' :
              key === 'lunch' ? 'Lunch' :
              key === 'dinner' ? 'Dinner' :
              'Snacks';

            return {
              id: meal?.id,
              name: meal?.title,
              type: typeLabel,
              image: meal?.image || meal?.imageUrl,
              servings: meal?.servings,
              prepTime: meal?.prepTime,
              cost: meal?.cost,
              calories: meal?.calories,
              protein: meal?.protein,
              carbs: meal?.carbs,
              fat: meal?.fat,
              fiber: meal?.fiber,
              sugar: meal?.sugar,
              sodium: meal?.sodium,
              cholesterol: meal?.cholesterol,
              rating: meal?.rating || 4,
              logged: false,
              status: null
            };
          })
          .filter(Boolean);

        if (mappedMeals.length === 0) {
          return prevMeals;
        }

        localStorage.setItem('dashboardCurrentDayIndex', String(nextIndex));
        return mappedMeals;
      } catch (e) {
        console.error('Failed to advance to next meal plan day', e);
        return prevMeals;
      }
    });
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