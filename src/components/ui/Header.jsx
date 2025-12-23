import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAuthenticated = (() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('nutri_auth') === 'true';
    } catch (e) {
      return false;
    }
  })();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Recipes', path: '/recipe-browser', icon: 'BookOpen' },
    { label: 'Sanji', path: '/sanji-ai-camera', icon: 'Camera' },
    { label: 'Plan', path: '/meal-plan-generator', icon: 'Calendar' },
    { label: 'Shop', path: '/shopping-list-manager', icon: 'ShoppingCart' },
    { label: 'Progress', path: '/progress-tracking', icon: 'TrendingUp' }
  ];

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location?.pathname === '/' || location?.pathname === '/dashboard';
    }
    return location?.pathname?.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCreateProfile = () => {
    navigate('/user-profile-creation');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('nutri_auth');
      localStorage.removeItem('nutri_token');
      localStorage.removeItem('nutri_user');
      localStorage.removeItem('nutri_greeting');
    } catch (e) {
      // ignore storage errors
    }

    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Leaf" size={20} color="white" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            NutriLife
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Profile & Mobile Menu */}
        <div className="flex items-center space-x-3">
          {/* Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="hidden sm:flex"
            >
              <Icon name="User" size={20} />
            </Button>
            
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={handleCreateProfile}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Create Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={isAuthenticated ? handleLogout : () => navigate('/user-login')}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name={isAuthenticated ? 'LogOut' : 'LogIn'} size={16} />
                    <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 touch-target ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            {/* Mobile Profile Options */}
            <div className="border-t border-border pt-2 mt-2">
              <button
                onClick={() => {
                  handleCreateProfile();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
              >
                <Icon name="Settings" size={20} />
                <span>Create Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
              >
                <Icon name="User" size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    handleLogout();
                  } else {
                    navigate('/user-login');
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
              >
                <Icon name={isAuthenticated ? 'LogOut' : 'LogIn'} size={20} />
                <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;