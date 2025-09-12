import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', tooltip: 'View your nutrition overview' },
    { label: 'Recipes', path: '/recipe-browser', icon: 'BookOpen', tooltip: 'Browse and discover recipes' },
    { label: 'Plan', path: '/meal-plan-generator', icon: 'Calendar', tooltip: 'Generate meal plans' },
    { label: 'Shop', path: '/shopping-list-manager', icon: 'ShoppingCart', tooltip: 'Manage shopping lists' },
    { label: 'Progress', path: '/progress-tracking', icon: 'TrendingUp', tooltip: 'Track your progress' }
  ];

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location?.pathname === '/' || location?.pathname === '/dashboard';
    }
    return location?.pathname?.startsWith(path);
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-50 bg-card border-r border-border transition-all duration-300 ease-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              title={isCollapsed ? item?.tooltip : undefined}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ease-out group touch-target ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`flex-shrink-0 ${
                  isActivePath(item?.path) ? 'text-primary-foreground' : 'text-current'
                }`}
              />
              {!isCollapsed && (
                <span className="font-body">{item?.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center space-x-3 px-3 py-3 rounded-lg bg-muted/50 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full flex-shrink-0">
              <Icon name="User" size={16} color="white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate font-body">
                  Welcome back
                </p>
                <p className="text-xs text-muted-foreground truncate font-caption">
                  Your nutrition journey
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;