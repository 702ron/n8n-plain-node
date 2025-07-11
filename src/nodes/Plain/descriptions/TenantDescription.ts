import { INodeProperties } from 'n8n-workflow';

export const tenantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
			},
		},
		options: [
			{
				name: 'Create or Update',
				value: 'upsert',
				description: 'Create a new tenant or update an existing one',
				action: 'Create or update tenant',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a tenant by ID or external ID',
				action: 'Get tenant',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all tenants with optional pagination',
				action: 'Get all tenants',
			},
			{
				name: 'Add Customers',
				value: 'addCustomers',
				description: 'Add customers to a tenant',
				action: 'Add customers to tenant',
			},
			{
				name: 'Remove Customers',
				value: 'removeCustomers',
				description: 'Remove customers from a tenant',
				action: 'Remove customers from tenant',
			},
			{
				name: 'Set Customer Tenants',
				value: 'setCustomerTenants',
				description: 'Set all tenants for a customer (replaces existing)',
				action: 'Set customer tenants',
			},
		],
		default: 'upsert',
	},
];

export const tenantFields: INodeProperties[] = [
	// Upsert fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['upsert'],
			},
		},
		default: '',
		description: 'The name of the tenant',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['upsert'],
			},
		},
		default: '',
		description: 'External identifier for the tenant',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['upsert'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL associated with the tenant',
			},
		],
	},

	// Get fields
	{
		displayName: 'Get By',
		name: 'getBy',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['get'],
			},
		},
		options: [
			{
				name: 'Tenant ID',
				value: 'tenantId',
			},
			{
				name: 'External ID',
				value: 'externalId',
			},
		],
		default: 'tenantId',
		description: 'How to identify the tenant',
	},
	{
		displayName: 'Tenant ID',
		name: 'tenantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['get'],
				getBy: ['tenantId'],
			},
		},
		default: '',
		description: 'The ID of the tenant',
	},
	{
		displayName: 'External ID',
		name: 'externalIdValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['get'],
				getBy: ['externalId'],
			},
		},
		default: '',
		description: 'The external ID of the tenant',
	},

	// Get All fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Maximum number of tenants to return (1-100)',
			},
			{
				displayName: 'After Cursor',
				name: 'after',
				type: 'string',
				default: '',
				description: 'Cursor to start pagination from (for forward pagination)',
			},
			{
				displayName: 'Before Cursor',
				name: 'before',
				type: 'string',
				default: '',
				description: 'Cursor to end pagination at (for backward pagination)',
			},
		],
	},

	// Add customers fields
	{
		displayName: 'Customer Identifier',
		name: 'customerIdentifier',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['addCustomers', 'removeCustomers', 'setCustomerTenants'],
			},
		},
		default: {},
		options: [
			{
				name: 'customer',
				displayName: 'Customer',
				values: [
					{
						displayName: 'Identify By',
						name: 'identifyBy',
						type: 'options',
						options: [
							{
								name: 'Customer ID',
								value: 'customerId',
							},
							{
								name: 'Email Address',
								value: 'emailAddress',
							},
							{
								name: 'External ID',
								value: 'externalId',
							},
						],
						default: 'customerId',
					},
					{
						displayName: 'Customer ID',
						name: 'customerId',
						type: 'string',
						displayOptions: {
							show: {
								identifyBy: ['customerId'],
							},
						},
						default: '',
					},
					{
						displayName: 'Email Address',
						name: 'emailAddress',
						type: 'string',
						displayOptions: {
							show: {
								identifyBy: ['emailAddress'],
							},
						},
						default: '',
					},
					{
						displayName: 'External ID',
						name: 'externalId',
						type: 'string',
						displayOptions: {
							show: {
								identifyBy: ['externalId'],
							},
						},
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Tenant Identifiers',
		name: 'tenantIdentifiers',
		type: 'fixedCollection',
		required: true,
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['tenant'],
				operation: ['addCustomers', 'removeCustomers', 'setCustomerTenants'],
			},
		},
		default: {},
		options: [
			{
				name: 'tenant',
				displayName: 'Tenant',
				values: [
					{
						displayName: 'Identify By',
						name: 'identifyBy',
						type: 'options',
						options: [
							{
								name: 'Tenant ID',
								value: 'tenantId',
							},
							{
								name: 'External ID',
								value: 'externalId',
							},
						],
						default: 'tenantId',
					},
					{
						displayName: 'Tenant ID',
						name: 'tenantId',
						type: 'string',
						displayOptions: {
							show: {
								identifyBy: ['tenantId'],
							},
						},
						default: '',
					},
					{
						displayName: 'External ID',
						name: 'externalId',
						type: 'string',
						displayOptions: {
							show: {
								identifyBy: ['externalId'],
							},
						},
						default: '',
					},
				],
			},
		],
	},
];