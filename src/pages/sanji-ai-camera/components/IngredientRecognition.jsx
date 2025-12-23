import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getAllFoods } from '../../../utils/foodData';

const IngredientRecognition = ({ 
  capturedImage, 
  onIngredientsConfirmed, 
  isProcessing = false 
}) => {
  const [recognizedIngredients, setRecognizedIngredients] = useState([]);
  const [manualIngredients, setManualIngredients] = useState([]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [detectionError, setDetectionError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetectionPayload, setLastDetectionPayload] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:8080';

  const extractPredictions = (payload) => {
    const looksLikePredictionArray = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return false;
      if (typeof arr[0] !== 'object' || arr[0] == null) return false;
      const sample = arr[0];
      return (
        'confidence' in sample ||
        'confidence_score' in sample ||
        'probability' in sample ||
        'score' in sample
      );
    };

    const deepFind = (node, depth, seen) => {
      if (!node || depth <= 0) return [];
      if (typeof node !== 'object') return [];
      if (seen.has(node)) return [];
      seen.add(node);

      if (Array.isArray(node)) {
        if (looksLikePredictionArray(node)) return node;
        for (const item of node) {
          const found = deepFind(item, depth - 1, seen);
          if (found.length > 0) return found;
        }
        return [];
      }

      if (Array.isArray(node.predictions)) return node.predictions;
      if (Array.isArray(node.detections)) return node.detections;

      // Common Roboflow workflow nesting
      if (node.outputs) {
        const found = deepFind(node.outputs, depth - 1, seen);
        if (found.length > 0) return found;
      }
      if (node.output) {
        const found = deepFind(node.output, depth - 1, seen);
        if (found.length > 0) return found;
      }
      if (node.result) {
        const found = deepFind(node.result, depth - 1, seen);
        if (found.length > 0) return found;
      }
      if (node.data) {
        const found = deepFind(node.data, depth - 1, seen);
        if (found.length > 0) return found;
      }

      for (const key of Object.keys(node)) {
        const found = deepFind(node[key], depth - 1, seen);
        if (found.length > 0) return found;
      }

      return [];
    };

    return deepFind(payload, 6, new Set());
  };

  const toNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const detectOnions = async (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.jpg');

    const res = await fetch(`${API_BASE_URL}/api/detect/onions`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Onion detection failed (${res.status})`);
    }

    return res.json();
  };

  const buildOnionIngredientFromRoboflow = async (roboflowPayload) => {
    const predictions = extractPredictions(roboflowPayload);
    const confidences = predictions
      ?.map((p) => toNumber(p?.confidence ?? p?.confidence_score ?? p?.probability ?? p?.score))
      ?.filter((v) => typeof v === 'number' && Number.isFinite(v));

    if (!confidences || confidences.length === 0) return [];

    const maxConfidence = Math.max(...confidences);

    let nutrition = { calories: 40, carbs: 9.3, protein: 1.1, fat: 0.1 };
    try {
      const allFoods = await getAllFoods();
      const onionFood = allFoods?.find((f) => `${f?.name || ''}`.toLowerCase().includes('onion'));
      if (onionFood?.nutrition) nutrition = onionFood.nutrition;
    } catch (e) {
      // ignore
    }

    return [
      {
        id: Date.now(),
        name: 'Onion',
        confidence: maxConfidence,
        quantity: '1 piece',
        category: 'Vegetables',
        nutrition,
        freshness: 'Unknown',
        alternatives: []
      }
    ];
  };

  useEffect(() => {
    let cancelled = false;

    const runDetection = async () => {
      if (!capturedImage?.blob || isProcessing) return;

      setDetectionError(null);
      setIsDetecting(true);
      setRecognizedIngredients([]);
      setLastDetectionPayload(null);

      try {
        const onionPayload = await detectOnions(capturedImage.blob);
        if (!cancelled) setLastDetectionPayload(onionPayload);
        const onionIngredient = await buildOnionIngredientFromRoboflow(onionPayload);

        if (!cancelled) {
          setRecognizedIngredients(onionIngredient);
        }
      } catch (error) {
        console.error('Ingredient detection error:', error);
        if (!cancelled) {
          setDetectionError(error?.message || 'Ingredient detection failed');
        }
      } finally {
        if (!cancelled) setIsDetecting(false);
      }
    };

    runDetection();
    return () => {
      cancelled = true;
    };
  }, [capturedImage, isProcessing]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const updateIngredientQuantity = (id, quantity) => {
    setRecognizedIngredients(prev =>
      prev?.map(ingredient =>
        ingredient?.id === id ? { ...ingredient, quantity } : ingredient
      )
    );
  };

  const removeIngredient = (id) => {
    setRecognizedIngredients(prev =>
      prev?.filter(ingredient => ingredient?.id !== id)
    );
  };

  const addManualIngredient = () => {
    if (!newIngredient?.trim()) return;

    const ingredient = {
      id: Date.now(),
      name: newIngredient,
      confidence: 1.0,
      quantity: "1 piece",
      category: "Manual",
      nutrition: { calories: 0, carbs: 0, protein: 0, fat: 0 },
      freshness: "Unknown",
      alternatives: [],
      isManual: true
    };

    setManualIngredients(prev => [...prev, ingredient]);
    setNewIngredient('');
    setShowManualAdd(false);
  };

  const confirmIngredients = () => {
    const allIngredients = [...recognizedIngredients, ...manualIngredients];
    onIngredientsConfirmed(allIngredients);
  };

  const totalIngredients = recognizedIngredients?.length + manualIngredients?.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recognized Ingredients</h3>
          <p className="text-sm text-muted-foreground">
            {totalIngredients} ingredient{totalIngredients !== 1 ? 's' : ''} detected
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManualAdd(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Manual
        </Button>
      </div>
      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="relative">
          <img
            src={capturedImage?.url}
            alt="Captured ingredients"
            className="w-full h-48 object-cover rounded-organic border border-border"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {capturedImage?.lightingQuality} lighting
          </div>
        </div>
      )}
      {detectionError && (
        <div className="bg-error/10 border border-error/20 rounded-organic p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={18} className="text-error mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Detection failed</p>
              <p className="text-xs text-muted-foreground mt-1">{detectionError}</p>
            </div>
          </div>
        </div>
      )}
      {isDetecting && (
        <div className="bg-muted/50 border border-border rounded-organic p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={18} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Detecting onions…</p>
          </div>
        </div>
      )}
      {/* Recognition Results */}
      <div className="space-y-4">
        {recognizedIngredients?.length === 0 && !isDetecting && !detectionError && lastDetectionPayload && (
          <div className="bg-muted/30 border border-border rounded-organic p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                No onion detected from the AI response.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(v => !v)}
              >
                {showDebug ? 'Hide debug' : 'Show debug'}
              </Button>
            </div>
            {showDebug && (
              <pre className="mt-3 text-xs overflow-auto max-h-48 bg-background/50 border border-border rounded-organic p-3">
                {JSON.stringify({
                  debug: lastDetectionPayload?._debug,
                  topLevelKeys: lastDetectionPayload && typeof lastDetectionPayload === 'object' ? Object.keys(lastDetectionPayload) : null,
                  outputs0Keys: Array.isArray(lastDetectionPayload?.outputs) && lastDetectionPayload.outputs?.[0] && typeof lastDetectionPayload.outputs[0] === 'object'
                    ? Object.keys(lastDetectionPayload.outputs[0]).slice(0, 40)
                    : null,
                  outputs0Sample: Array.isArray(lastDetectionPayload?.outputs) ? lastDetectionPayload.outputs?.[0] : null
                }, null, 2)}
              </pre>
            )}
          </div>
        )}
        {recognizedIngredients?.map((ingredient) => (
          <div key={ingredient?.id} className="bg-card border border-border rounded-organic p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{ingredient?.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getConfidenceColor(ingredient?.confidence)}`}>
                    {getConfidenceLabel(ingredient?.confidence)} ({Math.round(ingredient?.confidence * 100)}%)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{ingredient?.category}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeIngredient(ingredient?.id)}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs text-muted-foreground">Quantity</label>
                <input
                  type="text"
                  value={ingredient?.quantity}
                  onChange={(e) => updateIngredientQuantity(ingredient?.id, e?.target?.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-organic text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Freshness</label>
                <div className="mt-1 px-3 py-2 bg-muted rounded-organic text-sm">
                  {ingredient?.freshness}
                </div>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Calories</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.calories}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.carbs}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.protein}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-sm font-medium">{ingredient?.nutrition?.fat}g</div>
              </div>
            </div>

            {/* Alternatives */}
            {ingredient?.alternatives?.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Alternatives:</div>
                <div className="flex flex-wrap gap-2">
                  {ingredient?.alternatives?.map((alt, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full cursor-pointer hover:bg-secondary/30"
                      onClick={() => {
                        const updated = { ...ingredient, name: alt };
                        setRecognizedIngredients(prev =>
                          prev?.map(ing => ing?.id === ingredient?.id ? updated : ing)
                        );
                      }}
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Manual Ingredients */}
        {manualIngredients?.map((ingredient) => (
          <div key={ingredient?.id} className="bg-accent/10 border border-accent/20 rounded-organic p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" size={16} className="text-accent" />
                <span className="font-medium text-foreground">{ingredient?.name}</span>
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">Manual</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setManualIngredients(prev => prev?.filter(ing => ing?.id !== ingredient?.id))}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-organic-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Add Ingredient Manually</h4>
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e?.target?.value)}
              placeholder="Enter ingredient name"
              className="w-full px-3 py-2 border border-border rounded-organic mb-4"
              onKeyPress={(e) => e?.key === 'Enter' && addManualIngredient()}
            />
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={addManualIngredient}
                disabled={!newIngredient?.trim()}
                className="flex-1"
              >
                Add Ingredient
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualAdd(false);
                  setNewIngredient('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Button */}
      {totalIngredients > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={confirmIngredients}
            iconName="ChefHat"
            iconPosition="left"
            className="px-8"
          >
            Generate Recipes ({totalIngredients} ingredients)
          </Button>
        </div>
      )}
    </div>
  );
};

export default IngredientRecognition;