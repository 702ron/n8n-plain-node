#!/bin/bash

echo "Setting up n8n development environment for Plain node..."

# Build the node
echo "1. Building Plain node..."
npm run build

# Link the node globally
echo "2. Linking Plain node globally..."
npm link

# Create a symlink in the global n8n modules
NODE_MODULES_PATH=$(npm root -g)
echo "3. Node modules path: $NODE_MODULES_PATH"

# Create symlink manually if needed
if [ -d "$NODE_MODULES_PATH/n8n" ]; then
    echo "4. Creating symlink in n8n node_modules..."
    ln -sf "/Users/ronwilliams/Desktop/scripts/plain node" "$NODE_MODULES_PATH/n8n/node_modules/n8n-nodes-plain" 2>/dev/null || true
fi

echo "5. Setup complete!"
echo ""
echo "To start n8n with your Plain node:"
echo "  ./start-n8n.sh"
echo ""
echo "Or run directly:"
echo "  N8N_CUSTOM_EXTENSIONS='/Users/ronwilliams/Desktop/scripts/plain node' n8n start"