import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing';
import AuthLogin from './pages/auth-login';
import AuthSignup from './pages/auth-signup';
import ProgressTracking from './pages/progress-tracking';
import Dashboard from './pages/dashboard';
import RecipeBrowser from './pages/recipe-browser';
import ShoppingListManager from './pages/shopping-list-manager';
import RecipeDetails from './pages/recipe-details';
import MealPlanGenerator from './pages/meal-plan-generator';
import UserLogin from './pages/user-login';
import UserProfileCreation from './pages/user-profile-creation';
import SanjiAICamera from './pages/sanji-ai-camera';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Landing page as default */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/signup" element={<AuthSignup />} />
        
        {/* Main app routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipe-browser" element={<RecipeBrowser />} />
        <Route path="/recipe-details" element={<RecipeDetails />} />
        <Route path="/sanji-ai-camera" element={<SanjiAICamera />} />
        <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="/shopping-list-manager" element={<ShoppingListManager />} />
        <Route path="/progress-tracking" element={<ProgressTracking />} />
        
        {/* Legacy routes (kept for compatibility) */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-profile-creation" element={<UserProfileCreation />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;