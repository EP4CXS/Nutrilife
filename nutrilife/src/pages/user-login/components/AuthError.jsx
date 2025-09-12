import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthError = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <div className="flex items-start space-x-3">
        <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-destructive font-body mb-1">
            Authentication Error
          </h4>
          <p className="text-sm text-destructive/80 font-caption mb-3">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-destructive hover:text-destructive/80 font-medium underline transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthError;