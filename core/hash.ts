import crypto from 'crypto';
import fs from 'fs';
import { CONFIG_HASH_FILE } from '../storage/paths';
import { MCPConfig } from '../types/mcp';

export function computeHash(config: MCPConfig): string {
  const str = JSON.stringify(config.mcpServers);
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function saveHash(hash: string): void {
  fs.writeFileSync(CONFIG_HASH_FILE, hash, 'utf-8');
}

export function loadHash(): string | null {
  if (fs.existsSync(CONFIG_HASH_FILE)) {
    return fs.readFileSync(CONFIG_HASH_FILE, 'utf-8');
  }
  return null;
}
