#!/bin/bash

echo "Switching to Node.js 18 and installing n8n..."

# Switch to Node 18
nvm use 18 2>/dev/null || {
    echo "Node 18 not found, installing..."
    nvm install 18
    nvm use 18
}

# Install n8n globally
npm install -g n8n@latest

echo "Starting n8n with Plain node..."
echo "Custom extensions path: /Users/ronwilliams/Desktop/scripts/plain node"
echo "n8n will be available at: http://localhost:5678"
echo ""

# Start n8n with custom extensions
N8N_CUSTOM_EXTENSIONS="/Users/ronwilliams/Desktop/scripts/plain node" n8n start