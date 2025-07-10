// Simple test script to verify the Plain node works
const path = require('path');

// Mock n8n workflow types and functions
const mockN8nContext = {
  getInputData: () => [{ json: {} }],
  getNodeParameter: (param, index) => {
    const mockParams = {
      resource: 'customer',
      operation: 'create',
      email: 'test@example.com',
      fullName: 'Test User',
      shortName: 'Test',
      additionalFields: {}
    };
    return mockParams[param];
  },
  getCredentials: () => ({
    apiKey: 'test-api-key'
  }),
  helpers: {
    request: async (options) => {
      console.log('Mock API Request:', {
        method: options.method,
        uri: options.uri,
        headers: options.headers,
        body: options.body
      });
      
      // Mock successful response
      return {
        data: {
          createCustomer: {
            customer: {
              id: 'customer_123',
              email: 'test@example.com',
              fullName: 'Test User',
              shortName: 'Test',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        }
      };
    },
    constructExecutionMetaData: (data, meta) => data,
    returnJsonArray: (data) => [{ json: data }]
  },
  continueOnFail: () => false,
  getNode: () => ({ name: 'Plain Node Test' })
};

async function testPlainNode() {
  try {
    console.log('Testing Plain Node...\n');
    
    // Import the node
    const { PlainNode } = require('./dist/nodes/Plain/PlainNode.node.js');
    
    const node = new PlainNode();
    console.log('✅ Node imported successfully');
    console.log('Node display name:', node.description.displayName);
    console.log('Node version:', node.description.version);
    console.log('Supported resources:', node.description.properties.find(p => p.name === 'resource').options.map(o => o.value));
    
    // Test execution
    console.log('\n🔄 Testing node execution...');
    const result = await node.execute.call(mockN8nContext);
    
    console.log('\n✅ Execution successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPlainNode();