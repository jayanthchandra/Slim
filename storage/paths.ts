import path from 'path';
import os from 'os';
import fs from 'fs';

const HOME_DIR = os.homedir();
export const MCP_SLASH_ROOT = path.join(HOME_DIR, '.mcp-slim');
export const SCHEMA_DIR = path.join(MCP_SLASH_ROOT, 'schemas');
export const SKILL_DIR = path.join(MCP_SLASH_ROOT, 'skills');
export const REGISTRY_DB = process.env.REGISTRY_DB || path.join(MCP_SLASH_ROOT, 'registry.db');
export const CONFIG_HASH_FILE = path.join(MCP_SLASH_ROOT, 'config.hash');

export function getConfigLocations(): string[] {
  const locations: string[] = [];

  // Always allow an explicit local override
  locations.push(path.join(process.cwd(), '.mcp.json'));

  if (process.env.GEMINI_CLI) {
    locations.push(path.join(HOME_DIR, '.gemini', 'settings.json'));
  } else if (process.env.CLAUDE_CODE || process.env.CLAUDECODE) {
    locations.push(path.join(HOME_DIR, '.claude', 'settings.json'));
    locations.push(path.join(HOME_DIR, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
  } else if (process.env.QWEN_CLI || process.env.AUGMENT_AGENT) {
    locations.push(path.join(HOME_DIR, '.qwen', 'settings.json'));
  } else if (process.env.CODEX_SANDBOX || process.env.OPENCODE) {
    locations.push(path.join(HOME_DIR, '.codex', 'settings.json'));
  } else {
    // Fallback: Check them all if run natively outside of a CLI
    locations.push(
      path.join(HOME_DIR, '.gemini', 'settings.json'),
      path.join(HOME_DIR, '.qwen', 'settings.json'),
      path.join(HOME_DIR, '.claude', 'settings.json'),
      path.join(HOME_DIR, '.codex', 'settings.json'),
      path.join(HOME_DIR, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    );
  }

  return locations;
}

export function ensureDirs() {
  if (!fs.existsSync(MCP_SLASH_ROOT)) fs.mkdirSync(MCP_SLASH_ROOT, { recursive: true });
  if (!fs.existsSync(SCHEMA_DIR)) fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  if (!fs.existsSync(SKILL_DIR)) fs.mkdirSync(SKILL_DIR, { recursive: true });
}
