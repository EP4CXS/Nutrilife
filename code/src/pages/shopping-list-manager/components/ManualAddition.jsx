import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const ManualAddition = ({ onAddItem, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'other',
    estimatedCost: ''
  });

  const unitOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'lbs', label: 'Pounds' },
    { value: 'oz', label: 'Ounces' },
    { value: 'cups', label: 'Cups' },
    { value: 'tbsp', label: 'Tablespoons' },
    { value: 'tsp', label: 'Teaspoons' },
    { value: 'ml', label: 'Milliliters' },
    { value: 'l', label: 'Liters' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'g', label: 'Grams' }
  ];

  const categoryOptions = categories?.map(cat => ({
    value: cat?.id,
    label: cat?.name
  }));

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.name?.trim() || !formData?.quantity) return;

    const newItem = {
      id: Date.now()?.toString(),
      name: formData?.name?.trim(),
      quantity: parseFloat(formData?.quantity),
      unit: formData?.unit,
      category: formData?.category,
      estimatedCost: parseFloat(formData?.estimatedCost) || 0,
      completed: false,
      isManual: true
    };

    onAddItem(newItem);
    
    // Reset form
    setFormData({
      name: '',
      quantity: '',
      unit: 'pieces',
      category: 'other',
      estimatedCost: ''
    });
    
    setIsExpanded(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground font-heading">
          Add Custom Items
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Item Name"
              type="text"
              placeholder="e.g., Organic Bananas"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Quantity"
                type="number"
                placeholder="1"
                value={formData?.quantity}
                onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                min="0.1"
                step="0.1"
                required
              />
              
              <Select
                label="Unit"
                options={unitOptions}
                value={formData?.unit}
                onChange={(value) => handleInputChange('unit', value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
            />

            <Input
              label="Estimated Cost"
              type="number"
              placeholder="0.00"
              value={formData?.estimatedCost}
              onChange={(e) => handleInputChange('estimatedCost', e?.target?.value)}
              min="0"
              step="0.01"
              description="Optional - helps with budget tracking"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Plus"
              iconPosition="left"
              disabled={!formData?.name?.trim() || !formData?.quantity}
            >
              Add Item
            </Button>
          </div>
        </form>
      )}
      {!isExpanded && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            iconName="Plus"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Add Custom Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManualAddition;