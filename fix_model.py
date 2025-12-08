import json
import sys

# Read the model.json file
model_path = r'c:\Users\JOBERT\OneDrive\Documents\NUTRILIFE\public\nutrilife_web_model\model.json'

with open(model_path, 'r') as f:
    model = json.load(f)

# Fix the InputLayer configuration
if 'modelTopology' in model and 'model_config' in model['modelTopology']:
    layers = model['modelTopology']['model_config']['config']['layers']
    
    # Check the first layer (should be InputLayer)
    if layers and layers[0]['class_name'] == 'InputLayer':
        input_layer = layers[0]['config']
        
        # Convert batch_shape to batchInputShape if needed
        if 'batch_shape' in input_layer and 'batchInputShape' not in input_layer:
            input_layer['batchInputShape'] = input_layer.pop('batch_shape')
            print("✓ Converted batch_shape to batchInputShape")
        
        # Remove problematic fields that TensorFlow.js doesn't support
        fields_to_remove = ['sparse', 'ragged']
        for field in fields_to_remove:
            if field in input_layer:
                del input_layer[field]
                print(f"✓ Removed {field} field")

# Write the fixed model back
with open(model_path, 'w') as f:
    json.dump(model, f, indent=2)

print(f"✓ Model fixed and saved to {model_path}")
