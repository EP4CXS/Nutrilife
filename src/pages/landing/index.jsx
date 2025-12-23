import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { getPopularFoods, formatFoodForDisplay } from '../../utils/foodData';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const saladImages = [
    '/assets/images/salad1.png',
    '/assets/images/salad2.png',
    '/assets/images/salad3.png'
  ];

  // Load featured foods from CSV
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foods = await getPopularFoods(6);
        setFeaturedFoods(foods.map(formatFoodForDisplay));
      } catch (error) {
        console.error('Error loading foods:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % saladImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [saladImages.length]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dark blur background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(78, 255, 13, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
      }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/assets/images/Nlogo.png" 
              alt="NutriLife Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="#home" className="text-white hover:text-primary transition-colors text-lg font-medium">
              Home
            </a>
            <a href="#menu" className="text-white hover:text-primary transition-colors text-lg font-medium">
              Menu
            </a>
            <a href="#services" className="text-white hover:text-primary transition-colors text-lg font-medium">
              Services
            </a>
            <a href="#offers" className="text-white hover:text-primary transition-colors text-lg font-medium">
              Offers
            </a>
            <a href="#contacts" className="text-white hover:text-primary transition-colors text-lg font-medium">
              Contacts
            </a>
          </div>
          
          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              boxShadow: '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)'
            }}
          >
            Log In
          </Button>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Your path<br />
                to better <span className="text-primary" style={{ textShadow: '0 0 30px rgba(255, 69, 0, 0.6)' }}>meals.</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Personalized nutrition planning with an AI-powered meal generator, 
                helping you make choices that match your goals, energy needs, and daily routine.
              </p>
              
              <Button
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: '0 4px 12px 0 rgba(255, 69, 0, 0.4), 0 0 20px 0 rgba(255, 69, 0, 0.2)'
                }}
              >
                Get Started
              </Button>
            </div>
            
            {/* Right Content - Image Slideshow */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px]">
                {saladImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Salad ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      animation: index === currentImageIndex ? 'slideInOut 5s ease-in-out infinite' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Foods Section */}
        {featuredFoods.length > 0 && (
          <div className="relative z-10 py-16 px-8">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-primary" style={{ textShadow: '0 0 20px rgba(255, 69, 0, 0.5)' }}>
                Popular Filipino Dishes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredFoods.slice(0, 6).map((food) => (
                  <div 
                    key={food.id}
                    className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  >
                    {/* Image */}
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      <img 
                        src={food.imageUrl} 
                        alt={food.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-primary">
                        {food.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {food.description}
                      </p>
                      
                      {/* Row 1: Serves, Prep Time, Cost, Calories */}
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="Users" size={14} className="text-primary" />
                          <span className="text-gray-300">{food.servings}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size={14} className="text-primary" />
                          <span className="text-gray-300">{food.prepTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="DollarSign" size={14} className="text-primary" />
                          <span className="text-gray-300">₱{food.cost}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Flame" size={14} className="text-primary" />
                          <span className="text-gray-300">{food.calories} kcal</span>
                        </div>
                      </div>
                      
                      {/* Nutrition Summary */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-gray-400">Protein</div>
                            <div className="text-primary font-semibold">{food.protein}g</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-400">Carbs</div>
                            <div className="text-primary font-semibold">{food.carbs}g</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-400">Fat</div>
                            <div className="text-primary font-semibold">{food.fat}g</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInOut {
          0% { transform: translateX(120%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          70% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(120%); opacity: 0; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
