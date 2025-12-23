import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGallery = ({ 
  photos = [], 
  onPhotoSelect, 
  onPhotoDelete, 
  onPhotoEdit,
  selectedPhoto = null 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'quality'
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editSettings, setEditSettings] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0
  });

  // Mock photo data
  const mockPhotos = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      thumbnail: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200",
      timestamp: new Date(Date.now() - 300000),
      lightingQuality: "excellent",
      recognizedIngredients: ["Tomatoes", "Bell Peppers", "Onions"],
      processingStatus: "completed",
      fileSize: "2.4 MB",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg",
      thumbnail: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=200",
      timestamp: new Date(Date.now() - 600000),
      lightingQuality: "good",
      recognizedIngredients: ["Carrots", "Potatoes", "Herbs"],
      processingStatus: "completed",
      fileSize: "1.8 MB",
      dimensions: "1920x1080"
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg",
      thumbnail: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?w=200",
      timestamp: new Date(Date.now() - 900000),
      lightingQuality: "fair",
      recognizedIngredients: ["Mushrooms", "Garlic", "Spinach"],
      processingStatus: "processing",
      fileSize: "3.1 MB",
      dimensions: "1920x1080"
    }
  ];

  const allPhotos = photos?.length > 0 ? photos : mockPhotos;

  const sortedPhotos = [...allPhotos]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'quality':
        const qualityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
        return qualityOrder?.[b?.lightingQuality] - qualityOrder?.[a?.lightingQuality];
      default:
        return 0;
    }
  });

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getLightingColor = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-success bg-success/10';
      case 'good': return 'text-success bg-success/10';
      case 'fair': return 'text-warning bg-warning/10';
      case 'poor': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProcessingStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Clock';
    }
  };

  const getProcessingStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0
    });
    setShowEditModal(true);
  };

  const applyEditSettings = () => {
    if (editingPhoto) {
      onPhotoEdit?.(editingPhoto?.id, editSettings);
      setShowEditModal(false);
      setEditingPhoto(null);
    }
  };

  const resetEditSettings = () => {
    setEditSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Photo Gallery</h3>
          <p className="text-sm text-muted-foreground">
            {allPhotos?.length} photo{allPhotos?.length !== 1 ? 's' : ''} captured
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-organic text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="quality">Best Quality</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-organic overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              iconName="Grid3X3"
              className="rounded-none"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              iconName="List"
              className="rounded-none"
            />
          </div>
        </div>
      </div>
      {/* Photo Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedPhotos?.map((photo) => (
            <div
              key={photo?.id}
              className={`relative group cursor-pointer rounded-organic overflow-hidden border-2 transition-ambient ${
                selectedPhoto?.id === photo?.id ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onPhotoSelect?.(photo)}
            >
              <div className="aspect-square">
                <img
                  src={photo?.thumbnail || photo?.url}
                  alt={`Captured ingredients ${photo?.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-ambient">
                <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-ambient">
                  <span className={`text-xs px-2 py-1 rounded-full ${getLightingColor(photo?.lightingQuality)}`}>
                    {photo?.lightingQuality}
                  </span>
                  <Icon
                    name={getProcessingStatusIcon(photo?.processingStatus)}
                    size={16}
                    className={getProcessingStatusColor(photo?.processingStatus)}
                  />
                </div>

                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-ambient">
                  <div className="text-white text-xs mb-2">
                    {formatTimestamp(photo?.timestamp)}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleEditPhoto(photo);
                      }}
                      className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onPhotoDelete?.(photo?.id);
                      }}
                      className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedPhoto?.id === photo?.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} color="white" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPhotos?.map((photo) => (
            <div
              key={photo?.id}
              className={`flex items-center space-x-4 p-4 border rounded-organic cursor-pointer transition-ambient ${
                selectedPhoto?.id === photo?.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onPhotoSelect?.(photo)}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-organic overflow-hidden flex-shrink-0">
                <img
                  src={photo?.thumbnail || photo?.url}
                  alt={`Captured ingredients ${photo?.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    Photo {photo?.id}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getLightingColor(photo?.lightingQuality)}`}>
                    {photo?.lightingQuality}
                  </span>
                  <Icon
                    name={getProcessingStatusIcon(photo?.processingStatus)}
                    size={14}
                    className={getProcessingStatusColor(photo?.processingStatus)}
                  />
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {photo?.recognizedIngredients?.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(photo?.timestamp)} • {photo?.fileSize} • {photo?.dimensions}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleEditPhoto(photo);
                  }}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onPhotoDelete?.(photo?.id);
                  }}
                  className="text-error hover:text-error"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editingPhoto && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-organic-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Edit Photo</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Photo Preview */}
              <div className="mb-6">
                <img
                  src={editingPhoto?.url}
                  alt="Photo being edited"
                  className="w-full h-64 object-cover rounded-organic border border-border"
                  style={{
                    filter: `brightness(${100 + editSettings?.brightness}%) contrast(${100 + editSettings?.contrast}%) saturate(${100 + editSettings?.saturation}%)`,
                    transform: `rotate(${editSettings?.rotation}deg)`
                  }}
                />
              </div>

              {/* Edit Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Brightness: {editSettings?.brightness}%
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={editSettings?.brightness}
                    onChange={(e) => setEditSettings(prev => ({ ...prev, brightness: parseInt(e?.target?.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Contrast: {editSettings?.contrast}%
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={editSettings?.contrast}
                    onChange={(e) => setEditSettings(prev => ({ ...prev, contrast: parseInt(e?.target?.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Saturation: {editSettings?.saturation}%
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={editSettings?.saturation}
                    onChange={(e) => setEditSettings(prev => ({ ...prev, saturation: parseInt(e?.target?.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rotation: {editSettings?.rotation}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="90"
                    value={editSettings?.rotation}
                    onChange={(e) => setEditSettings(prev => ({ ...prev, rotation: parseInt(e?.target?.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={resetEditSettings}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  onClick={applyEditSettings}
                  className="flex-1"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {allPhotos?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Image" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium text-foreground mb-2">No photos captured yet</h4>
          <p className="text-muted-foreground">Start capturing ingredients to build your photo gallery</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;