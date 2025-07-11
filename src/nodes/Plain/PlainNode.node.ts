import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	IDataObject,
} from 'n8n-workflow';

import {
	plainApiRequest,
	plainApiRequestLoadOptions,
	getCustomerGroups,
} from './GenericFunctions';

import {
	customerOperations,
	customerFields,
} from './descriptions/CustomerDescription';

import {
	threadOperations,
	threadFields,
} from './descriptions/ThreadDescription';

import {
	eventOperations,
	eventFields,
} from './descriptions/EventDescription';

import {
	labelOperations,
	labelFields,
} from './descriptions/LabelDescription';

import {
	tenantOperations,
	tenantFields,
} from './descriptions/TenantDescription';

import {
	companyOperations,
	companyFields,
} from './descriptions/CompanyDescription';

export class PlainNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plain',
		name: 'plain',
		icon: 'file:plain.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Plain API',
		defaults: {
			name: 'Plain',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'plain',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Label',
						value: 'label',
					},
					{
						name: 'Tenant',
						value: 'tenant',
					},
					{
						name: 'Thread',
						value: 'thread',
					},
				],
				default: 'customer',
			},
			...companyOperations,
			...companyFields,
			...customerOperations,
			...customerFields,
			...threadOperations,
			...threadFields,
			...eventOperations,
			...eventFields,
			...labelOperations,
			...labelFields,
			...tenantOperations,
			...tenantFields,
		],
	};

	methods = {
		loadOptions: {
			async getLabelTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getLabelTypes {
						labelTypes(first: 100) {
							edges {
								node {
									id
									name
									isArchived
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const result = response as any;
					
					const labelTypes = result.labelTypes?.edges
						?.map((edge: any) => edge.node)
						.filter((labelType: any) => !labelType.isArchived) // Only show non-archived labels
						.map((labelType: any) => ({
							name: labelType.name,
							value: labelType.id,
						})) || [];

					return labelTypes;
				} catch (error) {
					// If there's an error, return empty array so the field still works
					return [];
				}
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getUsers {
						users(first: 100) {
							edges {
								node {
									id
									fullName
									publicName
									isDeleted
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const result = response as any;
					
					const users = result.users?.edges
						?.map((edge: any) => edge.node)
						.filter((user: any) => !user.isDeleted) // Only show non-deleted users
						.map((user: any) => ({
							name: `${user.fullName} (${user.publicName})`,
							value: user.id,
						})) || [];

					return users;
				} catch (error) {
					// If there's an error, return empty array so the field still works
					return [];
				}
			},
			async getThreadFieldSchemas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getThreadFieldSchemas {
						threadFieldSchemas(first: 100) {
							edges {
								node {
									id
									label
									key
									type
									enumValues
									isRequired
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const result = response as any;
					
					// Create separate options for each field type to enable conditional display
					const allSchemas = result.threadFieldSchemas?.edges?.map((edge: any) => edge.node) || [];
					const options: INodePropertyOptions[] = [];
					
					allSchemas.forEach((schema: any) => {
						options.push({
							name: `${schema.label}${schema.isRequired ? ' *' : ''} (${schema.type})`,
							value: `${schema.key}|${schema.type}|${schema.id}`,
						});
					});

					return options;
				} catch (error) {
					// If there's an error, return empty array so the field still works
					return [];
				}
			},
			async getStringFieldSchemas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getThreadFieldSchemas {
						threadFieldSchemas(first: 100) {
							edges {
								node {
									id
									label
									key
									type
									enumValues
									isRequired
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					const result = response as any;
					
					const stringSchemas = result.threadFieldSchemas?.edges
						?.map((edge: any) => edge.node)
						.filter((schema: any) => schema.type === 'STRING')
						.map((schema: any) => ({
							name: `${schema.label}${schema.isRequired ? ' *' : ''}`,
							value: `${schema.key}|${schema.type}|${schema.id}`,
						})) || [];

					return stringSchemas;
				} catch (error) {
					return [];
				}
			},
			async getBoolFieldSchemas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getThreadFieldSchemas {
						threadFieldSchemas(first: 100) {
							edges {
								node {
									id
									label
									key
									type
									enumValues
									isRequired
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					const result = response as any;
					
					const boolSchemas = result.threadFieldSchemas?.edges
						?.map((edge: any) => edge.node)
						.filter((schema: any) => schema.type === 'BOOL')
						.map((schema: any) => ({
							name: `${schema.label}${schema.isRequired ? ' *' : ''}`,
							value: `${schema.key}|${schema.type}|${schema.id}`,
						})) || [];

					return boolSchemas;
				} catch (error) {
					return [];
				}
			},
			async getEnumFieldSchemas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `
					query getThreadFieldSchemas {
						threadFieldSchemas(first: 100) {
							edges {
								node {
									id
									label
									key
									type
									enumValues
									isRequired
								}
							}
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, {});
					const result = response as any;
					
					const enumSchemas = result.threadFieldSchemas?.edges
						?.map((edge: any) => edge.node)
						.filter((schema: any) => schema.type === 'ENUM')
						.map((schema: any) => ({
							name: `${schema.label}${schema.isRequired ? ' *' : ''}`,
							value: `${schema.key}|${schema.type}|${schema.id}`,
						})) || [];

					return enumSchemas;
				} catch (error) {
					return [];
				}
			},
			async getThreadFieldEnumValues(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const enumFieldSchema = this.getCurrentNodeParameter('enumFieldSchema') as string;
				
				if (!enumFieldSchema || !enumFieldSchema.includes('|ENUM|')) {
					return [];
				}

				// Extract schema ID from the encoded value
				const schemaId = enumFieldSchema.split('|')[2];
				
				const query = `
					query getThreadFieldSchema($threadFieldSchemaId: ID!) {
						threadFieldSchema(threadFieldSchemaId: $threadFieldSchemaId) {
							enumValues
						}
					}
				`;

				try {
					const response = await plainApiRequestLoadOptions.call(this, query, { threadFieldSchemaId: schemaId });
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const result = response as any;
					
					const enumValues = result.threadFieldSchema?.enumValues?.map((value: string) => ({
						name: value,
						value: value,
					})) || [];

					return enumValues;
				} catch (error) {
					// If there's an error, return empty array so the field still works
					return [];
				}
			},
			getCustomerGroups,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject = {};

				if (resource === 'company') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const domainName = this.getNodeParameter('domainName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

						const query = `
							mutation upsertCompany($input: UpsertCompanyInput!) {
								upsertCompany(input: $input) {
									company {
										id
										name
										domainName
										logoUrl
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
										tier {
											id
											name
										}
										contractValue
										accountOwner {
											id
											fullName
											publicName
										}
										isDeleted
									}
									result
									error {
										message
										type
										fields {
											field
											message
										}
									}
								}
							}
						`;

						const variables: any = {
							input: {
								identifier: {
									companyDomainName: domainName,
								},
								name,
								domainName,
							},
						};

						if (additionalFields.contractValue !== undefined) {
							variables.input.contractValue = additionalFields.contractValue;
						}

						if (additionalFields.accountOwnerUserId) {
							variables.input.accountOwnerUserId = additionalFields.accountOwnerUserId;
						}

						const response = await plainApiRequest.call(this, query, variables);
						const result = response as any;

						if (result.upsertCompany?.error) {
							const error = result.upsertCompany.error;
							let errorMessage = error.message || 'Unknown error';
							
							if (error.fields && error.fields.length > 0) {
								const fieldErrors = error.fields.map((field: any) => `${field.field}: ${field.message}`).join(', ');
								errorMessage += ` (Field errors: ${fieldErrors})`;
							}
							
							throw new NodeOperationError(this.getNode(), errorMessage);
						}

						responseData = result.upsertCompany?.company || {};
					}

					if (operation === 'get') {
						const getBy = this.getNodeParameter('getBy', i) as string;
						let query = '';
						let variables: any = {};

						if (getBy === 'companyId') {
							const companyId = this.getNodeParameter('companyId', i) as string;
							query = `
								query getCompany($companyId: ID!) {
									company(companyId: $companyId) {
										id
										name
										domainName
										logoUrl
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
										tier {
											id
											name
										}
										contractValue
										accountOwner {
											id
											fullName
											publicName
										}
										isDeleted
										deletedAt {
											iso8601
										}
									}
								}
							`;
							variables = { companyId };
						} else if (getBy === 'domainName') {
							const domainName = this.getNodeParameter('domainNameValue', i) as string;
							query = `
								query searchCompaniesByDomain($searchQuery: CompaniesSearchQuery!) {
									searchCompanies(searchQuery: $searchQuery) {
										edges {
											node {
												company {
													id
													name
													domainName
													logoUrl
													createdAt {
														iso8601
													}
													updatedAt {
														iso8601
													}
													tier {
														id
														name
													}
													contractValue
													accountOwner {
														id
														fullName
														publicName
													}
													isDeleted
													deletedAt {
														iso8601
													}
												}
											}
										}
									}
								}
							`;
							variables = { searchQuery: { term: domainName } };
						} else if (getBy === 'externalId') {
							// Note: Plain API doesn't seem to support searching by external ID directly
							// This would require getting all companies and filtering, which isn't efficient
							throw new NodeOperationError(this.getNode(), 'Getting company by external ID is not supported by Plain API');
						}

						const response = await plainApiRequest.call(this, query, variables);
						const result = response as any;

						if (getBy === 'companyId') {
							responseData = result.company || {};
						} else if (getBy === 'domainName') {
							// For domain name search, we get back search results
							const companies = result.searchCompanies?.edges?.map((edge: any) => edge.node.company) || [];
							// Find exact match for domain name
							const exactMatch = companies.find((company: any) => 
								company.domainName.toLowerCase() === (variables.searchQuery.term as string).toLowerCase()
							);
							responseData = exactMatch || (companies.length > 0 ? companies[0] : {});
						}
					}

					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						const limit = (additionalFields.limit as number) || 50;
						const after = additionalFields.after as string;
						const before = additionalFields.before as string;
						const includeDeleted = additionalFields.includeDeleted as boolean;

						const query = `
							query getAllCompanies($first: Int, $after: String, $last: Int, $before: String, $filters: CompaniesFilter) {
								companies(first: $first, after: $after, last: $last, before: $before, filters: $filters) {
									edges {
										cursor
										node {
											id
											name
											domainName
											logoUrl
											createdAt {
												iso8601
											}
											updatedAt {
												iso8601
											}
											tier {
												id
												name
											}
											contractValue
											accountOwner {
												id
												fullName
												publicName
											}
											isDeleted
											deletedAt {
												iso8601
											}
										}
									}
									pageInfo {
										hasNextPage
										hasPreviousPage
										startCursor
										endCursor
									}
								}
							}
						`;

						const variables: any = {};

						// Handle pagination
						if (before) {
							variables.last = limit;
							variables.before = before;
						} else {
							variables.first = limit;
							if (after) {
								variables.after = after;
							}
						}

						// Handle filters
						if (includeDeleted !== undefined) {
							variables.filters = {
								isDeleted: includeDeleted,
							};
						}

						const response = await plainApiRequest.call(this, query, variables);
						const result = response as any;

						const companies = result.companies?.edges?.map((edge: any) => edge.node) || [];
						const pageInfo = result.companies?.pageInfo || {};

						if (companies.length === 0) {
							responseData = {
								message: 'No companies found',
								pageInfo: pageInfo,
							};
						} else if (companies.length === 1) {
							responseData = {
								...companies[0],
								_metadata: {
									pageInfo: pageInfo,
									totalCount: 1,
								},
							};
						} else {
							responseData = {
								summary: {
									totalCompanies: companies.length,
									pageInfo: pageInfo,
								},
								companies: companies,
							};
						}
					}

					if (operation === 'update') {
						const companyIdentifier = this.getNodeParameter('companyIdentifier', i) as any;
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

						// Check if any fields to update are provided
						if (!updateFields?.fields || !Array.isArray(updateFields.fields) || updateFields.fields.length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one field to update must be specified');
						}

						const query = `
							mutation upsertCompany($input: UpsertCompanyInput!) {
								upsertCompany(input: $input) {
									company {
										id
										name
										domainName
										logoUrl
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
										tier {
											id
											name
										}
										contractValue
										accountOwner {
											id
											fullName
											publicName
										}
										isDeleted
									}
									result
									error {
										message
										type
										fields {
											field
											message
										}
									}
								}
							}
						`;

						// Build company identifier
						const identifier: any = {};
						if (!companyIdentifier?.identifier) {
							throw new NodeOperationError(this.getNode(), 'Company identifier is required');
						}
						const identifierData = companyIdentifier.identifier;
						if (identifierData.identifyBy === 'companyId') {
							identifier.companyId = identifierData.companyId;
						} else if (identifierData.identifyBy === 'domainName') {
							identifier.companyDomainName = identifierData.domainName;
						}

						const variables: any = {
							input: {
								identifier,
							},
						};

						// Process each field to update
						updateFields.fields.forEach((field: any) => {
							const fieldName = field.fieldName;
							const fieldValue = field[fieldName];

							if (fieldValue !== undefined && fieldValue !== '') {
								if (fieldName === 'name') {
									variables.input.name = fieldValue;
								} else if (fieldName === 'domainName') {
									variables.input.domainName = fieldValue;
								} else if (fieldName === 'contractValue') {
									variables.input.contractValue = fieldValue;
								} else if (fieldName === 'accountOwnerUserId') {
									variables.input.accountOwnerUserId = fieldValue;
								}
							}
						});

						const response = await plainApiRequest.call(this, query, variables);
						const result = response as any;

						if (result.upsertCompany?.error) {
							const error = result.upsertCompany.error;
							let errorMessage = error.message || 'Unknown error';
							
							if (error.fields && error.fields.length > 0) {
								const fieldErrors = error.fields.map((field: any) => `${field.field}: ${field.message}`).join(', ');
								errorMessage += ` (Field errors: ${fieldErrors})`;
							}
							
							throw new NodeOperationError(this.getNode(), errorMessage);
						}

						responseData = result.upsertCompany?.company || {};
					}

					if (operation === 'delete') {
						const companyIdentifier = this.getNodeParameter('companyIdentifier', i) as any;

						const query = `
							mutation deleteCompany($input: DeleteCompanyInput!) {
								deleteCompany(input: $input) {
									error {
										message
										type
									}
								}
							}
						`;

						// Build company identifier
						const identifier: any = {};
						if (!companyIdentifier?.identifier) {
							throw new NodeOperationError(this.getNode(), 'Company identifier is required');
						}
						const identifierData = companyIdentifier.identifier;
						if (identifierData.identifyBy === 'companyId') {
							identifier.companyId = identifierData.companyId;
						} else if (identifierData.identifyBy === 'domainName') {
							identifier.companyDomainName = identifierData.domainName;
						}

						const variables = {
							input: {
								companyIdentifier: identifier,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						const result = response as any;

						if (result.deleteCompany?.error) {
							throw new NodeOperationError(this.getNode(), result.deleteCompany.error.message);
						}

						responseData = { success: true };
					}
				}

				if (resource === 'customer') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const fullName = this.getNodeParameter('fullName', i) as string;
						const shortName = this.getNodeParameter('shortName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const query = `
							mutation upsertCustomer($input: UpsertCustomerInput!) {
								upsertCustomer(input: $input) {
									customer {
										id
										email {
											email
											isVerified
											verifiedAt {
												iso8601
											}
										}
										fullName
										shortName
										externalId
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
									error {
										message
										type
										fields {
											field
											message
										}
									}
								}
							}
						`;

						const variables = {
							input: {
								identifier: {
									emailAddress: email,
								},
								onCreate: {
									fullName,
									shortName,
									email: {
										email,
										isVerified: false,
									},
									...additionalFields,
								},
								onUpdate: {
									fullName: { value: fullName },
									shortName: { value: shortName },
									email: {
										email,
										isVerified: false,
									},
								},
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.upsertCustomer?.error) {
							const error = result.upsertCustomer.error;
							let errorMessage = error.message || 'Unknown error';
							
							if (error.fields && error.fields.length > 0) {
								const fieldErrors = error.fields.map((field: any) => `${field.field}: ${field.message}`).join(', ');
								errorMessage += ` (Field errors: ${fieldErrors})`;
							}
							
							throw new NodeOperationError(this.getNode(), errorMessage);
						}
						
						responseData = result.upsertCustomer?.customer || {};

						// Handle customer groups if provided
						if (additionalFields.customerGroupIds && Array.isArray(additionalFields.customerGroupIds) && additionalFields.customerGroupIds.length > 0) {
							const customerId = responseData.id;
							if (customerId) {
								const groupQuery = `
									mutation addCustomerToCustomerGroups($input: AddCustomerToCustomerGroupsInput!) {
										addCustomerToCustomerGroups(input: $input) {
											customerGroupMemberships {
												customerGroup {
													id
													name
												}
											}
											error {
												message
												type
											}
										}
									}
								`;

								const groupVariables = {
									input: {
										customerId,
										customerGroupIdentifiers: additionalFields.customerGroupIds.map((groupId: any) => ({
											customerGroupId: groupId,
										})),
									},
								};

								const groupResponse = await plainApiRequest.call(this, groupQuery, groupVariables);
								const groupResult = groupResponse as any;

								if (groupResult.addCustomerToCustomerGroups?.error) {
									throw new NodeOperationError(this.getNode(), groupResult.addCustomerToCustomerGroups.error.message);
								}

								// Add group information to response
								responseData.customerGroups = groupResult.addCustomerToCustomerGroups?.customerGroupMemberships?.map((membership: any) => membership.customerGroup) || [];
							}
						}
					}

					if (operation === 'get') {
						const email = this.getNodeParameter('email', i) as string;

						const query = `
							query getCustomerByEmail($email: String!) {
								customerByEmail(email: $email) {
									id
									email {
										email
										isVerified
										verifiedAt {
											iso8601
										}
									}
									fullName
									shortName
									externalId
									createdAt {
										iso8601
									}
									updatedAt {
										iso8601
									}
								}
							}
						`;

						const variables = { email };
						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						responseData = (response as any).customerByEmail || {};
					}

					if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const query = `
							mutation upsertCustomer($input: UpsertCustomerInput!) {
								upsertCustomer(input: $input) {
									customer {
										id
										email {
											email
											isVerified
											verifiedAt {
												iso8601
											}
										}
										fullName
										shortName
										externalId
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								identifier: {
									customerId,
								},
								onCreate: {
									fullName: updateFields.fullName || 'Unknown',
									email: {
										email: updateFields.email || 'placeholder@example.com',
										isVerified: false,
									},
								},
								onUpdate: {
									...(updateFields.fullName && { fullName: { value: updateFields.fullName } }),
									...(updateFields.shortName && { shortName: { value: updateFields.shortName } }),
									...(updateFields.email && { 
										email: {
											email: updateFields.email,
											isVerified: false,
										}
									}),
								},
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.upsertCustomer?.error) {
							const error = result.upsertCustomer.error;
							let errorMessage = error.message || 'Unknown error';
							
							if (error.fields && error.fields.length > 0) {
								const fieldErrors = error.fields.map((field: any) => `${field.field}: ${field.message}`).join(', ');
								errorMessage += ` (Field errors: ${fieldErrors})`;
							}
							
							throw new NodeOperationError(this.getNode(), errorMessage);
						}
						
						responseData = result.upsertCustomer?.customer || {};

						// Handle customer groups if provided in update
						if (updateFields.customerGroupIds && Array.isArray(updateFields.customerGroupIds)) {
							if (updateFields.customerGroupIds.length > 0) {
								// Add customer to groups
								const groupQuery = `
									mutation addCustomerToCustomerGroups($input: AddCustomerToCustomerGroupsInput!) {
										addCustomerToCustomerGroups(input: $input) {
											customerGroupMemberships {
												customerGroup {
													id
													name
												}
											}
											error {
												message
												type
											}
										}
									}
								`;

								const groupVariables = {
									input: {
										customerId,
										customerGroupIdentifiers: updateFields.customerGroupIds.map((groupId: any) => ({
											customerGroupId: groupId,
										})),
									},
								};

								const groupResponse = await plainApiRequest.call(this, groupQuery, groupVariables);
								const groupResult = groupResponse as any;

								if (groupResult.addCustomerToCustomerGroups?.error) {
									throw new NodeOperationError(this.getNode(), groupResult.addCustomerToCustomerGroups.error.message);
								}

								// Add group information to response
								responseData.customerGroups = groupResult.addCustomerToCustomerGroups?.customerGroupMemberships?.map((membership: any) => membership.customerGroup) || [];
							}
						}
					}

					if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;

						const query = `
							mutation deleteCustomer($input: DeleteCustomerInput!) {
								deleteCustomer(input: $input) {
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: { customerId },
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.deleteCustomer?.error) {
							throw new NodeOperationError(this.getNode(), result.deleteCustomer.error.message);
						}
						
						responseData = { success: true };
					}
				}

				if (resource === 'thread') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const query = `
							mutation createThread($input: CreateThreadInput!) {
								createThread(input: $input) {
									thread {
										id
										customer {
											id
											fullName
										}
										title
										status
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						// Build the input with correct structure
						const input: any = {
							customerIdentifier: {
								customerId,
							},
						};

						// Add optional fields if provided
						if (title) {
							input.title = title;
						}

						// Add components if description is provided
						if (additionalFields.description) {
							input.components = [
								{
									componentText: {
										text: additionalFields.description,
									},
								},
							];
						}

						// Add labelTypeIds if provided
						if (additionalFields.labelTypeIds) {
							input.labelTypeIds = additionalFields.labelTypeIds;
						}

						// Add priority if provided (0-3, where 0 is most urgent)
						if (additionalFields.priority !== undefined) {
							input.priority = additionalFields.priority;
						}

						// Add externalId if provided
						if (additionalFields.externalId) {
							input.externalId = additionalFields.externalId;
						}

						// Add assignedTo if provided
						if (additionalFields.assignedToUserId) {
							input.assignedTo = {
								userId: additionalFields.assignedToUserId,
							};
						}

						// Add tenantIdentifier if provided
						if (additionalFields.tenantId || additionalFields.tenantExternalId) {
							input.tenantIdentifier = {};
							if (additionalFields.tenantId) {
								input.tenantIdentifier.tenantId = additionalFields.tenantId;
							}
							if (additionalFields.tenantExternalId) {
								input.tenantIdentifier.externalId = additionalFields.tenantExternalId;
							}
						}

						// Add threadFields if provided (from fixedCollection format)
						if (additionalFields.threadFields) {
							const threadFieldsData = additionalFields.threadFields as any;
							if (threadFieldsData.field && Array.isArray(threadFieldsData.field)) {
								input.threadFields = threadFieldsData.field.map((field: any) => {
									const fieldType = field.fieldType;
									let fieldSchema = '';
									
									// Get the appropriate field schema based on type
									if (fieldType === 'STRING') {
										fieldSchema = field.stringFieldSchema;
									} else if (fieldType === 'BOOL') {
										fieldSchema = field.boolFieldSchema;
									} else if (fieldType === 'ENUM') {
										fieldSchema = field.enumFieldSchema;
									}

									// Parse the encoded fieldSchema value: "key|type|id"
									const [key, type] = fieldSchema.split('|');
									
									const threadField: any = {
										key,
										type,
									};

									// Set the appropriate value based on type
									if (type === 'STRING') {
										threadField.stringValue = field.stringValue || '';
									} else if (type === 'BOOL') {
										threadField.booleanValue = field.booleanValue || false;
									} else if (type === 'ENUM') {
										threadField.stringValue = field.enumValue || '';
									}

									return threadField;
								});
							}
						}


						const variables = {
							input,
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.createThread?.error) {
							throw new NodeOperationError(this.getNode(), result.createThread.error.message);
						}
						
						responseData = result.createThread?.thread || {};
					}

					if (operation === 'reply') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const query = `
							mutation replyToThread($input: ReplyToThreadInput!) {
								replyToThread(input: $input) {
									error {
										message
										type
									}
								}
							}
						`;

						// Build the input with correct structure
						const input: any = {
							threadId,
							textContent: text,
						};

						// Add optional fields if provided
						if (additionalFields.markdownContent) {
							input.markdownContent = additionalFields.markdownContent;
						}

						if (additionalFields.attachmentIds) {
							input.attachmentIds = additionalFields.attachmentIds;
						}

						const variables = {
							input,
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.replyToThread?.error) {
							throw new NodeOperationError(this.getNode(), result.replyToThread.error.message);
						}
						
						responseData = { success: true };
					}

					if (operation === 'get') {
						const getBy = this.getNodeParameter('getBy', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

						if (getBy === 'threadId') {
							const threadId = this.getNodeParameter('threadIdValue', i) as string;

							const query = `
								query getThread($threadId: ID!) {
									thread(threadId: $threadId) {
										id
										externalId
										customer {
											id
											fullName
											email {
												email
											}
										}
										status
										statusChangedAt {
											iso8601
										}
										title
										previewText
										priority
										assignedTo {
											... on User {
												id
												fullName
												publicName
											}
											... on MachineUser {
												id
												fullName
												publicName
											}
											... on System {
												id
											}
										}
										labels {
											id
											labelType {
												id
												name
											}
										}
										threadFields {
											id
											key
											type
											stringValue
											booleanValue
										}
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
								}
							`;

							const variables = { threadId };
							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							responseData = result.thread || {};

						} else if (getBy === 'externalId') {
							const customerId = this.getNodeParameter('customerIdForExternalId', i) as string;
							const externalId = this.getNodeParameter('externalIdValue', i) as string;

							const query = `
								query getThreadByExternalId($customerId: ID!, $externalId: ID!) {
									threadByExternalId(customerId: $customerId, externalId: $externalId) {
										id
										externalId
										customer {
											id
											fullName
											email {
												email
											}
										}
										status
										statusChangedAt {
											iso8601
										}
										title
										previewText
										priority
										assignedTo {
											... on User {
												id
												fullName
												publicName
											}
											... on MachineUser {
												id
												fullName
												publicName
											}
											... on System {
												id
											}
										}
										labels {
											id
											labelType {
												id
												name
											}
										}
										threadFields {
											id
											key
											type
											stringValue
											booleanValue
										}
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
								}
							`;

							const variables = { customerId, externalId };
							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							responseData = result.threadByExternalId || {};

						} else if (getBy === 'customerId') {
							const customerId = this.getNodeParameter('customerIdValue', i) as string;
							const limit = (additionalFields.limit as number) || 50;

							const query = `
								query getThreadsByCustomerId($filters: ThreadsFilter!, $first: Int) {
									threads(filters: $filters, first: $first) {
										edges {
											node {
												id
												externalId
												customer {
													id
													fullName
													email {
														email
													}
												}
												status
												statusChangedAt {
													iso8601
												}
												title
												previewText
												priority
												assignedTo {
													... on User {
														id
														fullName
														publicName
													}
													... on MachineUser {
														id
														fullName
														publicName
													}
													... on System {
														id
													}
												}
												labels {
													id
													labelType {
														id
														name
													}
												}
												threadFields {
													id
													key
													type
													stringValue
													booleanValue
												}
												createdAt {
													iso8601
												}
												updatedAt {
													iso8601
												}
											}
										}
										pageInfo {
											hasNextPage
											hasPreviousPage
											startCursor
											endCursor
										}
									}
								}
							`;

							const variables = {
								filters: {
									customerIds: [customerId],
								},
								first: limit,
							};

							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							
							responseData = {
								threads: result.threads?.edges?.map((edge: any) => edge.node) || [],
								pageInfo: result.threads?.pageInfo || {},
							};

						} else if (getBy === 'customerEmail') {
							const customerEmail = this.getNodeParameter('customerEmailValue', i) as string;
							const limit = (additionalFields.limit as number) || 50;

							// First, get the customer by email
							const customerQuery = `
								query getCustomerByEmail($email: String!) {
									customerByEmail(email: $email) {
										id
										fullName
										email {
											email
										}
									}
								}
							`;

							const customerResponse = await plainApiRequest.call(this, customerQuery, { email: customerEmail });
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const customerResult = customerResponse as any;
							
							if (!customerResult.customerByEmail) {
								throw new NodeOperationError(this.getNode(), `Customer with email '${customerEmail}' not found`);
							}

							const customerId = customerResult.customerByEmail.id;

							// Now get the threads for this customer
							const threadsQuery = `
								query getThreadsByCustomerId($filters: ThreadsFilter!, $first: Int) {
									threads(filters: $filters, first: $first) {
										edges {
											node {
												id
												externalId
												customer {
													id
													fullName
													email {
														email
													}
												}
												status
												statusChangedAt {
													iso8601
												}
												title
												previewText
												priority
												assignedTo {
													... on User {
														id
														fullName
														publicName
													}
													... on MachineUser {
														id
														fullName
														publicName
													}
													... on System {
														id
													}
												}
												labels {
													id
													labelType {
														id
														name
													}
												}
												threadFields {
													id
													key
													type
													stringValue
													booleanValue
												}
												createdAt {
													iso8601
												}
												updatedAt {
													iso8601
												}
											}
										}
										pageInfo {
											hasNextPage
											hasPreviousPage
											startCursor
											endCursor
										}
									}
								}
							`;

							const threadsVariables = {
								filters: {
									customerIds: [customerId],
								},
								first: limit,
							};

							const threadsResponse = await plainApiRequest.call(this, threadsQuery, threadsVariables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const threadsResult = threadsResponse as any;
							
							responseData = {
								customer: customerResult.customerByEmail,
								threads: threadsResult.threads?.edges?.map((edge: any) => edge.node) || [],
								pageInfo: threadsResult.threads?.pageInfo || {},
							};
						}
					}

					if (operation === 'update') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						let responseData: any = {};

						// Handle title update
						if (additionalFields.updateTitle) {
							const query = `
								mutation updateThreadTitle($input: UpdateThreadTitleInput!) {
									updateThreadTitle(input: $input) {
										thread {
											id
											title
										}
										error {
											message
											type
										}
									}
								}
							`;

							const variables = {
								input: {
									threadId,
									title: additionalFields.updateTitle,
								},
							};

							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							
							if (result.updateThreadTitle?.error) {
								throw new NodeOperationError(this.getNode(), result.updateThreadTitle.error.message);
							}
							
							responseData = { ...responseData, ...result.updateThreadTitle?.thread };
						}

						// Handle priority update
						if (additionalFields.updatePriority !== '' && additionalFields.updatePriority !== undefined) {
							const query = `
								mutation changeThreadPriority($input: ChangeThreadPriorityInput!) {
									changeThreadPriority(input: $input) {
										thread {
											id
											priority
										}
										error {
											message
											type
										}
									}
								}
							`;

							const variables = {
								input: {
									threadId,
									priority: additionalFields.updatePriority,
								},
							};

							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							
							if (result.changeThreadPriority?.error) {
								throw new NodeOperationError(this.getNode(), result.changeThreadPriority.error.message);
							}
							
							responseData = { ...responseData, ...result.changeThreadPriority?.thread };
						}

						// Handle status update
						if (additionalFields.updateStatus) {
							let query = '';
							let mutationName = '';
							
							if (additionalFields.updateStatus === 'DONE') {
								mutationName = 'markThreadAsDone';
								query = `
									mutation markThreadAsDone($input: MarkThreadAsDoneInput!) {
										markThreadAsDone(input: $input) {
											thread {
												id
												status
												statusChangedAt {
													iso8601
												}
											}
											error {
												message
												type
											}
										}
									}
								`;
							} else if (additionalFields.updateStatus === 'TODO') {
								mutationName = 'markThreadAsTodo';
								query = `
									mutation markThreadAsTodo($input: MarkThreadAsTodoInput!) {
										markThreadAsTodo(input: $input) {
											thread {
												id
												status
												statusChangedAt {
													iso8601
												}
											}
											error {
												message
												type
											}
										}
									}
								`;
							} else if (additionalFields.updateStatus === 'SNOOZED') {
								mutationName = 'snoozeThread';
								query = `
									mutation snoozeThread($input: SnoozeThreadInput!) {
										snoozeThread(input: $input) {
											thread {
												id
												status
												statusChangedAt {
													iso8601
												}
											}
											error {
												message
												type
											}
										}
									}
								`;
							}

							if (query) {
								const variables = { input: { threadId } };
								const response = await plainApiRequest.call(this, query, variables);
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const result = response as any;
								
								if (result[mutationName]?.error) {
									throw new NodeOperationError(this.getNode(), result[mutationName].error.message);
								}
								
								responseData = { ...responseData, ...result[mutationName]?.thread };
							}
						}

						// Handle updating thread fields
						if (additionalFields.updateThreadFields) {
							const threadFieldsData = additionalFields.updateThreadFields as any;
							if (threadFieldsData.field && Array.isArray(threadFieldsData.field)) {
								const query = `
									mutation setThreadFields($input: SetThreadFieldsInput!) {
										setThreadFields(input: $input) {
											threadFields {
												id
												key
												type
												stringValue
												booleanValue
											}
											error {
												message
												type
											}
										}
									}
								`;

								const variables = {
									input: {
										threadId,
										threadFields: threadFieldsData.field.map((field: any) => {
											const fieldType = field.fieldType;
											let fieldSchema = '';
											
											// Get the appropriate field schema based on type
											if (fieldType === 'STRING') {
												fieldSchema = field.stringFieldSchema;
											} else if (fieldType === 'BOOL') {
												fieldSchema = field.boolFieldSchema;
											} else if (fieldType === 'ENUM') {
												fieldSchema = field.enumFieldSchema;
											}

											// Parse the encoded fieldSchema value: "key|type|id"
											const [key, type] = fieldSchema.split('|');
											
											const threadField: any = {
												key,
												type,
											};

											// Set the appropriate value based on type
											if (type === 'STRING') {
												threadField.stringValue = field.stringValue || '';
											} else if (type === 'BOOL') {
												threadField.booleanValue = field.booleanValue || false;
											} else if (type === 'ENUM') {
												threadField.stringValue = field.enumValue || '';
											}

											return threadField;
										}),
									},
								};

								const response = await plainApiRequest.call(this, query, variables);
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const result = response as any;
								
								if (result.setThreadFields?.error) {
									throw new NodeOperationError(this.getNode(), result.setThreadFields.error.message);
								}
								
								responseData = { ...responseData, threadFields: result.setThreadFields?.threadFields || [] };
							}
						}

						// Handle assignment
						if (additionalFields.assignToUserId) {
							const query = `
								mutation assignThread($input: AssignThreadInput!) {
									assignThread(input: $input) {
										thread {
											id
											assignedTo {
												... on User {
													id
													fullName
													publicName
												}
												... on MachineUser {
													id
													fullName
													publicName
												}
												... on System {
													id
												}
											}
										}
										error {
											message
											type
										}
									}
								}
							`;

							const variables = {
								input: {
									threadId,
									userId: additionalFields.assignToUserId,
								},
							};

							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							
							if (result.assignThread?.error) {
								throw new NodeOperationError(this.getNode(), result.assignThread.error.message);
							}
							
							responseData = { ...responseData, ...result.assignThread?.thread };

						} else if (additionalFields.unassignThread) {
							const query = `
								mutation unassignThread($input: UnassignThreadInput!) {
									unassignThread(input: $input) {
										thread {
											id
											assignedTo {
												... on User {
													id
													fullName
													publicName
												}
												... on MachineUser {
													id
													fullName
													publicName
												}
												... on System {
													id
												}
											}
										}
										error {
											message
											type
										}
									}
								}
							`;

							const variables = { input: { threadId } };
							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							
							if (result.unassignThread?.error) {
								throw new NodeOperationError(this.getNode(), result.unassignThread.error.message);
							}
							
							responseData = { ...responseData, ...result.unassignThread?.thread };
						}

						// If no updates were made, get the current thread data
						if (Object.keys(responseData).length === 0) {
							const query = `
								query getThread($threadId: ID!) {
									thread(threadId: $threadId) {
										id
										title
										priority
										status
										assignedTo {
											... on User {
												id
												fullName
												publicName
											}
											... on MachineUser {
												id
												fullName
												publicName
											}
											... on System {
												id
											}
										}
									}
								}
							`;

							const variables = { threadId };
							const response = await plainApiRequest.call(this, query, variables);
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const result = response as any;
							responseData = result.thread || {};
						}
					}

					if (operation === 'REMOVED_getByExternalId') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const externalId = this.getNodeParameter('externalId', i) as string;

						const query = `
							query getThreadByExternalId($customerId: ID!, $externalId: ID!) {
								threadByExternalId(customerId: $customerId, externalId: $externalId) {
									id
									externalId
									customer {
										id
										fullName
										email {
											email
										}
									}
									status
									statusChangedAt {
										iso8601
									}
									title
									previewText
									priority
									assignedTo {
										... on User {
											id
											fullName
											publicName
										}
										... on MachineUser {
											id
											fullName
											publicName
										}
										... on System {
											id
										}
									}
									labels {
										id
										labelType {
											id
											name
										}
									}
									threadFields {
										id
										key
										type
										stringValue
										booleanValue
									}
									createdAt {
										iso8601
									}
									updatedAt {
										iso8601
									}
								}
							}
						`;

						const variables = { customerId, externalId };

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						responseData = result.threadByExternalId || {};
					}

					if (operation === 'REMOVED_getByCustomerId') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						const limit = (additionalFields.limit as number) || 50;

						const query = `
							query getThreadsByCustomerId($filters: ThreadsFilter!, $first: Int) {
								threads(filters: $filters, first: $first) {
									edges {
										node {
											id
											externalId
											customer {
												id
												fullName
												email {
													email
												}
											}
											status
											statusChangedAt {
												iso8601
											}
											title
											previewText
											priority
											assignedTo {
												... on User {
													id
													fullName
													publicName
												}
												... on MachineUser {
													id
													fullName
													publicName
												}
												... on System {
													id
												}
											}
											labels {
												id
												labelType {
													id
													name
												}
											}
											threadFields {
												id
												key
												type
												stringValue
												booleanValue
											}
											createdAt {
												iso8601
											}
											updatedAt {
												iso8601
											}
										}
									}
									pageInfo {
										hasNextPage
										hasPreviousPage
										startCursor
										endCursor
									}
								}
							}
						`;

						const variables = {
							filters: {
								customerIds: [customerId],
							},
							first: limit,
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						// Return the threads array instead of the connection structure
						responseData = {
							threads: result.threads?.edges?.map((edge: any) => edge.node) || [],
							pageInfo: result.threads?.pageInfo || {},
						};
					}

					if (operation === 'REMOVED_getByCustomerEmail') {
						const customerEmail = this.getNodeParameter('customerEmail', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						const limit = (additionalFields.limit as number) || 50;

						// First, get the customer by email
						const customerQuery = `
							query getCustomerByEmail($email: String!) {
								customerByEmail(email: $email) {
									id
									fullName
									email {
										email
									}
								}
							}
						`;

						const customerResponse = await plainApiRequest.call(this, customerQuery, { email: customerEmail });
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const customerResult = customerResponse as any;
						
						if (!customerResult.customerByEmail) {
							throw new NodeOperationError(this.getNode(), `Customer with email '${customerEmail}' not found`);
						}

						const customerId = customerResult.customerByEmail.id;

						// Now get the threads for this customer
						const threadsQuery = `
							query getThreadsByCustomerId($filters: ThreadsFilter!, $first: Int) {
								threads(filters: $filters, first: $first) {
									edges {
										node {
											id
											externalId
											customer {
												id
												fullName
												email {
													email
												}
											}
											status
											statusChangedAt {
												iso8601
											}
											title
											previewText
											priority
											assignedTo {
												... on User {
													id
													fullName
													publicName
												}
												... on MachineUser {
													id
													fullName
													publicName
												}
												... on System {
													id
												}
											}
											labels {
												id
												labelType {
													id
													name
												}
											}
											threadFields {
												id
												key
												type
												stringValue
												booleanValue
											}
											createdAt {
												iso8601
											}
											updatedAt {
												iso8601
											}
										}
									}
									pageInfo {
										hasNextPage
										hasPreviousPage
										startCursor
										endCursor
									}
								}
							}
						`;

						const threadsVariables = {
							filters: {
								customerIds: [customerId],
							},
							first: limit,
						};

						const threadsResponse = await plainApiRequest.call(this, threadsQuery, threadsVariables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const threadsResult = threadsResponse as any;
						
						// Return the threads array with customer info
						responseData = {
							customer: customerResult.customerByEmail,
							threads: threadsResult.threads?.edges?.map((edge: any) => edge.node) || [],
							pageInfo: threadsResult.threads?.pageInfo || {},
						};
					}

					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						const limit = (additionalFields.limit as number) || 50;

						// Build filters object
						const filters: any = {};

						// Status filter
						if (additionalFields.statusFilter && Array.isArray(additionalFields.statusFilter) && additionalFields.statusFilter.length > 0) {
							filters.statuses = additionalFields.statusFilter;
						}

						// Priority filter
						if (additionalFields.priorityFilter && Array.isArray(additionalFields.priorityFilter) && additionalFields.priorityFilter.length > 0) {
							filters.priorities = additionalFields.priorityFilter;
						}

						// Assignment filters
						if (additionalFields.assignedToUserFilter) {
							filters.assignedToUser = [additionalFields.assignedToUserFilter];
						}

						if (additionalFields.isAssignedFilter !== '' && additionalFields.isAssignedFilter !== undefined) {
							filters.isAssigned = additionalFields.isAssignedFilter;
						}

						const query = `
							query getAllThreads($filters: ThreadsFilter, $first: Int) {
								threads(filters: $filters, first: $first) {
									edges {
										node {
											id
											externalId
											customer {
												id
												fullName
												email {
													email
												}
											}
											status
											statusChangedAt {
												iso8601
											}
											title
											previewText
											priority
											assignedTo {
												... on User {
													id
													fullName
													publicName
												}
												... on MachineUser {
													id
													fullName
													publicName
												}
												... on System {
													id
												}
											}
											labels {
												id
												labelType {
													id
													name
												}
											}
											threadFields {
												id
												key
												type
												stringValue
												booleanValue
											}
											createdAt {
												iso8601
											}
											updatedAt {
												iso8601
											}
										}
									}
									pageInfo {
										hasNextPage
										hasPreviousPage
										startCursor
										endCursor
									}
								}
							}
						`;

						const variables: any = {
							first: limit,
						};

						// Only add filters if we have any
						if (Object.keys(filters).length > 0) {
							variables.filters = filters;
						}

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						// Return the threads as individual items for n8n
						const threads = result.threads?.edges?.map((edge: any) => edge.node) || [];
						const pageInfo = result.threads?.pageInfo || {};
						
						// For multiple threads, we need to handle them specially
						if (threads.length === 0) {
							responseData = {
								message: 'No threads found',
								filters: filters,
								pageInfo: pageInfo,
							};
						} else if (threads.length === 1) {
							// Single thread - return it directly with metadata
							responseData = {
								...threads[0],
								_metadata: {
									filters: filters,
									pageInfo: pageInfo,
									totalCount: 1,
								},
							};
						} else {
							// Multiple threads - we'll return summary data here
							// and individual threads will be handled below
							responseData = {
								summary: {
									totalThreads: threads.length,
									filters: filters,
									pageInfo: pageInfo,
								},
								threads: threads,
							};
						}
					}

					if (operation === 'REMOVED_assign') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const machineUserId = this.getNodeParameter('machineUserId', i) as string;

						if (!userId && !machineUserId) {
							throw new NodeOperationError(this.getNode(), 'Either User ID or Machine User ID must be provided');
						}

						const query = `
							mutation assignThread($input: AssignThreadInput!) {
								assignThread(input: $input) {
									thread {
										id
										assignedTo {
											... on User {
												id
												fullName
												publicName
											}
											... on MachineUser {
												id
												fullName
												publicName
											}
											... on System {
												id
											}
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const input: any = { threadId };
						if (userId) {
							input.userId = userId;
						} else if (machineUserId) {
							input.machineUserId = machineUserId;
						}

						const variables = { input };

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.assignThread?.error) {
							throw new NodeOperationError(this.getNode(), result.assignThread.error.message);
						}
						
						responseData = result.assignThread?.thread || {};
					}

					if (operation === 'REMOVED_unassign') {
						const threadId = this.getNodeParameter('threadId', i) as string;

						const query = `
							mutation unassignThread($input: UnassignThreadInput!) {
								unassignThread(input: $input) {
									thread {
										id
										assignedTo {
											... on User {
												id
												fullName
												publicName
											}
											... on MachineUser {
												id
												fullName
												publicName
											}
											... on System {
												id
											}
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: { threadId },
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.unassignThread?.error) {
							throw new NodeOperationError(this.getNode(), result.unassignThread.error.message);
						}
						
						responseData = result.unassignThread?.thread || {};
					}

					if (operation === 'REMOVED_updatePriority') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const priority = this.getNodeParameter('priority', i) as number;

						const query = `
							mutation changeThreadPriority($input: ChangeThreadPriorityInput!) {
								changeThreadPriority(input: $input) {
									thread {
										id
										priority
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								threadId,
								priority,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.changeThreadPriority?.error) {
							throw new NodeOperationError(this.getNode(), result.changeThreadPriority.error.message);
						}
						
						responseData = result.changeThreadPriority?.thread || {};
					}

					if (operation === 'REMOVED_updateTitle') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const title = this.getNodeParameter('title', i) as string;

						const query = `
							mutation updateThreadTitle($input: UpdateThreadTitleInput!) {
								updateThreadTitle(input: $input) {
									thread {
										id
										title
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								threadId,
								title,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.updateThreadTitle?.error) {
							throw new NodeOperationError(this.getNode(), result.updateThreadTitle.error.message);
						}
						
						responseData = result.updateThreadTitle?.thread || {};
					}

					if (operation === 'REMOVED_markAsDone') {
						const threadId = this.getNodeParameter('threadId', i) as string;

						const query = `
							mutation markThreadAsDone($input: MarkThreadAsDoneInput!) {
								markThreadAsDone(input: $input) {
									thread {
										id
										status
										statusChangedAt {
											iso8601
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: { threadId },
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.markThreadAsDone?.error) {
							throw new NodeOperationError(this.getNode(), result.markThreadAsDone.error.message);
						}
						
						responseData = result.markThreadAsDone?.thread || {};
					}

					if (operation === 'REMOVED_markAsTodo') {
						const threadId = this.getNodeParameter('threadId', i) as string;

						const query = `
							mutation markThreadAsTodo($input: MarkThreadAsTodoInput!) {
								markThreadAsTodo(input: $input) {
									thread {
										id
										status
										statusChangedAt {
											iso8601
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: { threadId },
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.markThreadAsTodo?.error) {
							throw new NodeOperationError(this.getNode(), result.markThreadAsTodo.error.message);
						}
						
						responseData = result.markThreadAsTodo?.thread || {};
					}
				}

				if (resource === 'event') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const query = `
							mutation createCustomerEvent($input: CreateCustomerEventInput!) {
								createCustomerEvent(input: $input) {
									customerEvent {
										id
										title
										createdAt {
											iso8601
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						// Build the input with correct structure
						const input: any = {
							customerIdentifier: {
								customerId,
							},
							title,
							components: [
								{
									componentText: {
										text: additionalFields.description || title,
									},
								},
							],
						};

						// Add optional fields if provided
						if (additionalFields.externalId) {
							input.externalId = additionalFields.externalId;
						}

						const variables = {
							input,
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.createCustomerEvent?.error) {
							throw new NodeOperationError(this.getNode(), result.createCustomerEvent.error.message);
						}
						
						responseData = result.createCustomerEvent?.customerEvent || {};
					}
				}

				if (resource === 'label') {
					if (operation === 'add') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const labelTypeId = this.getNodeParameter('labelTypeId', i) as string;

						const query = `
							mutation addLabels($input: AddLabelsInput!) {
								addLabels(input: $input) {
									labels {
										id
										labelType {
											id
											name
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								threadId,
								labelTypeIds: [labelTypeId],
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.addLabels?.error) {
							throw new NodeOperationError(this.getNode(), result.addLabels.error.message);
						}
						
						responseData = result.addLabels?.labels || [];
					}

					if (operation === 'remove') {
						const labelId = this.getNodeParameter('labelId', i) as string;

						const query = `
							mutation removeLabels($input: RemoveLabelsInput!) {
								removeLabels(input: $input) {
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								labelIds: [labelId],
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.removeLabels?.error) {
							throw new NodeOperationError(this.getNode(), result.removeLabels.error.message);
						}
						
						responseData = { success: true };
					}
				}

				if (resource === 'tenant') {
					if (operation === 'upsert') {
						const name = this.getNodeParameter('name', i) as string;
						const externalId = this.getNodeParameter('externalId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const query = `
							mutation upsertTenant($input: UpsertTenantInput!) {
								upsertTenant(input: $input) {
									tenant {
										id
										name
										externalId
										url
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
									result
									error {
										message
										type
									}
								}
							}
						`;

						const variables = {
							input: {
								identifier: {
									externalId,
								},
								name,
								externalId,
								...(additionalFields.url && { url: { value: additionalFields.url } }),
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.upsertTenant?.error) {
							throw new NodeOperationError(this.getNode(), result.upsertTenant.error.message);
						}
						
						responseData = result.upsertTenant?.tenant || {};
					}

					if (operation === 'get') {
						const getBy = this.getNodeParameter('getBy', i) as string;
						let query = '';
						let variables: any = {};

						if (getBy === 'tenantId') {
							const tenantId = this.getNodeParameter('tenantId', i) as string;
							query = `
								query getTenant($tenantId: ID!) {
									tenant(tenantId: $tenantId) {
										id
										name
										externalId
										url
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
								}
							`;
							variables = { tenantId };
						} else if (getBy === 'externalId') {
							const externalId = this.getNodeParameter('externalIdValue', i) as string;
							query = `
								query getTenantByExternalId($externalId: String!) {
									tenantByExternalId(externalId: $externalId) {
										id
										name
										externalId
										url
										createdAt {
											iso8601
										}
										updatedAt {
											iso8601
										}
									}
								}
							`;
							variables = { externalId };
						}

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (getBy === 'tenantId') {
							responseData = result.tenant || {};
						} else {
							responseData = result.tenantByExternalId || {};
						}
					}

					if (operation === 'addCustomers') {
						const customerIdentifier = this.getNodeParameter('customerIdentifier', i) as any;
						const tenantIdentifiers = this.getNodeParameter('tenantIdentifiers', i) as any;

						const query = `
							mutation addCustomerToTenants($input: AddCustomerToTenantsInput!) {
								addCustomerToTenants(input: $input) {
									customer {
										id
										fullName
										email {
											email
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						// Build customer identifier
						const customerIdentifierInput: any = {};
						if (!customerIdentifier?.customer) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier is required');
						}
						const customerData = customerIdentifier.customer;
						if (!customerData || !customerData.identifyBy) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier data is incomplete');
						}
						if (customerData.identifyBy === 'customerId') {
							customerIdentifierInput.customerId = customerData.customerId;
						} else if (customerData.identifyBy === 'emailAddress') {
							customerIdentifierInput.emailAddress = customerData.emailAddress;
						} else if (customerData.identifyBy === 'externalId') {
							customerIdentifierInput.externalId = customerData.externalId;
						}

						// Build tenant identifiers
						if (!tenantIdentifiers?.tenant || !Array.isArray(tenantIdentifiers.tenant) || tenantIdentifiers.tenant.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Tenant identifiers are required');
						}
						const tenantIdentifiersInput = tenantIdentifiers.tenant.map((tenant: any) => {
							if (!tenant || !tenant.identifyBy) {
								throw new NodeOperationError(this.getNode(), 'Tenant identifier data is incomplete');
							}
							const tenantId: any = {};
							if (tenant.identifyBy === 'tenantId') {
								tenantId.tenantId = tenant.tenantId;
							} else if (tenant.identifyBy === 'externalId') {
								tenantId.externalId = tenant.externalId;
							}
							return tenantId;
						});

						const variables = {
							input: {
								customerIdentifier: customerIdentifierInput,
								tenantIdentifiers: tenantIdentifiersInput,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.addCustomerToTenants?.error) {
							const error = result.addCustomerToTenants.error;
							let errorMessage = error.message || 'Unknown error';
							
							if (error.fields && error.fields.length > 0) {
								const fieldErrors = error.fields.map((field: any) => `${field.field}: ${field.message}`).join(', ');
								errorMessage += ` (Field errors: ${fieldErrors})`;
							}
							
							throw new NodeOperationError(this.getNode(), errorMessage);
						}
						
						responseData = result.addCustomerToTenants?.customer || {};
					}

					if (operation === 'removeCustomers') {
						const customerIdentifier = this.getNodeParameter('customerIdentifier', i) as any;
						const tenantIdentifiers = this.getNodeParameter('tenantIdentifiers', i) as any;

						const query = `
							mutation removeCustomerFromTenants($input: RemoveCustomerFromTenantsInput!) {
								removeCustomerFromTenants(input: $input) {
									customer {
										id
										fullName
										email {
											email
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						// Build customer identifier
						const customerIdentifierInput: any = {};
						if (!customerIdentifier?.customer) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier is required');
						}
						const customerData = customerIdentifier.customer;
						if (!customerData || !customerData.identifyBy) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier data is incomplete');
						}
						if (customerData.identifyBy === 'customerId') {
							customerIdentifierInput.customerId = customerData.customerId;
						} else if (customerData.identifyBy === 'emailAddress') {
							customerIdentifierInput.emailAddress = customerData.emailAddress;
						} else if (customerData.identifyBy === 'externalId') {
							customerIdentifierInput.externalId = customerData.externalId;
						}

						// Build tenant identifiers
						if (!tenantIdentifiers?.tenant || !Array.isArray(tenantIdentifiers.tenant) || tenantIdentifiers.tenant.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Tenant identifiers are required');
						}
						const tenantIdentifiersInput = tenantIdentifiers.tenant.map((tenant: any) => {
							if (!tenant || !tenant.identifyBy) {
								throw new NodeOperationError(this.getNode(), 'Tenant identifier data is incomplete');
							}
							const tenantId: any = {};
							if (tenant.identifyBy === 'tenantId') {
								tenantId.tenantId = tenant.tenantId;
							} else if (tenant.identifyBy === 'externalId') {
								tenantId.externalId = tenant.externalId;
							}
							return tenantId;
						});

						const variables = {
							input: {
								customerIdentifier: customerIdentifierInput,
								tenantIdentifiers: tenantIdentifiersInput,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.removeCustomerFromTenants?.error) {
							throw new NodeOperationError(this.getNode(), result.removeCustomerFromTenants.error.message);
						}
						
						responseData = result.removeCustomerFromTenants?.customer || {};
					}

					if (operation === 'setCustomerTenants') {
						const customerIdentifier = this.getNodeParameter('customerIdentifier', i) as any;
						const tenantIdentifiers = this.getNodeParameter('tenantIdentifiers', i) as any;

						const query = `
							mutation setCustomerTenants($input: SetCustomerTenantsInput!) {
								setCustomerTenants(input: $input) {
									customer {
										id
										fullName
										email {
											email
										}
									}
									error {
										message
										type
									}
								}
							}
						`;

						// Build customer identifier
						const customerIdentifierInput: any = {};
						if (!customerIdentifier?.customer) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier is required');
						}
						const customerData = customerIdentifier.customer;
						if (!customerData || !customerData.identifyBy) {
							throw new NodeOperationError(this.getNode(), 'Customer identifier data is incomplete');
						}
						if (customerData.identifyBy === 'customerId') {
							customerIdentifierInput.customerId = customerData.customerId;
						} else if (customerData.identifyBy === 'emailAddress') {
							customerIdentifierInput.emailAddress = customerData.emailAddress;
						} else if (customerData.identifyBy === 'externalId') {
							customerIdentifierInput.externalId = customerData.externalId;
						}

						// Build tenant identifiers
						if (!tenantIdentifiers?.tenant || !Array.isArray(tenantIdentifiers.tenant) || tenantIdentifiers.tenant.length === 0) {
							throw new NodeOperationError(this.getNode(), 'Tenant identifiers are required');
						}
						const tenantIdentifiersInput = tenantIdentifiers.tenant.map((tenant: any) => {
							if (!tenant || !tenant.identifyBy) {
								throw new NodeOperationError(this.getNode(), 'Tenant identifier data is incomplete');
							}
							const tenantId: any = {};
							if (tenant.identifyBy === 'tenantId') {
								tenantId.tenantId = tenant.tenantId;
							} else if (tenant.identifyBy === 'externalId') {
								tenantId.externalId = tenant.externalId;
							}
							return tenantId;
						});

						const variables = {
							input: {
								customerIdentifier: customerIdentifierInput,
								tenantIdentifiers: tenantIdentifiersInput,
							},
						};

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						if (result.setCustomerTenants?.error) {
							throw new NodeOperationError(this.getNode(), result.setCustomerTenants.error.message);
						}
						
						responseData = result.setCustomerTenants?.customer || {};
					}

					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						const limit = (additionalFields.limit as number) || 50;
						const after = additionalFields.after as string;
						const before = additionalFields.before as string;

						const query = `
							query getAllTenants($first: Int, $after: String, $last: Int, $before: String) {
								tenants(first: $first, after: $after, last: $last, before: $before) {
									edges {
										cursor
										node {
											id
											name
											externalId
											url
											createdAt {
												iso8601
											}
											updatedAt {
												iso8601
											}
										}
									}
									pageInfo {
										hasNextPage
										hasPreviousPage
										startCursor
										endCursor
									}
								}
							}
						`;

						const variables: any = {};

						// Handle pagination - use either forward or backward pagination, not both
						if (before) {
							variables.last = limit;
							variables.before = before;
						} else {
							variables.first = limit;
							if (after) {
								variables.after = after;
							}
						}

						const response = await plainApiRequest.call(this, query, variables);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const result = response as any;
						
						// Return the tenants as individual items for n8n
						const tenants = result.tenants?.edges?.map((edge: any) => edge.node) || [];
						const pageInfo = result.tenants?.pageInfo || {};
						
						// For multiple tenants, we need to handle them specially
						if (tenants.length === 0) {
							responseData = {
								message: 'No tenants found',
								pageInfo: pageInfo,
							};
						} else if (tenants.length === 1) {
							// Single tenant - return it directly with metadata
							responseData = {
								...tenants[0],
								_metadata: {
									pageInfo: pageInfo,
									totalCount: 1,
								},
							};
						} else {
							// Multiple tenants - we'll return summary data here
							// and individual tenants will be handled below
							responseData = {
								summary: {
									totalTenants: tenants.length,
									pageInfo: pageInfo,
								},
								tenants: tenants,
							};
						}
					}
				}

				// Special handling for operations that return multiple items
				if ((operation === 'getAll' || (operation === 'get' && responseData.threads)) && responseData.threads && Array.isArray(responseData.threads)) {
					// For getAll operation, create separate execution data for each thread
					for (const thread of responseData.threads) {
						const threadWithMetadata = {
							...thread,
							_metadata: {
								filters: (responseData as any).summary?.filters || (responseData as any).filters || {},
								pageInfo: (responseData as any).summary?.pageInfo || (responseData as any).pageInfo || {},
								customer: (responseData as any).customer || null,
								operation: operation,
							},
						};
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(threadWithMetadata),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				} else if (resource === 'company' && operation === 'getAll' && responseData.companies && Array.isArray(responseData.companies)) {
					// For company getAll operation, create separate execution data for each company
					for (const company of responseData.companies) {
						const companyWithMetadata = {
							...company,
							_metadata: {
								pageInfo: (responseData as any).summary?.pageInfo || (responseData as any).pageInfo || {},
								operation: operation,
							},
						};
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(companyWithMetadata),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				} else if (resource === 'tenant' && operation === 'getAll' && responseData.tenants && Array.isArray(responseData.tenants)) {
					// For tenant getAll operation, create separate execution data for each tenant
					for (const tenant of responseData.tenants) {
						const tenantWithMetadata = {
							...tenant,
							_metadata: {
								pageInfo: (responseData as any).summary?.pageInfo || (responseData as any).pageInfo || {},
								operation: operation,
							},
						};
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(tenantWithMetadata),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				} else {
					// Standard handling for single-item operations
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error instanceof Error ? error.message : 'Unknown error' }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}