import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BasicInfo = ({ data, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const activityLevelOptions = [
    { value: '', label: 'Select Activity Level' },
    { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
    { value: 'lightly-active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
    { value: 'moderately-active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
    { value: 'very-active', label: 'Very Active (Hard exercise 6-7 days/week)' },
    { value: 'extremely-active', label: 'Extremely Active (Very hard exercise, physical job)' }
  ];

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={data?.firstName || ''}
          onChange={(e) => handleChange('firstName', e?.target?.value)}
          placeholder="Enter your first name"
          required
        />
        <Input
          label="Last Name"
          value={data?.lastName || ''}
          onChange={(e) => handleChange('lastName', e?.target?.value)}
          placeholder="Enter your last name"
          required
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={data?.email || ''}
        onChange={(e) => handleChange('email', e?.target?.value)}
        placeholder="Enter your email address"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          value={data?.age || ''}
          onChange={(e) => handleChange('age', e?.target?.value)}
          placeholder="Enter your age"
          min="13"
          max="120"
          required
        />
        <Select
          label="Gender"
          value={data?.gender || ''}
          onChange={(value) => handleChange('gender', value)}
          options={genderOptions}
          required
        />
      </div>

      {/* Physical Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Height (inches)"
          type="number"
          value={data?.height || ''}
          onChange={(e) => handleChange('height', e?.target?.value)}
          placeholder="e.g. 68"
          min="36"
          max="96"
          step="0.5"
        />
        <Input
          label="Current Weight (lbs)"
          type="number"
          value={data?.currentWeight || ''}
          onChange={(e) => handleChange('currentWeight', e?.target?.value)}
          placeholder="e.g. 150"
          min="50"
          max="500"
          step="0.1"
        />
        <Input
          label="Target Weight (lbs)"
          type="number"
          value={data?.targetWeight || ''}
          onChange={(e) => handleChange('targetWeight', e?.target?.value)}
          placeholder="e.g. 140"
          min="50"
          max="500"
          step="0.1"
        />
      </div>

      <Select
        label="Activity Level"
        value={data?.activityLevel || ''}
        onChange={(value) => handleChange('activityLevel', value)}
        options={activityLevelOptions}
        required
      />

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground font-body mb-2">
          Why do we need this information?
        </h4>
        <p className="text-xs text-muted-foreground font-caption">
          This information helps us calculate your daily calorie needs and create personalized meal plans that align with your health goals and lifestyle.
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;