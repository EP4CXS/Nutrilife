import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AuthSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    primaryGoal: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Account Details',
      description: 'Tell us who you are',
    },
    {
      id: 2,
      title: 'Security',
      description: 'Secure your NutriLife account',
    },
    {
      id: 3,
      title: 'Health Profile',
      description: 'Basic info for your nutrition goals',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.age.trim()) {
      setError('Age is required');
      return false;
    }
    if (Number.isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      setError('Please enter a valid age');
      return false;
    }
    if (!formData.gender.trim()) {
      setError('Gender is required');
      return false;
    }
    if (!formData.primaryGoal.trim()) {
      setError('Primary goal is required');
      return false;
    }
    return true;
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!formData.age.trim()) {
        setError('Age is required');
        return false;
      }
      if (Number.isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
        setError('Please enter a valid age');
        return false;
      }
      if (!formData.gender.trim()) {
        setError('Gender is required');
        return false;
      }
      if (!formData.primaryGoal.trim()) {
        setError('Primary goal is required');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || 'Failed to create account. Please try again.');
        return;
      }

      if (data?.token) {
        localStorage.setItem('nutri_auth', 'true');
        localStorage.setItem('nutri_token', data.token);
      }

      const userPayload = {
        ...data?.user,
        fullName: formData.fullName
      };

      localStorage.setItem('nutri_user', JSON.stringify(userPayload));

      if (data?.message) {
        localStorage.setItem('nutri_greeting', data.message);
      }

      if (data?.token) {
        const profilePayload = {
          full_name: formData.fullName || null,
          age: formData.age ? Number(formData.age) : null,
          gender: formData.gender || null,
          health_goals: formData.primaryGoal || null,
          height_cm: null,
          current_weight_kg: null,
          target_weight_kg: null,
          activity_level: null,
          dietary_preferences: {
            dietaryRestrictions: [],
            allergies: [],
            dislikedFoods: [],
            cuisinePreferences: [],
          },
          budget_settings: {
            weeklyBudget: null,
            budgetPriority: null,
            shoppingPreference: null,
            organicPreference: false,
          },
        };

        try {
          fetch('http://localhost:8080/api/me/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify(profilePayload),
          }).catch(() => {});
        } catch (e) {
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const completedSteps = currentStep - 1;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/assets/images/Nlogo.png"
                alt="NutriLife Logo"
                className="h-16 w-auto"
              />
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 text-primary"
              style={{ textShadow: '0 0 20px rgba(255, 69, 0, 0.5)' }}
            >
              📝 Create Your Account
            </h1>
            <p className="text-gray-300">
              Just a couple of quick steps to personalize your NutriLife experience
            </p>
          </div>

          <div className="glass-card rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-300">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-300">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center space-y-1">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs md:text-sm transition-colors duration-150 ${
                        step.id <= currentStep
                          ? 'bg-primary border-primary text-black'
                          : 'bg-black/40 border-white/20 text-gray-400'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Icon name="Check" size={14} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-[11px] md:text-xs font-medium ${
                          step.id <= currentStep ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="hidden md:block text-[10px] text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-primary">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-primary">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-primary">
                      Username
                    </label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium text-primary">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="13"
                      max="120"
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium text-primary">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full rounded-md bg-input text-white border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="" className="bg-black text-gray-700">
                        Select gender
                      </option>
                      <option value="male" className="bg-black text-white">
                        Male
                      </option>
                      <option value="female" className="bg-black text-white">
                        Female
                      </option>
                      <option value="other" className="bg-black text-white">
                        Other
                      </option>
                      <option value="prefer-not-to-say" className="bg-black text-white">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="primaryGoal" className="text-sm font-medium text-primary">
                      Primary Health Goal
                    </label>
                    <select
                      id="primaryGoal"
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full rounded-md bg-input text-white border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="" className="bg-black text-gray-700">
                        Select your goal
                      </option>
                      <option value="weight-loss" className="bg-black text-white">
                        Weight Loss
                      </option>
                      <option value="weight-gain" className="bg-black text-white">
                        Weight Gain
                      </option>
                      <option value="muscle-gain" className="bg-black text-white">
                        Muscle Gain
                      </option>
                      <option value="maintenance" className="bg-black text-white">
                        Weight Maintenance
                      </option>
                      <option value="general-health" className="bg-black text-white">
                        General Health & Wellness
                      </option>
                    </select>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-primary">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-primary">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-input text-white placeholder-gray-500 border-border focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isLoading}
                  className="px-4 py-2 rounded-full text-sm border-white/20 text-gray-200 hover:bg-white/5 disabled:opacity-40"
                >
                  Back
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      boxShadow:
                        '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)',
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      boxShadow:
                        '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)',
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Complete Sign Up'
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;
