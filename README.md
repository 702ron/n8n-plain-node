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

- **Create**: Create a new customer
- **Get**: Get a customer by email
- **Update**: Update customer information
- **Delete**: Delete a customer

### Thread

- **Create**: Create a new support thread
- **Reply**: Reply to an existing thread

### Event

- **Create**: Create a custom timeline event for a customer

### Label

- **Add**: Add a label to a customer
- **Remove**: Remove a label from a customer

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

[MIT](LICENSE.md)
