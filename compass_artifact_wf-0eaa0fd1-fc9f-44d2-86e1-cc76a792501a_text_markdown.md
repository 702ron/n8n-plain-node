# Creating a Custom n8n Node for Plain GraphQL Integration

## Creating a Custom n8n Node for Plain GraphQL Integration

### Key architectural insights from n8n

The n8n platform follows a well-defined structure for custom nodes. Nodes are TypeScript modules implementing the `INodeType` interface, organized in a specific directory structure within `/packages/nodes-base/nodes/`. Each integration gets its own directory containing the main node file, credentials file, icon, and supporting utilities.

### Plain's GraphQL API characteristics

Plain is a modern B2B customer support platform with an API-first design. Their GraphQL API endpoint is `https://core-api.uk.plain.com/graphql/v1`, using bearer token authentication. The main entities include:
- **Customers**: End users contacting support
- **Threads**: Core support conversations
- **Companies & Tenants**: Organizational structures
- **Events**: Activities within the system
- **Labels & Tiers**: Categorization systems

### Recommended node structure for Plain

```
/nodes/Plain/
├── Plain.node.ts           # Main node implementation
├── Plain.node.json         # Codex metadata file
├── plain.svg               # Icon file
├── PlainApi.credentials.ts # Authentication configuration
├── GenericFunctions.ts     # Utility functions
├── queries/                # GraphQL query definitions
│   ├── customerQueries.ts
│   ├── threadQueries.ts
│   └── fragments.ts
└── actions/                # Organized operations
    ├── customer/
    ├── thread/
    └── event/
```

### Implementation priorities

Based on Plain's API capabilities and n8n best practices, implement these operations in priority order:

**High Priority (Core functionality)**:
1. Customer Management: Create/Update, Get by Email, List
2. Thread Operations: Create, Get Timeline, Reply, List
3. Event Operations: Create Customer Event, Create Thread Event

**Medium Priority**:
4. Tenant Management: Create/Update, Add/Remove Customers
5. Company Operations: List, Update Tier

**Trigger Node**: Webhook support for thread creation, updates, and customer events

### Authentication implementation

```typescript
export class PlainApi implements ICredentialType {
  name = 'plainApi';
  displayName = 'Plain API';
  documentationUrl = 'https://www.plain.com/docs/api-reference/authentication';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        { name: 'Production', value: 'production' },
        { name: 'Sandbox', value: 'sandbox' },
      ],
      default: 'production',
    },
  ];
}
```

### GraphQL implementation pattern

Following n8n's best practices for GraphQL nodes:

```typescript
async executeGraphQLRequest(
  this: IExecuteFunctions,
  query: string,
  variables?: IDataObject,
): Promise<any> {
  const credentials = await this.getCredentials('plainApi');
  
  const options: IRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.apiKey}`,
    },
    uri: 'https://core-api.uk.plain.com/graphql/v1',
    body: {
      query,
      variables: variables || {},
    },
    json: true,
  };

  try {
    const response = await this.helpers.requestWithAuthentication.call(
      this,
      'plainApi',
      options,
    );

    if (response.errors && response.errors.length > 0) {
      const errorMessages = response.errors.map((error: any) => error.message).join(', ');
      throw new NodeOperationError(
        this.getNode(),
        `GraphQL Error: ${errorMessages}`,
        { cause: response.errors }
      );
    }

    return response.data;
  } catch (error) {
    // Handle errors appropriately
    throw error;
  }
}
```

### Documentation files for Claude Code

#### claude.md structure
```markdown
# Plain n8n Node Development

## Tech Stack
- Platform: n8n (workflow automation)
- Target API: Plain GraphQL API (https://core-api.uk.plain.com/graphql/v1)
- Language: TypeScript
- Authentication: Bearer token (API Key)

## API Integration Details
- Endpoint: https://core-api.uk.plain.com/graphql/v1
- Rate Limiting: Monitor headers, implement backoff
- Pagination: Relay-style cursor-based
- Real-time: WebSocket subscriptions available

## Plain-Specific Requirements
- Support multi-tenant architecture
- Handle workspace/tenant context properly
- Implement proper cursor pagination
- Support UI components in events
- Handle email as unique identifier

## n8n Node Patterns
- Resource-based operation structure
- Implement loadOptions for dynamic dropdowns
- Support both simple and advanced parameter modes
- Proper error handling with NodeOperationError
- Cursor-based pagination for list operations

## Key Operations Priority
1. Customer: upsertCustomer, customerByEmail, customers
2. Thread: createThread, replyToThread, threads, threadTimeline
3. Events: createCustomerEvent, createThreadEvent
4. Tenant: upsertTenant, addCustomersToTenant
5. Webhook trigger node for real-time updates

## GraphQL Query Fragments
Use these fragments for consistent field selection:
- CustomerFields: id, fullName, email, externalId
- ThreadFields: id, title, status, priority, createdAt
- EventFields: id, type, timestamp, components

## Error Handling Patterns
- Distinguish GraphQL errors from HTTP errors
- Provide clear user-facing error messages
- Log detailed error info for debugging
- Handle rate limiting with exponential backoff

## Testing Requirements
- Unit tests for all GraphQL query builders
- Integration tests with Plain API sandbox
- Error scenario coverage
- Pagination edge case testing
```

#### initial.md structure
```markdown
# Plain n8n Node Project Initialization

## Project Overview
Development of a comprehensive n8n node for Plain's customer support platform, enabling workflow automation with GraphQL API integration.

## Core Requirements

### Essential Operations
1. **Customer Management**
   - Create/Update customers (upsertCustomer)
   - Get customer by email
   - List customers with filtering
   
2. **Thread Operations**
   - Create support threads
   - Reply to threads
   - Get thread timeline
   - List threads with filters

3. **Event System**
   - Create customer events
   - Create thread events
   - Support rich UI components

### Technical Implementation
- GraphQL query builder with fragments
- Proper pagination handling
- Rate limiting with exponential backoff
- Comprehensive error handling
- Webhook signature verification

## Development Phases

### Phase 1: Foundation (Week 1)
- Basic node structure setup
- PlainApi credential type
- GraphQL request helper
- Core customer operations (create, get, list)
- Basic thread operations (create, get)

### Phase 2: Complete Features (Week 2)
- All customer operations
- Complete thread operations (reply, timeline)
- Event operations with UI components
- Tenant management operations
- Advanced filtering and search

### Phase 3: Advanced Integration (Week 3)
- Webhook trigger node
- Bulk operations support
- Performance optimizations
- Comprehensive error handling
- Full test coverage

## File Structure
```
n8n-nodes-plain/
├── nodes/
│   └── Plain/
│       ├── Plain.node.ts
│       ├── Plain.node.json
│       ├── plain.svg
│       ├── GenericFunctions.ts
│       ├── queries/
│       │   ├── customerQueries.ts
│       │   ├── threadQueries.ts
│       │   └── fragments.ts
│       └── actions/
│           ├── customer/
│           ├── thread/
│           └── event/
├── credentials/
│   └── PlainApi.credentials.ts
├── test/
│   ├── Plain.node.test.ts
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

## GraphQL Query Examples

### Get Customer by Email
```graphql
query GetCustomerByEmail($email: String!) {
  customerByEmail(email: $email) {
    id
    fullName
    shortName
    email
    externalId
    customerGroupIdentifiers {
      key
      value
    }
  }
}
```

### Create Thread
```graphql
mutation CreateThread($input: CreateThreadInput!) {
  createThread(input: $input) {
    thread {
      id
      title
      status
      priority
      customer {
        id
        fullName
        email
      }
    }
    error {
      message
      type
    }
  }
}
```

## Implementation Guidelines
1. Use TypeScript strict mode
2. Follow n8n naming conventions
3. Implement proper credential handling
4. Add comprehensive JSDoc comments
5. Support both cloud and self-hosted Plain
6. Handle multi-tenant scenarios
7. Implement proper field mapping
8. Use loadOptions for dynamic dropdowns

## Success Criteria
- All core operations implemented
- Comprehensive error handling
- Full test coverage (>80%)
- Clear documentation
- Performance benchmarks met
- n8n marketplace ready
```

### Best practices summary

1. **Structure**: Organize operations by resource (customer, thread, event) with clear CRUD patterns
2. **GraphQL**: Use fragments for reusable field definitions and efficient queries
3. **Pagination**: Implement proper cursor-based pagination with support for `returnAll` pattern
4. **Error Handling**: Distinguish between GraphQL errors and HTTP errors
5. **Authentication**: Store API keys securely using n8n's credential system
6. **Testing**: Include unit tests for query builders and integration tests with the API
7. **Documentation**: Provide clear parameter descriptions and usage examples

### Key implementation details

**Node Properties Structure**:
```typescript
properties: [
  {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    options: [
      { name: 'Customer', value: 'customer' },
      { name: 'Thread', value: 'thread' },
      { name: 'Event', value: 'event' },
      { name: 'Tenant', value: 'tenant' },
    ],
    default: 'customer',
  },
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: { show: { resource: ['customer'] } },
    options: [
      { name: 'Create/Update', value: 'upsert', action: 'Create or update a customer' },
      { name: 'Get', value: 'get', action: 'Get a customer' },
      { name: 'Get All', value: 'getAll', action: 'Get all customers' },
    ],
    default: 'get',
  },
]
```

**Pagination Pattern**:
```typescript
async function handlePagination(
  this: IExecuteFunctions,
  query: string,
  itemIndex: number,
): Promise<any[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
  const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
  
  let results: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  
  while (hasNextPage && (returnAll || results.length < limit)) {
    const variables = {
      first: Math.min(limit - results.length, 50),
      after: cursor,
    };
    
    const response = await this.executeGraphQLRequest(query, variables);
    const edges = response.data.edges || [];
    
    results.push(...edges.map((edge: any) => edge.node));
    
    hasNextPage = response.data.pageInfo.hasNextPage;
    cursor = response.data.pageInfo.endCursor;
  }
  
  return results;
}
```

This comprehensive guide provides everything needed to create a fully functional Plain node for n8n that follows best practices and integrates seamlessly with Plain's GraphQL API.