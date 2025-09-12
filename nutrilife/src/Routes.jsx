import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProgressTracking from './pages/progress-tracking';
import Dashboard from './pages/dashboard';
import RecipeBrowser from './pages/recipe-browser';
import ShoppingListManager from './pages/shopping-list-manager';
import RecipeDetails from './pages/recipe-details';
import MealPlanGenerator from './pages/meal-plan-generator';
import UserLogin from './pages/user-login';
import UserProfileCreation from './pages/user-profile-creation';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-profile-creation" element={<UserProfileCreation />} />
        <Route path="/progress-tracking" element={<ProgressTracking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipe-browser" element={<RecipeBrowser />} />
        <Route path="/shopping-list-manager" element={<ShoppingListManager />} />
        <Route path="/recipe-details" element={<RecipeDetails />} />
        <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;