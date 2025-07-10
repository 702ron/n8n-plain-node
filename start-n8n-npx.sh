#!/bin/bash

echo "Starting n8n with npx and Plain node..."
echo "Custom extensions path: /Users/ronwilliams/Desktop/scripts/plain node"
echo "n8n will be available at: http://localhost:5678"
echo ""

# Use npx to run n8n with custom extensions
N8N_CUSTOM_EXTENSIONS="/Users/ronwilliams/Desktop/scripts/plain node" npx n8n@latest start