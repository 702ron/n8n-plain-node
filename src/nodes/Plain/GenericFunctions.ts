import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

export async function plainApiRequest(
	this: IExecuteFunctions,
	query: string,
	variables: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('plain');

	const options: IRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		headers: {
			'Authorization': `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		uri: 'https://core-api.uk.plain.com/graphql/v1',
		body: {
			query,
			variables,
		},
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		
		if (response.errors && response.errors.length > 0) {
			throw new NodeApiError(this.getNode(), {
				message: response.errors[0].message,
				description: response.errors[0].extensions?.debugMessage || undefined,
			});
		}
		
		return response.data;
	} catch (error) {
		const errorData: IDataObject = {
			message: error instanceof Error ? error.message : 'Unknown error',
		};
		
		if (error instanceof Error && 'status' in error) {
			const status = (error as { status?: number }).status;
			if (status !== undefined) {
				errorData.httpCode = status;
			}
		}
		
		throw new NodeApiError(this.getNode(), errorData as any);
	}
}

export async function plainApiRequestLoadOptions(
	this: ILoadOptionsFunctions,
	query: string,
	variables: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('plain');

	const options: IRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		headers: {
			'Authorization': `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		uri: 'https://core-api.uk.plain.com/graphql/v1',
		body: {
			query,
			variables,
		},
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		
		// Check for GraphQL errors
		if (response.errors && response.errors.length > 0) {
			throw new NodeApiError(this.getNode(), {
				message: response.errors[0].message,
				description: response.errors[0].extensions?.debugMessage || undefined,
			});
		}
		
		return response.data;
	} catch (error) {
		const errorData: IDataObject = {
			message: error instanceof Error ? error.message : 'Unknown error',
		};
		
		if (error instanceof Error && 'status' in error) {
			const status = (error as { status?: number }).status;
			if (status !== undefined) {
				errorData.httpCode = status;
			}
		}
		
		throw new NodeApiError(this.getNode(), errorData as any);
	}
}