import { McpClient } from './mcp-client.js';
export async function fetchTools(serverName, config) {
    const client = new McpClient();
    try {
        await client.connect(config);
        const result = await client.request('tools/list');
        return result.tools || [];
    }
    catch (error) {
        console.error(`Failed to fetch tools from ${serverName}:`, error);
        return [];
    }
    finally {
        client.close();
    }
}
