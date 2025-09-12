import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const routeMap = {
    '/dashboard': 'Dashboard',
    '/recipe-browser': 'Recipes',
    '/recipe-details': 'Recipe Details',
    '/meal-plan-generator': 'Meal Plan',
    '/shopping-list-manager': 'Shopping List',
    '/progress-tracking': 'Progress'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard' }];

    if (pathSegments?.length > 0 && pathSegments?.[0] !== 'dashboard') {
      let currentPath = '';
      pathSegments?.forEach((segment) => {
        currentPath += `/${segment}`;
        const label = routeMap?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
        breadcrumbs?.push({ label, path: currentPath });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="text-muted-foreground/60" />
            )}
            {index === breadcrumbs?.length - 1 ? (
              <span className="font-medium text-foreground font-body">
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-foreground transition-colors duration-150 font-body"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;