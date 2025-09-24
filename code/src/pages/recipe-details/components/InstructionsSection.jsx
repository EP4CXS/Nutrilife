import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InstructionsSection = ({ instructions, equipment = [] }) => {
  const [completedSteps, setCompletedSteps] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const toggleStepCompletion = (stepIndex) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev?.[stepIndex]
    }));
  };

  const goToStep = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  const nextStep = () => {
    if (activeStep < instructions?.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const completedCount = Object.values(completedSteps)?.filter(Boolean)?.length;
  const progressPercentage = (completedCount / instructions?.length) * 100;

  return (
    <div className="space-y-6">
      {/* Equipment Section */}
      {equipment?.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Wrench" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Equipment Needed
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {equipment?.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg"
              >
                <Icon name="Tool" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Instructions Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="ChefHat" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground font-heading">
              Instructions
            </h2>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground font-body">
                {completedCount} of {instructions?.length} steps
              </p>
              <p className="text-xs text-muted-foreground font-caption">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop View - All Steps */}
        <div className="hidden lg:block space-y-4">
          {instructions?.map((instruction, index) => {
            const isCompleted = completedSteps?.[index] || false;
            const isActive = index === activeStep;
            
            return (
              <div
                key={index}
                className={`flex space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-success/5 border-success/20'
                    : isActive
                    ? 'bg-primary/5 border-primary/20' :'bg-muted/30 border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0">
                  <button
                    onClick={() => toggleStepCompletion(index)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? 'bg-success border-success' :'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={16} className="text-white" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`text-sm font-medium font-body ${
                      isCompleted ? 'text-success' : 'text-foreground'
                    }`}>
                      Step {index + 1}
                      {instruction?.time && (
                        <span className="ml-2 text-xs text-muted-foreground font-caption">
                          ({instruction?.time})
                        </span>
                      )}
                    </h4>
                    {instruction?.temperature && (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-caption">
                        {instruction?.temperature}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-body leading-relaxed ${
                    isCompleted ? 'text-success/80 line-through' : 'text-foreground'
                  }`}>
                    {instruction?.text}
                  </p>
                  {instruction?.tip && (
                    <div className="mt-2 p-2 bg-accent/5 border border-accent/20 rounded text-xs text-accent font-caption">
                      <Icon name="Lightbulb" size={12} className="inline mr-1" />
                      Tip: {instruction?.tip}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View - Step by Step */}
        <div className="lg:hidden">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-foreground font-body">
                Step {activeStep + 1} of {instructions?.length}
              </h3>
              {instructions?.[activeStep]?.time && (
                <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded-full font-caption">
                  {instructions?.[activeStep]?.time}
                </span>
              )}
            </div>
            <div className="flex space-x-2 mb-4">
              {instructions?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index === activeStep
                      ? 'bg-primary'
                      : index < activeStep || completedSteps?.[index]
                      ? 'bg-success' :'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <p className="text-foreground font-body leading-relaxed mb-3">
              {instructions?.[activeStep]?.text}
            </p>
            {instructions?.[activeStep]?.tip && (
              <div className="p-2 bg-accent/5 border border-accent/20 rounded text-xs text-accent font-caption">
                <Icon name="Lightbulb" size={12} className="inline mr-1" />
                Tip: {instructions?.[activeStep]?.tip}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between space-x-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={activeStep === 0}
              iconName="ChevronLeft"
              iconPosition="left"
              className="flex-1"
            >
              Previous
            </Button>
            
            <Button
              variant={completedSteps?.[activeStep] ? "success" : "outline"}
              onClick={() => toggleStepCompletion(activeStep)}
              iconName={completedSteps?.[activeStep] ? "Check" : "Circle"}
              className="touch-target"
            >
              {completedSteps?.[activeStep] ? "Done" : "Mark Done"}
            </Button>
            
            <Button
              variant="outline"
              onClick={nextStep}
              disabled={activeStep === instructions?.length - 1}
              iconName="ChevronRight"
              iconPosition="right"
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsSection;