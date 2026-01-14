import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, handleToolCall } from './tools';
import { resources, handleResourceRead } from './resources';

const server = new Server(
  {
    name: 'nativeui-mcp',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return handleToolCall(request.params.name, request.params.arguments);
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources,
}));

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return handleResourceRead(request.params.uri);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('nativeui MCP server running');
}

main().catch(console.error);
