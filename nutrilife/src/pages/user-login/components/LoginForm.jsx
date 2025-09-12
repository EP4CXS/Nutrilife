import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, isLoading, error }) => {
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

  return (
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
          onClick={() => alert('Password reset functionality will be available soon. Please contact support.')}
          className="text-sm text-primary hover:text-primary/80 font-medium font-body transition-colors"
        >
          Forgot password?
        </button>
      </div>

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
  );
};

export default LoginForm;