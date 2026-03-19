import { RegistryManager } from './registry-manager.js';
import { McpClient } from './mcp-client.js';
import { scanMcpServers } from './mcp-scanner.js';
import { detectCli } from './cli-detector.js';
export async function executeSkill(skillName, action, params) {
    const cli = detectCli();
    const registryManager = new RegistryManager(cli);
    const registry = await registryManager.load();
    const skillInfo = registry[skillName];
    if (!skillInfo) {
        throw new Error(`Skill ${skillName} not found in registry`);
    }
    const toolName = skillInfo.actions[action];
    if (!toolName) {
        throw new Error(`Action ${action} not found for skill ${skillName}`);
    }
    // Get server config
    const servers = await scanMcpServers(cli);
    const serverConfig = servers[skillInfo.server];
    if (!serverConfig) {
        throw new Error(`Server config for ${skillInfo.server} not found`);
    }
    const client = new McpClient();
    try {
        await client.connect(serverConfig);
        const result = await client.request('tools/call', {
            name: toolName,
            arguments: params
        });
        return result;
    }
    finally {
        client.close();
    }
}
