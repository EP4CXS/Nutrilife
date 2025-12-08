import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';


import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';

// Import components
import BasicInfo from './components/BasicInfo';
import DietaryPreferences from './components/DietaryPreferences';
import NutritionGoals from './components/NutritionGoals';
import BudgetSettings from './components/BudgetSettings';

const UserProfileCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    
    // Dietary Preferences
    dietaryRestrictions: [],
    allergies: [],
    dislikedFoods: [],
    cuisinePreferences: [],
    cookingSkillLevel: '',
    mealPreparationTime: '',
    
    // Nutrition Goals
    primaryGoal: '',
    targetCalories: '',
    macroRatios: {
      protein: 25,
      carbs: 45,
      fat: 30
    },
    nutritionalFocus: [],

    // Budget Settings
    weeklyBudget: '',
    budgetPriority: '',
    shoppingPreference: '',
    organicPreference: false
  });

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
          return;
        }

        const data = await response.json();

        setProfileData((prev) => ({
          ...prev,
          firstName: data.full_name ? data.full_name.split(' ')[0] : prev.firstName,
          lastName: data.full_name ? data.full_name.split(' ').slice(1).join(' ') : prev.lastName,
          email: data.email || prev.email,
          age: data.age ? String(data.age) : prev.age,
          gender: data.gender || prev.gender,
          height: data.height_cm ? String(data.height_cm) : prev.height,
          currentWeight: data.current_weight_kg ? String(data.current_weight_kg) : prev.currentWeight,
          targetWeight: data.target_weight_kg ? String(data.target_weight_kg) : prev.targetWeight,
          activityLevel: data.activity_level || prev.activityLevel,
          primaryGoal: data.health_goals || prev.primaryGoal,
          dietaryRestrictions: data.dietary_preferences?.dietaryRestrictions || prev.dietaryRestrictions,
          allergies: data.dietary_preferences?.allergies || prev.allergies,
          dislikedFoods: data.dietary_preferences?.dislikedFoods || prev.dislikedFoods,
          cuisinePreferences: data.dietary_preferences?.cuisinePreferences || prev.cuisinePreferences,
          weeklyBudget: data.budget_settings?.weeklyBudget ? String(data.budget_settings.weeklyBudget) : prev.weeklyBudget,
          budgetPriority: data.budget_settings?.budgetPriority || prev.budgetPriority,
          shoppingPreference: data.budget_settings?.shoppingPreference || prev.shoppingPreference,
          organicPreference: typeof data.budget_settings?.organicPreference === 'boolean'
            ? data.budget_settings.organicPreference
            : prev.organicPreference,
        }));
      } catch (err) {
      }
    };

    fetchProfile();
  }, [navigate]);

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: 'User',
      component: BasicInfo
    },
    {
      id: 2,
      title: 'Dietary Preferences',
      description: 'Your food preferences and restrictions',
      icon: 'Apple',
      component: DietaryPreferences
    },
    {
      id: 3,
      title: 'Nutrition Goals',
      description: 'Set your health and fitness targets',
      icon: 'Target',
      component: NutritionGoals
    },
    {
      id: 4,
      title: 'Budget Settings',
      description: 'Configure your meal planning budget',
      icon: 'DollarSign',
      component: BudgetSettings
    }
  ];

  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const token = localStorage.getItem('nutri_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();

    const payload = {
      full_name: fullName || null,
      age: profileData.age ? Number(profileData.age) : null,
      gender: profileData.gender || null,
      height_cm: profileData.height ? Number(profileData.height) : null,
      current_weight_kg: profileData.currentWeight ? Number(profileData.currentWeight) : null,
      target_weight_kg: profileData.targetWeight ? Number(profileData.targetWeight) : null,
      activity_level: profileData.activityLevel || null,
      health_goals: profileData.primaryGoal || null,
      dietary_preferences: {
        dietaryRestrictions: profileData.dietaryRestrictions,
        allergies: profileData.allergies,
        dislikedFoods: profileData.dislikedFoods,
        cuisinePreferences: profileData.cuisinePreferences,
      },
      budget_settings: {
        weeklyBudget: profileData.weeklyBudget ? Number(profileData.weeklyBudget) : null,
        budgetPriority: profileData.budgetPriority || null,
        shoppingPreference: profileData.shoppingPreference || null,
        organicPreference: profileData.organicPreference,
      },
    };

    try {
      const response = await fetch('http://localhost:8080/api/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return;
      }

      navigate('/dashboard', { state: { newProfile: true } });
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData?.firstName && profileData?.lastName && profileData?.age && profileData?.gender;
      case 2:
        return profileData?.cookingSkillLevel && profileData?.mealPreparationTime;
      case 3:
        return profileData?.primaryGoal && profileData?.targetCalories;
      case 4:
        return profileData?.weeklyBudget && profileData?.budgetPriority;
      default:
        return true;
    }
  };

  const getCurrentStepComponent = () => {
    const StepComponent = steps?.find(step => step?.id === currentStep)?.component;
    return StepComponent ? (
      <StepComponent
        data={profileData}
        onUpdate={updateProfileData}
      />
    ) : null;
  };

  const completedSteps = currentStep - 1;
  const progressPercentage = (completedSteps / steps?.length) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          <Breadcrumb />
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
              Create Your Profile
            </h1>
            <p className="text-muted-foreground font-body">
              Let's personalize your NutriLife experience with your preferences and goals
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground font-body">
                Step {currentStep} of {steps?.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground font-body">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mt-6">
              {steps?.map((step, index) => (
                <div key={step?.id} className="flex flex-col items-center space-y-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-150 ${
                      step?.id <= currentStep
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-muted text-muted-foreground'
                    }`}
                  >
                    {step?.id < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-medium font-body ${
                      step?.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-caption hidden sm:block">
                      {step?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-lg p-6 lg:p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground font-heading mb-2">
                {steps?.find(step => step?.id === currentStep)?.title}
              </h2>
              <p className="text-muted-foreground font-body">
                {steps?.find(step => step?.id === currentStep)?.description}
              </p>
            </div>
            
            {getCurrentStepComponent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < steps?.length ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  iconName={isSubmitting ? "Loader2" : "Check"}
                  iconPosition="left"
                  className={isSubmitting ? "animate-spin" : ""}
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now - I'll complete this later
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileCreation;