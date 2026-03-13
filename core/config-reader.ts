import fs from 'fs';
import { CONFIG_LOCATIONS } from '../storage/paths';
import { MCPConfig } from '../types/mcp';

export function readConfig(): MCPConfig | null {
  for (const loc of CONFIG_LOCATIONS) {
    if (fs.existsSync(loc)) {
      try {
        const content = fs.readFileSync(loc, 'utf-8');
        const json = JSON.parse(content);
        if (json.mcpServers) {
          return { mcpServers: json.mcpServers };
        }
      } catch (e) {
        console.error(`Error reading config at ${loc}:`, e);
      }
    }
  }
  return null;
}
