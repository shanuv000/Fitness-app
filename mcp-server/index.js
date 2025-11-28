#!/usr/bin/env node
require('dotenv').config();
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'fitness-app';

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    // console.error('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

const server = new Server(
  {
    name: 'mongodb-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_collections',
        description: 'List all collections in the database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'find_documents',
        description: 'Find documents in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'Collection name' },
            query: { type: 'object', description: 'MongoDB query object' },
            limit: { type: 'number', description: 'Max number of documents to return' },
          },
          required: ['collection'],
        },
      },
      {
        name: 'insert_document',
        description: 'Insert a document into a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'Collection name' },
            document: { type: 'object', description: 'Document to insert' },
          },
          required: ['collection', 'document'],
        },
      },
      {
        name: 'update_document',
        description: 'Update a document in a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'Collection name' },
            filter: { type: 'object', description: 'Filter to find the document' },
            update: { type: 'object', description: 'Update operations' },
          },
          required: ['collection', 'filter', 'update'],
        },
      },
      {
        name: 'delete_document',
        description: 'Delete a document from a collection',
        inputSchema: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'Collection name' },
            filter: { type: 'object', description: 'Filter to find the document' },
          },
          required: ['collection', 'filter'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!db) {
    throw new Error('Database not connected');
  }

  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_collections': {
        const collections = await db.listCollections().toArray();
        return {
          content: [{ type: 'text', text: JSON.stringify(collections.map(c => c.name), null, 2) }],
        };
      }

      case 'find_documents': {
        const { collection, query = {}, limit = 10 } = args;
        const documents = await db.collection(collection).find(query).limit(limit).toArray();
        return {
          content: [{ type: 'text', text: JSON.stringify(documents, null, 2) }],
        };
      }

      case 'insert_document': {
        const { collection, document } = args;
        const result = await db.collection(collection).insertOne(document);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'update_document': {
        const { collection, filter, update } = args;
        // Handle ObjectId conversion if needed (simple heuristic)
        if (filter._id && typeof filter._id === 'string' && ObjectId.isValid(filter._id)) {
            filter._id = new ObjectId(filter._id);
        }
        const result = await db.collection(collection).updateOne(filter, update);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'delete_document': {
        const { collection, filter } = args;
        if (filter._id && typeof filter._id === 'string' && ObjectId.isValid(filter._id)) {
            filter._id = new ObjectId(filter._id);
        }
        const result = await db.collection(collection).deleteOne(filter);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function run() {
  await connectToDb();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // console.error('MCP Server running on stdio');
}

run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
