import { INodeProperties } from "n8n-workflow";

export const companyOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["company"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        description: "Create a company",
        action: "Create a company",
      },
      {
        name: "Get",
        value: "get",
        description: "Get a company",
        action: "Get a company",
      },
      {
        name: "Get All",
        value: "getAll",
        description: "Get all companies",
        action: "Get all companies",
      },
      {
        name: "Update",
        value: "update",
        description: "Update a company",
        action: "Update a company",
      },
      {
        name: "Delete",
        value: "delete",
        description: "Delete a company",
        action: "Delete a company",
      },
    ],
    default: "get",
  },
];

export const companyFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: "Company Name",
    name: "name",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["create"],
      },
    },
    default: "",
    description: "The name of the company",
  },
  {
    displayName: "Domain Name",
    name: "domainName",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["create"],
      },
    },
    default: "",
    description: "The domain name of the company (e.g., example.com)",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "External ID",
        name: "externalId",
        type: "string",
        default: "",
        description: "External identifier for the company",
      },
      {
        displayName: "Contract Value",
        name: "contractValue",
        type: "number",
        default: 0,
        description: "The contract value for the company",
      },
      {
        displayName: "Account Owner",
        name: "accountOwnerUserId",
        type: "options",
        typeOptions: {
          loadOptionsMethod: "getUsers",
        },
        default: "",
        description: "The user to assign as account owner",
      },
    ],
  },

  // Get operation fields
  {
    displayName: "Get By",
    name: "getBy",
    type: "options",
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["get"],
      },
    },
    options: [
      {
        name: "Company ID",
        value: "companyId",
        description: "Get company by Plain company ID",
      },
      {
        name: "Domain Name",
        value: "domainName",
        description: "Get company by domain name",
      },
    ],
    default: "companyId",
  },
  {
    displayName: "Company ID",
    name: "companyId",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["get"],
        getBy: ["companyId"],
      },
    },
    default: "",
    description: "The Plain company ID",
  },
  {
    displayName: "Domain Name",
    name: "domainNameValue",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["get"],
        getBy: ["domainName"],
      },
    },
    default: "",
    description: "The domain name of the company",
  },

  // Get All operation fields
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Limit",
        name: "limit",
        type: "number",
        default: 50,
        description: "Maximum number of companies to return",
      },
      {
        displayName: "Include Deleted",
        name: "includeDeleted",
        type: "boolean",
        default: false,
        description: "Whether to include deleted companies",
      },
    ],
  },

  // Update operation fields
  {
    displayName: "Company Identifier",
    name: "companyIdentifier",
    type: "fixedCollection",
    placeholder: "Add Identifier",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["update"],
      },
    },
    default: {},
    typeOptions: {
      multipleValues: false,
    },
    options: [
      {
        name: "identifier",
        displayName: "Company Identifier",
        values: [
          {
            displayName: "Identify By",
            name: "identifyBy",
            type: "options",
            options: [
              {
                name: "Company ID",
                value: "companyId",
                description: "Use Plain company ID",
              },
              {
                name: "Domain Name",
                value: "domainName",
                description: "Use company domain name",
              },
            ],
            default: "companyId",
          },
          {
            displayName: "Company ID",
            name: "companyId",
            type: "string",
            displayOptions: {
              show: {
                identifyBy: ["companyId"],
              },
            },
            default: "",
            description: "The Plain company ID",
          },
          {
            displayName: "Domain Name",
            name: "domainName",
            type: "string",
            displayOptions: {
              show: {
                identifyBy: ["domainName"],
              },
            },
            default: "",
            description: "The company domain name",
          },
        ],
      },
    ],
  },
  {
    displayName: "Fields to Update",
    name: "updateFields",
    type: "fixedCollection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["update"],
      },
    },
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        name: "fields",
        displayName: "Update Field",
        values: [
          {
            displayName: "Field",
            name: "fieldName",
            type: "options",
            options: [
              {
                name: "Company Name",
                value: "name",
                description: "Update the company name",
              },
              {
                name: "Domain Name",
                value: "domainName",
                description: "Update the company domain name",
              },
              {
                name: "Contract Value",
                value: "contractValue",
                description: "Update the contract value",
              },
              {
                name: "Account Owner",
                value: "accountOwnerUserId",
                description: "Update the account owner",
              },
            ],
            default: "name",
          },
          {
            displayName: "Company Name",
            name: "name",
            type: "string",
            displayOptions: {
              show: {
                fieldName: ["name"],
              },
            },
            default: "",
            description: "The updated name of the company",
          },
          {
            displayName: "Domain Name",
            name: "domainName",
            type: "string",
            displayOptions: {
              show: {
                fieldName: ["domainName"],
              },
            },
            default: "",
            description: "The updated domain name of the company",
          },
          {
            displayName: "Contract Value",
            name: "contractValue",
            type: "number",
            displayOptions: {
              show: {
                fieldName: ["contractValue"],
              },
            },
            default: 0,
            description: "The contract value for the company",
          },
          {
            displayName: "Account Owner",
            name: "accountOwnerUserId",
            type: "options",
            typeOptions: {
              loadOptionsMethod: "getUsers",
            },
            displayOptions: {
              show: {
                fieldName: ["accountOwnerUserId"],
              },
            },
            default: "",
            description: "The user to assign as account owner",
          },
        ],
      },
    ],
  },

  // Delete operation fields
  {
    displayName: "Company Identifier",
    name: "companyIdentifier",
    type: "fixedCollection",
    placeholder: "Add Identifier",
    required: true,
    displayOptions: {
      show: {
        resource: ["company"],
        operation: ["delete"],
      },
    },
    default: {},
    typeOptions: {
      multipleValues: false,
    },
    options: [
      {
        name: "identifier",
        displayName: "Company Identifier",
        values: [
          {
            displayName: "Identify By",
            name: "identifyBy",
            type: "options",
            options: [
              {
                name: "Company ID",
                value: "companyId",
                description: "Use Plain company ID",
              },
              {
                name: "Domain Name",
                value: "domainName",
                description: "Use company domain name",
              },
            ],
            default: "companyId",
          },
          {
            displayName: "Company ID",
            name: "companyId",
            type: "string",
            displayOptions: {
              show: {
                identifyBy: ["companyId"],
              },
            },
            default: "",
            description: "The Plain company ID",
          },
          {
            displayName: "Domain Name",
            name: "domainName",
            type: "string",
            displayOptions: {
              show: {
                identifyBy: ["domainName"],
              },
            },
            default: "",
            description: "The company domain name",
          },
        ],
      },
    ],
  },
];
