import path from 'path';
import os from 'os';
import fs from 'fs';

const HOME_DIR = os.homedir();
export const MCP_SLASH_ROOT = path.join(HOME_DIR, '.mcp-slim');
export const SCHEMA_DIR = path.join(MCP_SLASH_ROOT, 'schemas');
export const SKILL_DIR = path.join(MCP_SLASH_ROOT, 'skills');
export const REGISTRY_DB = process.env.REGISTRY_DB || path.join(MCP_SLASH_ROOT, 'registry.db');

export function getActiveCLIName(): string {
  if (process.env.GEMINI_CLI) return 'gemini';
  if (process.env.CLAUDE_CODE || process.env.CLAUDECODE) return 'claude';
  if (process.env.QWEN_CLI || process.env.AUGMENT_AGENT) return 'qwen';
  if (process.env.CODEX_SANDBOX || process.env.OPENCODE) return 'codex';

  // Fallback to executable path sniffing
  // If installed as an extension: /Users/username/.qwen/extensions/...
  const binPath = process.argv[1] || '';
  if (binPath.includes('.gemini')) return 'gemini';
  if (binPath.includes('.claude')) return 'claude';
  if (binPath.includes('.qwen')) return 'qwen';
  if (binPath.includes('.codex')) return 'codex';

  return 'global';
}

export function getConfigHashFile(): string {
  return path.join(MCP_SLASH_ROOT, `config-${getActiveCLIName()}.hash`);
}

export function getConfigLocations(): string[] {
  const locations: string[] = [];
  const home = os.homedir();

  // Always allow an explicit local override
  locations.push(path.join(process.cwd(), '.mcp.json'));

  const activeCLI = getActiveCLIName();

  if (activeCLI === 'gemini') {
    locations.push(path.join(home, '.gemini', 'settings.json'));
  } else if (activeCLI === 'claude') {
    locations.push(path.join(home, '.claude', 'settings.json'));
    locations.push(path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
  } else if (activeCLI === 'qwen') {
    locations.push(path.join(home, '.qwen', 'settings.json'));
  } else if (activeCLI === 'codex') {
    locations.push(path.join(home, '.codex', 'settings.json'));
  } else {
    // Fallback: Check them all if run natively outside of a CLI
    locations.push(
      path.join(home, '.gemini', 'settings.json'),
      path.join(home, '.qwen', 'settings.json'),
      path.join(home, '.claude', 'settings.json'),
      path.join(home, '.codex', 'settings.json'),
      path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
    );
  }

  return locations;
}

export function ensureDirs() {
  if (!fs.existsSync(MCP_SLASH_ROOT)) fs.mkdirSync(MCP_SLASH_ROOT, { recursive: true });
  if (!fs.existsSync(SCHEMA_DIR)) fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  if (!fs.existsSync(SKILL_DIR)) fs.mkdirSync(SKILL_DIR, { recursive: true });
}
