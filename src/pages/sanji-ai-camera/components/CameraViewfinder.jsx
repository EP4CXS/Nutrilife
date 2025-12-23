import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraViewfinder = ({ 
  onCapture, 
  isProcessing = false, 
  captureMode = 'photo',
  onModeChange 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [focusPoint, setFocusPoint] = useState(null);
  const [lightingQuality, setLightingQuality] = useState('good');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setLightingQuality('poor');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef?.current || !canvasRef?.current || isProcessing) return;

    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');

    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);

    canvas?.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      onCapture({
        blob,
        url: imageUrl,
        timestamp: new Date(),
        lightingQuality,
        flashUsed: flashMode === 'on'
      });
    }, 'image/jpeg', 0.9);
  };

  const handleViewfinderClick = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = ((e?.clientX - rect?.left) / rect?.width) * 100;
    const y = ((e?.clientY - rect?.top) / rect?.height) * 100;
    
    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 2000);
  };

  const toggleFlash = () => {
    setFlashMode(prev => prev === 'off' ? 'on' : 'off');
  };

  const getLightingIndicator = () => {
    switch (lightingQuality) {
      case 'excellent':
        return { color: 'text-success', icon: 'Sun', message: 'Excellent lighting' };
      case 'good':
        return { color: 'text-success', icon: 'Sun', message: 'Good lighting' };
      case 'fair':
        return { color: 'text-warning', icon: 'CloudSun', message: 'Fair lighting' };
      case 'poor':
        return { color: 'text-error', icon: 'Cloud', message: 'Poor lighting' };
      default:
        return { color: 'text-muted-foreground', icon: 'Sun', message: 'Checking...' };
    }
  };

  const lightingInfo = getLightingIndicator();

  return (
    <div className="relative w-full h-full bg-black rounded-organic-lg overflow-hidden">
      {/* Camera Stream */}
      <div 
        className="relative w-full h-full cursor-crosshair"
        onClick={handleViewfinderClick}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Guides */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center Grid */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/30 rounded-organic grid grid-cols-3 grid-rows-3 gap-0">
              {Array.from({ length: 9 })?.map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>

          {/* Ingredient Detection Zone */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-48 border-2 border-primary/60 rounded-organic-lg">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            </div>
          </div>

          {/* Focus Point */}
          {focusPoint && (
            <div 
              className="absolute w-16 h-16 border-2 border-white rounded-full animate-pulse-gentle"
              style={{ 
                left: `${focusPoint?.x}%`, 
                top: `${focusPoint?.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute inset-2 border border-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Lighting Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-2 bg-black/50 rounded-organic text-white ${lightingInfo?.color}`}>
            <Icon name={lightingInfo?.icon} size={16} />
            <span className="text-sm font-medium">{lightingInfo?.message}</span>
          </div>

          {/* Flash Control */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFlash}
            className={`bg-black/50 text-white hover:bg-black/70 ${flashMode === 'on' ? 'text-warning' : ''}`}
          >
            <Icon name={flashMode === 'on' ? 'Zap' : 'ZapOff'} size={20} />
          </Button>
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-black/70 rounded-organic px-4 py-3 text-center">
            <p className="text-white text-sm font-medium mb-1">Position ingredients in the frame</p>
            <p className="text-white/80 text-xs">Ensure good lighting for better recognition</p>
          </div>
        </div>
      </div>
      {/* Capture Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-6">
        {/* Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onModeChange?.(captureMode === 'photo' ? 'burst' : 'photo')}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Icon name={captureMode === 'photo' ? 'Camera' : 'Zap'} size={20} />
        </Button>

        {/* Capture Button */}
        <Button
          variant="default"
          size="icon"
          onClick={capturePhoto}
          disabled={!isActive || isProcessing}
          loading={isProcessing}
          className="w-16 h-16 rounded-full bg-white text-primary hover:bg-white/90 shadow-elevated"
        >
          <Icon name="Camera" size={24} />
        </Button>

        {/* Gallery Access */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Icon name="Image" size={20} />
        </Button>
      </div>
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Camera Inactive Overlay */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <Icon name="CameraOff" size={48} className="mx-auto mb-4 opacity-60" />
            <p className="text-lg font-medium mb-2">Camera Not Available</p>
            <p className="text-sm opacity-80">Please allow camera access to continue</p>
            <Button
              variant="outline"
              onClick={startCamera}
              className="mt-4 text-white border-white hover:bg-white hover:text-black"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewfinder;