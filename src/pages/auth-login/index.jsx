import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AuthLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          emailOrUsername: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || 'Invalid username or password');
        return;
      }

      if (data?.token) {
        localStorage.setItem('nutri_auth', 'true');
        localStorage.setItem('nutri_token', data.token);
      }

      if (data?.user) {
        localStorage.setItem('nutri_user', JSON.stringify(data.user));
      }

      if (data?.message) {
        localStorage.setItem('nutri_greeting', data.message);
      }

      // Clear any per-session UI state from previous users so the new
      // account gets a fresh dashboard and feature views.
      try {
        if (typeof sessionStorage !== 'undefined') {
          Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith('nutrilife_')) {
              sessionStorage.removeItem(key);
            }
          });
        }
      } catch {
        // Ignore storage errors
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
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
              🔐 Log In
            </h1>
            <p className="text-gray-300">
              Sign in to access your nutrition dashboard
            </p>
          </div>

          {/* Login Form Card */}
          <div className="glass-card rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-primary">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  value={formData.password}
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
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{
                  boxShadow: '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Back to Home Button */}
            <div className="mt-4">
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="w-full text-white border-primary hover:bg-primary/10"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
