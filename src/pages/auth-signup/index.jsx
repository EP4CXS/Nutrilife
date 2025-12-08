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
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    return true;
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

      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/assets/images/Nlogo.png" 
                alt="NutriLife Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-primary" style={{ textShadow: '0 0 20px rgba(255, 69, 0, 0.5)' }}>
              📝 Sign Up
            </h1>
            <p className="text-gray-300">
              Create your account to start your nutrition journey
            </p>
          </div>

          {/* Signup Form Card */}
          <div className="glass-card rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
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

              {/* Email Field */}
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

              {/* Username Field */}
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
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

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
                style={{
                  boxShadow: '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            {/* Login Link */}
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
