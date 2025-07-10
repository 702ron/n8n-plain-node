import { INodeProperties } from 'n8n-workflow';

export const labelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['label'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add a label to a thread',
				action: 'Add a label',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove a label from a thread',
				action: 'Remove a label',
			},
		],
		default: 'add',
	},
];

export const labelFields: INodeProperties[] = [
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['add'],
			},
		},
		default: '',
		required: true,
		description: 'The thread ID to add the label to',
	},
	{
		displayName: 'Label Type ID',
		name: 'labelTypeId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['add'],
			},
		},
		default: '',
		required: true,
		description: 'The label type ID to add',
	},
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['remove'],
			},
		},
		default: '',
		required: true,
		description: 'The label ID to remove (not the label type ID)',
	},
];