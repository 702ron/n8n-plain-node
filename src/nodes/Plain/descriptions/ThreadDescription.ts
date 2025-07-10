import { INodeProperties } from 'n8n-workflow';

export const threadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['thread'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new thread',
				action: 'Create a thread',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get thread(s) by ID, external ID, customer ID, or customer email',
				action: 'Get thread(s)',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all threads with optional filters',
				action: 'Get all threads',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update thread properties (title, priority, assignment, status)',
				action: 'Update thread',
			},
			{
				name: 'Reply',
				value: 'reply',
				description: 'Reply to a thread',
				action: 'Reply to a thread',
			},
		],
		default: 'create',
	},
];

export const threadFields: INodeProperties[] = [
	// Get Type selector for consolidated get operation
	{
		displayName: 'Get By',
		name: 'getBy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
			},
		},
		options: [
			{
				name: 'Thread ID',
				value: 'threadId',
				description: 'Get a specific thread by its ID',
			},
			{
				name: 'External ID',
				value: 'externalId',
				description: 'Get a thread by its external ID',
			},
			{
				name: 'Customer ID',
				value: 'customerId',
				description: 'Get all threads for a customer by customer ID',
			},
			{
				name: 'Customer Email',
				value: 'customerEmail',
				description: 'Get all threads for a customer by email address',
			},
		],
		default: 'threadId',
		required: true,
		description: 'How to identify the thread(s) to retrieve',
	},
	// Thread ID for specific get and update operations
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['update', 'reply'],
			},
		},
		default: '',
		required: true,
		description: 'The thread ID',
	},
	// Thread ID for get by threadId
	{
		displayName: 'Thread ID',
		name: 'threadIdValue',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
				getBy: ['threadId'],
			},
		},
		default: '',
		required: true,
		description: 'The thread ID to retrieve',
	},
	// Customer ID for create and get by customer ID
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The customer ID',
	},
	// Customer ID for get by customer ID
	{
		displayName: 'Customer ID',
		name: 'customerIdValue',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
				getBy: ['customerId'],
			},
		},
		default: '',
		required: true,
		description: 'The customer ID to get threads for',
	},
	// Customer Email for get by customer email
	{
		displayName: 'Customer Email',
		name: 'customerEmailValue',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
				getBy: ['customerEmail'],
			},
		},
		default: '',
		required: true,
		description: 'The customer email address to get threads for',
	},
	// External ID for get by external ID
	{
		displayName: 'External ID',
		name: 'externalIdValue',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
				getBy: ['externalId'],
			},
		},
		default: '',
		required: true,
		description: 'The external ID of the thread',
	},
	// Customer ID for external ID lookup
	{
		displayName: 'Customer ID',
		name: 'customerIdForExternalId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get'],
				getBy: ['externalId'],
			},
		},
		default: '',
		required: true,
		description: 'The customer ID (required for external ID lookup)',
	},
	// Title for create
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The thread title',
	},
	// Text for reply
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['reply'],
			},
		},
		default: '',
		required: true,
		description: 'The reply text',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create', 'reply', 'get', 'getAll', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						'/operation': ['get', 'getAll'],
					},
					hide: {
						'/getBy': ['threadId', 'externalId'],
					},
				},
				default: 50,
				description: 'Maximum number of threads to return',
			},
			{
				displayName: 'Status Filter',
				name: 'statusFilter',
				type: 'multiOptions',
				displayOptions: {
					show: {
						'/operation': ['getAll'],
					},
				},
				options: [
					{
						name: 'Todo',
						value: 'TODO',
					},
					{
						name: 'Snoozed',
						value: 'SNOOZED',
					},
					{
						name: 'Done',
						value: 'DONE',
					},
				],
				default: [],
				description: 'Filter threads by status (leave empty for all statuses)',
			},
			{
				displayName: 'Priority Filter',
				name: 'priorityFilter',
				type: 'multiOptions',
				displayOptions: {
					show: {
						'/operation': ['getAll'],
					},
				},
				options: [
					{
						name: 'Urgent',
						value: 0,
					},
					{
						name: 'High',
						value: 1,
					},
					{
						name: 'Normal',
						value: 2,
					},
					{
						name: 'Low',
						value: 3,
					},
				],
				default: [],
				description: 'Filter threads by priority (leave empty for all priorities)',
			},
			{
				displayName: 'Assigned to User ID',
				name: 'assignedToUserFilter',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['getAll'],
					},
				},
				default: '',
				description: 'Filter threads assigned to specific user ID (leave empty for all)',
			},
			{
				displayName: 'Is Assigned',
				name: 'isAssignedFilter',
				type: 'options',
				displayOptions: {
					show: {
						'/operation': ['getAll'],
					},
				},
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Assigned',
						value: true,
					},
					{
						name: 'Unassigned',
						value: false,
					},
				],
				default: '',
				description: 'Filter by assignment status',
			},
			// Update operation fields
			{
				displayName: 'Title',
				name: 'updateTitle',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'New thread title',
			},
			{
				displayName: 'Priority',
				name: 'updatePriority',
				type: 'options',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				options: [
					{
						name: 'Urgent',
						value: 0,
					},
					{
						name: 'High',
						value: 1,
					},
					{
						name: 'Normal',
						value: 2,
					},
					{
						name: 'Low',
						value: 3,
					},
				],
				default: '',
				description: 'New thread priority',
			},
			{
				displayName: 'Status',
				name: 'updateStatus',
				type: 'options',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				options: [
					{
						name: 'Todo',
						value: 'TODO',
					},
					{
						name: 'Snoozed',
						value: 'SNOOZED',
					},
					{
						name: 'Done',
						value: 'DONE',
					},
				],
				default: '',
				description: 'New thread status',
			},
			{
				displayName: 'Assign To User',
				name: 'assignToUserId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'User to assign thread to (leave empty to unassign)',
			},
			{
				displayName: 'Unassign Thread',
				name: 'unassignThread',
				type: 'boolean',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: false,
				description: 'Whether to unassign the thread',
			},
			{
				displayName: 'Update Thread Fields',
				name: 'updateThreadFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: {},
				placeholder: 'Add Thread Field',
				description: 'Update custom thread fields with key-value pairs',
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Type',
								name: 'fieldType',
								type: 'options',
								options: [
									{
										name: 'String Field',
										value: 'STRING',
									},
									{
										name: 'Boolean Field',
										value: 'BOOL',
									},
									{
										name: 'Enum Field',
										value: 'ENUM',
									},
								],
								default: 'STRING',
								description: 'Select the type of field',
							},
							{
								displayName: 'String Field',
								name: 'stringFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getStringFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['STRING'],
									},
								},
								default: '',
								description: 'Select the string field to update',
							},
							{
								displayName: 'String Value',
								name: 'stringValue',
								type: 'string',
								displayOptions: {
									show: {
										fieldType: ['STRING'],
									},
								},
								default: '',
								description: 'The string value for this field',
							},
							{
								displayName: 'Boolean Field',
								name: 'boolFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getBoolFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['BOOL'],
									},
								},
								default: '',
								description: 'Select the boolean field to update',
							},
							{
								displayName: 'Boolean Value',
								name: 'booleanValue',
								type: 'boolean',
								displayOptions: {
									show: {
										fieldType: ['BOOL'],
									},
								},
								default: false,
								description: 'The boolean value for this field',
							},
							{
								displayName: 'Enum Field',
								name: 'enumFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getEnumFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['ENUM'],
									},
								},
								default: '',
								description: 'Select the enum field to update',
							},
							{
								displayName: 'Enum Value',
								name: 'enumValue',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getThreadFieldEnumValues',
									loadOptionsDependsOn: ['enumFieldSchema'],
								},
								displayOptions: {
									show: {
										fieldType: ['ENUM'],
									},
								},
								default: '',
								description: 'The enum value for this field',
							},
						],
					},
				],
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				options: [
					{
						name: 'Urgent',
						value: 0,
					},
					{
						name: 'High',
						value: 1,
					},
					{
						name: 'Normal',
						value: 2,
					},
					{
						name: 'Low',
						value: 3,
					},
				],
				default: 2,
				description: 'The thread priority (0 is most urgent, 3 is least urgent)',
			},
			{
				displayName: 'Text Content',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: '',
				description: 'The thread text content (becomes the preview text and initial message)',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: '',
				description: 'Your own unique identifier for this thread',
			},
			{
				displayName: 'Labels',
				name: 'labelTypeIds',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getLabelTypes',
				},
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: [],
				description: 'The labels to attach to the thread',
			},
			{
				displayName: 'Assigned To User',
				name: 'assignedToUserId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: '',
				description: 'User to assign this thread to',
			},
			{
				displayName: 'Tenant ID',
				name: 'tenantId',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: '',
				description: 'Tenant ID to associate with the thread',
			},
			{
				displayName: 'Tenant External ID',
				name: 'tenantExternalId',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: '',
				description: 'Tenant external ID to associate with the thread',
			},
			{
				displayName: 'Thread Fields',
				name: 'threadFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
				default: {},
				placeholder: 'Add Thread Field',
				description: 'Custom thread fields to set on the thread',
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Type',
								name: 'fieldType',
								type: 'options',
								options: [
									{
										name: 'String Field',
										value: 'STRING',
									},
									{
										name: 'Boolean Field',
										value: 'BOOL',
									},
									{
										name: 'Enum Field',
										value: 'ENUM',
									},
								],
								default: 'STRING',
								description: 'Select the type of field',
							},
							{
								displayName: 'String Field',
								name: 'stringFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getStringFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['STRING'],
									},
								},
								default: '',
								description: 'Select the string field to set',
							},
							{
								displayName: 'String Value',
								name: 'stringValue',
								type: 'string',
								displayOptions: {
									show: {
										fieldType: ['STRING'],
									},
								},
								default: '',
								description: 'The string value for this field',
							},
							{
								displayName: 'Boolean Field',
								name: 'boolFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getBoolFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['BOOL'],
									},
								},
								default: '',
								description: 'Select the boolean field to set',
							},
							{
								displayName: 'Boolean Value',
								name: 'booleanValue',
								type: 'boolean',
								displayOptions: {
									show: {
										fieldType: ['BOOL'],
									},
								},
								default: false,
								description: 'The boolean value for this field',
							},
							{
								displayName: 'Enum Field',
								name: 'enumFieldSchema',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getEnumFieldSchemas',
								},
								displayOptions: {
									show: {
										fieldType: ['ENUM'],
									},
								},
								default: '',
								description: 'Select the enum field to set',
							},
							{
								displayName: 'Enum Value',
								name: 'enumValue',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getThreadFieldEnumValues',
									loadOptionsDependsOn: ['enumFieldSchema'],
								},
								displayOptions: {
									show: {
										fieldType: ['ENUM'],
									},
								},
								default: '',
								description: 'The enum value for this field',
							},
						],
					},
				],
			},
			{
				displayName: 'Markdown Content',
				name: 'markdownContent',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						'/operation': ['reply'],
					},
				},
				default: '',
				description: 'Markdown content for the reply',
			},
			{
				displayName: 'Attachment IDs',
				name: 'attachmentIds',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						'/operation': ['reply'],
					},
				},
				default: [],
				description: 'Array of attachment IDs to include in the reply',
			},
		],
	},
];