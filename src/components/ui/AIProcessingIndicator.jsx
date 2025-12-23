import React from 'react';
import Icon from '../AppIcon';

const AIProcessingIndicator = ({
  isProcessing = false,
  type = 'camera',
  size = 'default'
}) => {
  if (!isProcessing) return null;

  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return { icon: 18, padding: 'p-3', title: 'text-sm', subtitle: 'text-xs' };
      case 'lg':
        return { icon: 26, padding: 'p-6', title: 'text-base', subtitle: 'text-sm' };
      default:
        return { icon: 22, padding: 'p-4', title: 'text-sm', subtitle: 'text-xs' };
    }
  })();

  const copy = (() => {
    switch (type) {
      case 'meal-plan':
        return { title: 'Generating recipes…', subtitle: 'Using detected ingredients' };
      case 'recognition':
        return { title: 'Recognizing ingredients…', subtitle: 'Analyzing your photo' };
      case 'camera':
      default:
        return { title: 'Processing…', subtitle: 'Please wait a moment' };
    }
  })();

  return (
    <div className={`w-full rounded-organic bg-muted/50 border border-border ${sizeClasses.padding}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Icon name="Loader2" size={sizeClasses.icon} className="animate-spin text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${sizeClasses.title} font-medium text-foreground font-body truncate`}>
            {copy.title}
          </p>
          <p className={`${sizeClasses.subtitle} text-muted-foreground font-caption truncate`}>
            {copy.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingIndicator;
