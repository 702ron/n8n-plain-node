# Plain Node for n8n - Implementation Plan

This document outlines the step-by-step implementation plan for creating a Plain node in n8n.

## Phase 1: Project Setup

1. **Initialize the project**
   - Create package.json with n8n node dependencies
   - Set up TypeScript configuration
   - Create basic directory structure

2. **Set up development environment**
   - Install n8n-node-dev for scaffolding
   - Configure build scripts
   - Set up linting (ESLint) and formatting

## Phase 2: Core Implementation

3. **Create credentials file** (`Plain.credentials.ts`)
   - Define API key credential type
   - Add display name and documentation URL
   - Configure authentication headers

4. **Create main node file** (`PlainNode.node.ts`)
   - Define node metadata (name, icon, description)
   - Set up resource options (Customer, Thread, Event, Label)
   - Define operations for each resource

5. **Implement generic functions** (`GenericFunctions.ts`)
   - GraphQL request helper
   - Error handling utilities
   - Response parsing functions

## Phase 3: Resource Operations

6. **Customer Operations**
   - Get customer by email
   - Create customer
   - Update customer
   - List customers
   - Delete customer

7. **Thread Operations**
   - Create thread
   - Get thread
   - Update thread status
   - Add reply to thread
   - List threads

8. **Event Operations**
   - Create custom timeline event
   - List events for customer

9. **Label Operations**
   - Add label to customer
   - Remove label from customer
   - List available labels

## Phase 4: GraphQL Queries

10. **Define GraphQL queries** (`queries/` directory)
    - Customer queries and mutations
    - Thread queries and mutations
    - Event mutations
    - Label queries

11. **Type definitions** (`types.ts`)
    - Plain API response types
    - Node parameter types
    - Error types

## Phase 5: Testing & Polish

12. **Create test suite**
    - Unit tests for GraphQL builders
    - Integration tests with mocked responses
    - Manual testing with n8n instance

13. **Documentation**
    - Add node documentation
    - Create example workflows
    - Document common use cases

14. **Final touches**
    - Add node icon
    - Optimize error messages
    - Performance improvements

## Implementation Order

1. Start with project setup and credentials
2. Create basic node structure with one simple operation (e.g., get customer)
3. Test the basic implementation
4. Gradually add more operations
5. Refine and optimize

## Key Considerations

- **Error Handling**: Implement comprehensive error handling for GraphQL errors
- **Pagination**: Handle pagination for list operations
- **Rate Limiting**: Respect Plain's API rate limits
- **Field Selection**: Allow users to specify which fields to return
- **Flexibility**: Design operations to be composable in workflows

## Testing Strategy

1. Use Plain's API playground to test queries
2. Create a test Plain account for development
3. Test each operation individually
4. Create end-to-end workflow tests
5. Validate error scenarios

## Success Criteria

- All major Plain API operations are supported
- Node follows n8n best practices
- Comprehensive error handling
- Clear documentation
- Passes n8n node linting