import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AIProcessingIndicator from '../../components/ui/AIProcessingIndicator';
import CameraViewfinder from './components/CameraViewfinder';
import IngredientRecognition from './components/IngredientRecognition';
import RecipeGeneration from './components/RecipeGeneration';
import PhotoGallery from './components/PhotoGallery';
import VoiceCommands from './components/VoiceCommands';

const SanjiAICamera = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('camera'); // 'camera', 'recognition', 'recipes', 'gallery'
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedIngredients, setRecognizedIngredients] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState('camera');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [cameraMode, setCameraMode] = useState('photo');

  useEffect(() => {
    // Set page title
    document.title = 'Sanji AI Camera - NutriLife';
  }, []);

  const handlePhotoCapture = async (imageData) => {
    setIsProcessing(true);
    setProcessingType('camera');
    setCapturedImage(imageData);

    // Add to photo gallery
    const newPhoto = {
      id: Date.now(),
      url: imageData?.url,
      thumbnail: imageData?.url,
      timestamp: imageData?.timestamp,
      lightingQuality: imageData?.lightingQuality,
      recognizedIngredients: [],
      processingStatus: 'processing',
      fileSize: '2.1 MB',
      dimensions: '1920x1080'
    };

    setCapturedPhotos(prev => [newPhoto, ...prev]);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('recognition');
      
      // Update photo status
      setCapturedPhotos(prev => 
        prev?.map(photo => 
          photo?.id === newPhoto?.id 
            ? { ...photo, processingStatus: 'completed' }
            : photo
        )
      );
    }, 2000);
  };

  const handleIngredientsConfirmed = (ingredients) => {
    setRecognizedIngredients(ingredients);
    setIsProcessing(true);
    setProcessingType('meal-plan');
    
    // Update the captured photo with recognized ingredients
    if (capturedImage) {
      setCapturedPhotos(prev => 
        prev?.map(photo => 
          photo?.timestamp === capturedImage?.timestamp
            ? { ...photo, recognizedIngredients: ingredients?.map(ing => ing?.name) }
            : photo
        )
      );
    }

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('recipes');
    }, 3000);
  };

  const handleRecipeSelect = (recipe) => {
    navigate('/recipe-details', { state: { recipe, fromCamera: true } });
  };

  const handleVoiceCommand = (action, data) => {
    switch (action) {
      case 'capture':
        if (currentStep === 'camera') {
          // Trigger camera capture
          document.querySelector('[data-capture-button]')?.click();
        }
        break;
      case 'gallery': setCurrentStep('gallery');
        break;
      case 'flash_on': case'flash_off':
        // Handle flash toggle
        break;
      case 'help':
        // Show help modal or navigate to help
        break;
      case 'stop':
        setVoiceEnabled(false);
        break;
      default:
        console.log('Unhandled voice command:', action);
    }
  };

  const handlePhotoSelect = (photo) => {
    setSelectedPhoto(photo);
    if (photo?.recognizedIngredients?.length > 0) {
      setCurrentStep('recipes');
    }
  };

  const handlePhotoDelete = (photoId) => {
    setCapturedPhotos(prev => prev?.filter(photo => photo?.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  const handlePhotoEdit = (photoId, editSettings) => {
    setCapturedPhotos(prev => 
      prev?.map(photo => 
        photo?.id === photoId 
          ? { ...photo, editSettings }
          : photo
      )
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'camera': return 'Capture Ingredients';
      case 'recognition': return 'Ingredient Recognition';
      case 'recipes': return 'AI Recipe Suggestions';
      case 'gallery': return 'Photo Gallery';
      default: return 'Sanji AI Camera';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'camera': return 'Position ingredients in the frame and capture a photo';
      case 'recognition': return 'Review and confirm detected ingredients';
      case 'recipes': return 'Discover recipes based on your ingredients';
      case 'gallery': return 'Browse and manage your captured photos';
      default: return 'AI-powered ingredient recognition and recipe generation';
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      <Header />
      <main className="pt-16 pb-20 md:pb-6">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {getStepTitle()}
                </h1>
                <p className="text-muted-foreground">
                  {getStepDescription()}
                </p>
              </div>

              {/* Step Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {['camera', 'recognition', 'recipes', 'gallery']?.map((step, index) => (
                  <React.Fragment key={step}>
                    <Button
                      variant={currentStep === step ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentStep(step)}
                      disabled={
                        (step === 'recognition' && !capturedImage) ||
                        (step === 'recipes' && recognizedIngredients?.length === 0)
                      }
                      className="capitalize"
                    >
                      {step === 'camera' && <Icon name="Camera" size={16} className="mr-2" />}
                      {step === 'recognition' && <Icon name="Search" size={16} className="mr-2" />}
                      {step === 'recipes' && <Icon name="ChefHat" size={16} className="mr-2" />}
                      {step === 'gallery' && <Icon name="Image" size={16} className="mr-2" />}
                      {step}
                    </Button>
                    {index < 3 && <Icon name="ChevronRight" size={16} className="text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Mobile Step Navigation */}
            <div className="md:hidden">
              <div className="flex items-center space-x-1 mb-4">
                {['camera', 'recognition', 'recipes', 'gallery']?.map((step, index) => (
                  <React.Fragment key={step}>
                    <div
                      className={`flex-1 h-2 rounded-full ${
                        currentStep === step ? 'bg-primary' : 
                        (step === 'camera' || 
                         (step === 'recognition' && capturedImage) ||
                         (step === 'recipes' && recognizedIngredients?.length > 0) ||
                         step === 'gallery') ? 'bg-primary/30' : 'bg-muted'
                      }`}
                    />
                  </React.Fragment>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Capture</span>
                <span>Recognize</span>
                <span>Recipes</span>
                <span>Gallery</span>
              </div>
            </div>
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="mb-6">
              <AIProcessingIndicator
                isProcessing={true}
                type={processingType}
                size="default"
                className="bg-card border border-border rounded-organic-lg"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Primary Content Area */}
            <div className="lg:col-span-2">
              {currentStep === 'camera' && (
                <div className="bg-card border border-border rounded-organic-lg overflow-hidden">
                  <div className="h-96 md:h-[500px]">
                    <CameraViewfinder
                      onCapture={handlePhotoCapture}
                      isProcessing={isProcessing}
                      captureMode={cameraMode}
                      onModeChange={setCameraMode}
                    />
                  </div>
                </div>
              )}

              {currentStep === 'recognition' && capturedImage && (
                <div className="bg-card border border-border rounded-organic-lg p-6">
                  <IngredientRecognition
                    capturedImage={capturedImage}
                    onIngredientsConfirmed={handleIngredientsConfirmed}
                    isProcessing={isProcessing}
                  />
                </div>
              )}

              {currentStep === 'recipes' && (
                <div className="bg-card border border-border rounded-organic-lg p-6">
                  <RecipeGeneration
                    ingredients={recognizedIngredients}
                    onRecipeSelect={handleRecipeSelect}
                    isGenerating={isProcessing}
                  />
                </div>
              )}

              {currentStep === 'gallery' && (
                <div className="bg-card border border-border rounded-organic-lg p-6">
                  <PhotoGallery
                    photos={capturedPhotos}
                    onPhotoSelect={handlePhotoSelect}
                    onPhotoDelete={handlePhotoDelete}
                    onPhotoEdit={handlePhotoEdit}
                    selectedPhoto={selectedPhoto}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voice Commands */}
              <VoiceCommands
                onCommand={handleVoiceCommand}
                isEnabled={voiceEnabled}
              />

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-organic p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="BarChart3" size={16} />
                  <span>Session Stats</span>
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Photos Captured</span>
                    <span className="text-sm font-medium text-foreground">{capturedPhotos?.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ingredients Found</span>
                    <span className="text-sm font-medium text-foreground">{recognizedIngredients?.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Voice Commands</span>
                    <span className={`text-sm font-medium ${voiceEnabled ? 'text-success' : 'text-muted-foreground'}`}>
                      {voiceEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-organic p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Zap" size={16} />
                  <span>Quick Actions</span>
                </h4>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/generate-meal-plan')}
                    iconName="ChefHat"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Generate Meal Plan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/recipe-details')}
                    iconName="BookOpen"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Browse Recipes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/user-dashboard')}
                    iconName="Home"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-muted/50 rounded-organic p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Icon name="Lightbulb" size={16} />
                  <span>Photography Tips</span>
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use natural lighting when possible</li>
                  <li>• Keep ingredients separated for better recognition</li>
                  <li>• Clean camera lens for clearer photos</li>
                  <li>• Hold device steady while capturing</li>
                  <li>• Use voice commands for hands-free operation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SanjiAICamera;