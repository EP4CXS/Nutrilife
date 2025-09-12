import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileSummaryCard = ({ profile }) => {
  const completionPercentage = Math.round((profile?.currentWeight / profile?.targetWeight) * 100);
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground font-heading">
              {profile?.name}
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              {profile?.role} • {profile?.age} years old
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary font-heading">
            ${profile?.dailyBudget}
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Daily Budget
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground font-heading">
            {profile?.currentWeight}
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Current Weight (lbs)
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground font-heading">
            {profile?.targetWeight}
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Target Weight (lbs)
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary font-heading">
            {completionPercentage}%
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Progress
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground font-heading">
            {profile?.activityLevel}
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Activity Level
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;