import React from 'react'
import MainLayout from '@/layouts/MainLayout'
import Markdown from '@/components/Markdown'
import DocSidebar from '@/components/DocSidebar'

// Content for the API documentation page in markdown format
const apiContent = `
# API Documentation

This page provides comprehensive documentation for reNamerX's API, allowing developers to integrate reNamerX's powerful file renaming capabilities into their own applications.

## Getting Started with the API

### Overview
reNamerX provides a REST API and a native DLL that you can integrate into your applications. The API gives you programmatic access to all the file renaming capabilities available in the GUI application.

### Authentication
To use the reNamerX API, you'll need an API key. Currently, API keys are available to registered users. [Contact us](/contact) to request an API key for your project.

## REST API

### Base URL
All API endpoints are relative to the base URL:

\`\`\`
https://api.renamerx.app/v1
\`\`\`

### Endpoints

#### List Available Operations
\`\`\`http
GET /operations
\`\`\`

Returns a list of all available renaming operations that can be applied.

#### Get Operation Details
\`\`\`http
GET /operations/{operation_id}
\`\`\`

Returns detailed information about a specific renaming operation, including parameters and constraints.

#### Preview Rename
\`\`\`http
POST /preview
\`\`\`

Body:
\`\`\`json
{
  "files": ["file1.jpg", "file2.jpg"],
  "operations": [
    {
      "type": "replace",
      "params": {
        "find": "IMG",
        "replace": "Photo"
      }
    }
  ]
}
\`\`\`

Returns a preview of how the files would be renamed without actually renaming them.

#### Execute Rename
\`\`\`http
POST /rename
\`\`\`

Body:
\`\`\`json
{
  "files": ["file1.jpg", "file2.jpg"],
  "operations": [
    {
      "type": "replace",
      "params": {
        "find": "IMG",
        "replace": "Photo"
      }
    }
  ]
}
\`\`\`

Executes the rename operation on the specified files.

### Responses

All API responses are returned in JSON format with appropriate HTTP status codes.

Success response:
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

Error response:
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
\`\`\`

## Native DLL Integration

### Overview
For Windows applications, you can use our native DLL to integrate reNamerX's functionality directly into your application.

### Installation

1. Download the reNamerX SDK from the [developer portal](https://developer.renamerx.app)
2. Include the DLL in your project
3. Add the necessary references

### Basic Usage Example (C#)

\`\`\`csharp
using ReNamerX.SDK;

// Initialize the renamer
var renamer = new Renamer("YOUR_API_KEY");

// Define renaming operations
var operations = new List<RenameOperation>
{
    new ReplaceOperation
    {
        Find = "IMG",
        Replace = "Photo"
    },
    new CaseOperation
    {
        Type = CaseType.UpperCase
    }
};

// Preview the rename
var previewResults = renamer.Preview(filePaths, operations);

// Execute the rename
var results = renamer.Execute(filePaths, operations);
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_FAILED | Invalid or missing API key |
| INVALID_REQUEST | Malformed request |
| FILE_NOT_FOUND | One or more files could not be found |
| ACCESS_DENIED | Permission denied for one or more files |
| OPERATION_INVALID | Invalid operation type or parameters |
| CONFLICT | Filename conflict detected |
| RATE_LIMIT | API rate limit exceeded |
| SERVER_ERROR | Internal server error |

## Rate Limits

Free tier: 500 requests per day  
Professional tier: 10,000 requests per day  
Enterprise tier: Custom limits

## Webhook Integration

You can configure webhooks to receive notifications when rename operations complete. Configure webhooks in the [developer portal](https://developer.renamerx.app).

## SDK Libraries

We provide official SDK libraries for the following languages:

- JavaScript/TypeScript
- Python
- C#
- Java

## Support

For API support, contact our [developer support team](/contact) or visit our [GitHub repository](https://github.com/Gcavazo1/reNamerX) to file an issue.
`;

// Section identifiers for navigation
const sections = [
  { id: 'getting-started-with-the-api', title: 'Getting Started' },
  { id: 'rest-api', title: 'REST API' },
  { id: 'native-dll-integration', title: 'Native DLL Integration' },
  { id: 'error-codes', title: 'Error Codes' },
  { id: 'rate-limits', title: 'Rate Limits' },
  { id: 'webhook-integration', title: 'Webhook Integration' },
  { id: 'sdk-libraries', title: 'SDK Libraries' },
  { id: 'support', title: 'Support' }
];

export default function Api() {
  return (
    <MainLayout 
      title="reNamerX API Documentation" 
      description="Comprehensive documentation for integrating with the reNamerX API. Learn how to add powerful batch file renaming capabilities to your applications."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <DocSidebar 
            currentPath="/docs/api" 
            sections={sections} 
          />
          
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="sr-only">reNamerX API Documentation</h1>
            <Markdown content={apiContent} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 