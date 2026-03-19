import { getCliConfigPath } from '../storage/paths.js';
import { readJsonFile } from '../storage/file-store.js';
import { MCPServerConfig } from '../types/mcp-types.js';

interface SettingsFile {
  mcpServers?: Record<string, MCPServerConfig>;
}

export async function scanMcpServers(cli: string): Promise<Record<string, MCPServerConfig>> {
  const configPath = getCliConfigPath(cli);
  const settings = await readJsonFile<SettingsFile>(configPath);

  if (!settings || !settings.mcpServers) {
    console.warn(`No MCP servers found in ${configPath}`);
    return {};
  }

  return settings.mcpServers;
}
