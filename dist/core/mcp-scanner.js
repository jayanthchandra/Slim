import { getCliConfigPath } from '../storage/paths.js';
import { readJsonFile } from '../storage/file-store.js';
export async function scanMcpServers(cli) {
    const configPath = getCliConfigPath(cli);
    const settings = await readJsonFile(configPath);
    if (!settings || !settings.mcpServers) {
        console.warn(`No MCP servers found in ${configPath}`);
        return {};
    }
    return settings.mcpServers;
}
