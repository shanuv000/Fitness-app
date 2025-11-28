const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['index.js'],
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log('Connected to MCP server');

    const tools = await client.listTools();
    console.log('Available tools:', tools.tools.map(t => t.name));

    if (tools.tools.some(t => t.name === 'list_collections')) {
      console.log('Calling list_collections...');
      const result = await client.callTool({
        name: 'list_collections',
        arguments: {},
      });
      console.log('Collections:', JSON.parse(result.content[0].text));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
