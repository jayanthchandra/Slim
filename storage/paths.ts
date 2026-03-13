import path from 'path';
import os from 'os';
import fs from 'fs';

const HOME_DIR = os.homedir();
export const MCP_SLASH_ROOT = path.join(HOME_DIR, '.mcp-slim');
export const SCHEMA_DIR = path.join(MCP_SLASH_ROOT, 'schemas');
export const SKILL_DIR = path.join(MCP_SLASH_ROOT, 'skills');
export const REGISTRY_DB = process.env.REGISTRY_DB || path.join(MCP_SLASH_ROOT, 'registry.db');
export const CONFIG_HASH_FILE = path.join(MCP_SLASH_ROOT, 'config.hash');

// Config locations
export const CONFIG_LOCATIONS = [
  path.join(process.cwd(), '.mcp.json'),
  path.join(HOME_DIR, '.claude', 'settings.json'),
  path.join(HOME_DIR, '.gemini', 'settings.json'),
  path.join(HOME_DIR, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json') // Added for macOS standard
];

export function ensureDirs() {
  if (!fs.existsSync(MCP_SLASH_ROOT)) fs.mkdirSync(MCP_SLASH_ROOT, { recursive: true });
  if (!fs.existsSync(SCHEMA_DIR)) fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  if (!fs.existsSync(SKILL_DIR)) fs.mkdirSync(SKILL_DIR, { recursive: true });
}
