import fs from 'fs';
import { MCP_SLASH_ROOT } from '../storage/paths';

export function scrubCommand() {
  if (fs.existsSync(MCP_SLASH_ROOT)) {
    fs.rmSync(MCP_SLASH_ROOT, { recursive: true, force: true });
    console.log(`Deleted ${MCP_SLASH_ROOT}`);
  } else {
    console.log(`${MCP_SLASH_ROOT} does not exist.`);
  }
}
