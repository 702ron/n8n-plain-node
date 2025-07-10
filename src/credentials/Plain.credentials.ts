import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Plain implements ICredentialType {
	name = 'plain';
	displayName = 'Plain API';
	documentationUrl = 'https://www.plain.com/docs/graphql/introduction';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Plain API key. You can find this in your Plain workspace settings under API.',
		},
	];
}