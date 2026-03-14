import crypto from 'crypto';
import fs from 'fs';
import { getConfigHashFile } from '../storage/paths';
import { MCPConfig } from '../types/mcp';

export function computeHash(config: MCPConfig): string {
  const str = JSON.stringify(config.mcpServers);
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function saveHash(hash: string): void {
  fs.writeFileSync(getConfigHashFile(), hash, 'utf-8');
}

export function loadHash(): string | null {
  const file = getConfigHashFile();
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf-8');
  }
  return null;
}
