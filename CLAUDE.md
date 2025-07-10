# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n node for integrating with Plain's GraphQL API. Plain is a customer support platform with a comprehensive GraphQL API for managing customers, threads, events, and support operations.

## Development Commands

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Run linting
npm run lint

# Run tests (if available)
npm test

# Watch mode for development
npm run dev

# Link node locally for testing in n8n
npm link
# Then in your n8n installation:
n8n start
```

## Architecture

### Node Structure
- `PlainNode.node.ts` - Main node implementation with execute method
- `Plain.credentials.ts` - Credential definition for API authentication
- `GenericFunctions.ts` - Helper functions for API calls and GraphQL queries
- `descriptions/` - Parameter and operation descriptions
- `types.ts` - TypeScript type definitions

### Key Components
1. **Authentication**: Bearer token authentication with Plain API
2. **Operations**: CRUD operations for customers, threads, events, labels
3. **GraphQL Client**: Custom implementation for Plain's GraphQL endpoint
4. **Error Handling**: Comprehensive error handling with user-friendly messages

## Plain API Details
- Endpoint: `https://core-api.uk.plain.com/graphql/v1`
- Authentication: Bearer token via API key
- Method: POST only
- Headers Required:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN`

## n8n Node Development Patterns
- Use `INodeType` interface for node definition
- Implement `execute` method for regular nodes
- Use `INodeExecutionData` for input/output handling
- Follow n8n's error handling patterns with `NodeApiError` and `NodeOperationError`
- Support item linking for workflow continuity

## Testing Approach
1. Unit test GraphQL query builders
2. Mock API responses for integration tests
3. Test error scenarios and edge cases
4. Validate credential handling
5. Test with actual n8n instance using `npm link`

## Code Conventions
- Use TypeScript with strict typing
- Follow n8n's naming conventions (PascalCase for nodes, camelCase for properties)
- Implement proper JSDoc comments
- Use async/await for asynchronous operations
- Keep GraphQL queries organized and reusable