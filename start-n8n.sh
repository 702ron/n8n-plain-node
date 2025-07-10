#!/bin/bash

# Set the custom nodes path to include your Plain node
export N8N_CUSTOM_EXTENSIONS="/Users/ronwilliams/Desktop/scripts/plain node"

# Start n8n
echo "Starting n8n with Plain node..."
echo "Custom extensions path: $N8N_CUSTOM_EXTENSIONS"
echo "n8n will be available at: http://localhost:5678"
echo ""

n8n start