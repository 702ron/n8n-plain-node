export interface IPlainCustomer {
	id: string;
	email: string;
	fullName: string;
	shortName?: string;
	externalId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface IPlainThread {
	id: string;
	customer: {
		id: string;
		fullName: string;
	};
	title: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface IPlainEvent {
	id: string;
	title: string;
	createdAt: string;
}

export interface IPlainLabel {
	id: string;
	labelType: {
		id: string;
		name: string;
	};
}

export interface IPlainTenant {
	id: string;
	name: string;
	externalId: string;
	url?: string;
	createdAt: string;
	updatedAt: string;
}

export interface IPlainCompany {
	id: string;
	name: string;
	domainName: string;
	logoUrl?: string;
	createdAt: string;
	updatedAt: string;
	tier?: {
		id: string;
		name: string;
	};
	contractValue?: number;
	accountOwner?: {
		id: string;
		fullName: string;
		publicName: string;
	};
	isDeleted: boolean;
	deletedAt?: string;
}

export interface IPlainError {
	message: string;
	type: string;
	fields?: Array<{
		field: string;
		message: string;
	}>;
}