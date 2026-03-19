import { McpClient } from './mcp-client.js';
import { MCPServerConfig, MCPTool } from '../types/mcp-types.js';

export async function fetchTools(serverName: string, config: MCPServerConfig): Promise<MCPTool[]> {
  const client = new McpClient();
  try {
    await client.connect(config);
    const result = await client.request('tools/list');
    return result.tools || [];
  } catch (error) {
    console.error(`Failed to fetch tools from ${serverName}:`, error);
    return [];
  } finally {
    client.close();
  }
}
