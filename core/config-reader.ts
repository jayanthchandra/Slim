import fs from 'fs';
import { getConfigLocations } from '../storage/paths';
import { MCPConfig } from '../types/mcp';

export function readConfig(): MCPConfig | null {
  for (const loc of getConfigLocations()) {
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
