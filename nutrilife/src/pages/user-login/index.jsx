import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';

const UserLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Frontend-only implementation with placeholder for Python backend
      console.log('Login attempt with:', { email: data?.email });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual Python backend authentication
      // const response = await authenticateUser(data.email, data.password);
      
      // Mock authentication - always succeed for demo
      const mockUser = {
        id: 1,
        email: data?.email,
        name: data?.email?.split('@')?.[0] || 'User',
        isAuthenticated: true
      };
      
      // Store user session (placeholder for real authentication)
      localStorage?.setItem('nutri_user', JSON.stringify(mockUser));
      localStorage?.setItem('nutri_auth_token', 'mock_jwt_token_12345');
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for future password reset functionality
    alert('Password reset functionality will be available soon. Please contact support.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
              <Icon name="Leaf" size={32} color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
            Welcome to NutriLife
          </h1>
          <p className="text-muted-foreground font-body">
            Sign in to your nutrition journey
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground font-body">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full ${errors?.email ? 'border-destructive focus:border-destructive' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors?.email && (
                <p className="text-sm text-destructive font-caption">
                  {errors?.email?.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground font-body">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full ${errors?.password ? 'border-destructive focus:border-destructive' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors?.password && (
                <p className="text-sm text-destructive font-caption">
                  {errors?.password?.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm text-muted-foreground font-body cursor-pointer">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 font-medium font-body transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive font-caption">
                    {loginError}
                  </p>
                </div>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={!isValid || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Future Registration Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground font-caption">
              New to NutriLife?{' '}
              <span className="text-primary font-medium">
                Registration will be available soon
              </span>
            </p>
          </div>

          {/* Backend Integration Note */}
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-primary font-caption">
                <p className="font-medium mb-1">Development Mode</p>
                <p>Login system ready for Python backend integration. Currently using mock authentication.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;