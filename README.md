# n8n-nodes-plain

This is an n8n community node that provides integration with [Plain](https://plain.com), a modern customer support platform.

## Installation

To install this node in your n8n instance, follow these steps:

1. Go to **Settings > Community Nodes**
2. Enter `n8n-nodes-plain` and click **Install**

## Credentials

To use this node, you'll need to create Plain credentials:

1. Go to your Plain workspace settings
2. Navigate to the API section
3. Create a new API key
4. Copy the API key and add it to your n8n Plain credentials

## Resources

This node supports the following Plain resources:

### Customer

- **Create**: Create a new customer with email, name, and optional fields
- **Get**: Get a customer by email address
- **Update**: Update customer information including name, email, and customer groups
- **Delete**: Delete a customer from your workspace

### Thread

- **Create**: Create a new support thread with title, description, and custom fields
- **Reply**: Reply to an existing thread with text or markdown content
- **Get**: Get thread(s) by ID, external ID, customer ID, or customer email
- **Update**: Update thread title, priority, status, assignment, and custom fields
- **Get All**: Get all threads with optional filtering by status, priority, and assignment

### Event

- **Create**: Create a custom timeline event for a customer

### Label

- **Add**: Add a label to a thread
- **Remove**: Remove a label from a thread

### Company

- **Create**: Create or update a company with domain name and details
- **Get**: Get a company by ID or domain name
- **Update**: Update company information including name, domain, and account owner
- **Delete**: Delete a company
- **Get All**: Get all companies with pagination support

### Tenant

- **Upsert**: Create or update a tenant with external ID and details
- **Get**: Get a tenant by ID or external ID
- **Add Customers**: Add customers to tenants
- **Remove Customers**: Remove customers from tenants
- **Set Customer Tenants**: Set the complete list of tenants for a customer
- **Get All**: Get all tenants with pagination support

## Example Usage

### Create a Customer

```json
{
  "resource": "customer",
  "operation": "create",
  "email": "customer@example.com",
  "fullName": "John Doe",
  "shortName": "John"
}
```

### Create a Thread

```json
{
  "resource": "thread",
  "operation": "create",
  "customerId": "customer_123",
  "title": "Need help with billing"
}
```

### Reply to a Thread

```json
{
  "resource": "thread",
  "operation": "reply",
  "threadId": "thread_456",
  "text": "Thanks for contacting us. We'll help you with your billing question."
}
```

## Development

To develop this node locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the node: `npm run build`
4. Link the node: `npm link`
5. In your n8n installation, link the node: `npm link n8n-nodes-plain`

## License

[MIT](LICENSE)
