import fs from 'fs';
import path from 'path';
import { MCP_SLASH_ROOT } from '../storage/paths';

/**
 * Generates configuration for Gemini CLI
 */
export function generateGeminiConfig() {
  const tomlContent = `
[commands]
# Gemini CLI native slash commands for mcp-slim
"/slim init" = "slim init"
"/slim update" = "slim update"
"/slim status" = "slim status"
"/slim inspect" = "slim inspect"
"/slim scrub" = "slim scrub"

[hooks]
pre_session = "slim update"
`;

  const configPath = path.join(MCP_SLASH_ROOT, 'gemini.toml');
  fs.writeFileSync(configPath, tomlContent);
  return configPath;
}

/**
 * Generates configuration for Qwen CLI
 */
export function generateQwenConfig() {
    const config = {
        name: "mcp-slim",
        commands: {
            "init": "slim init",
            "update": "slim update",
            "status": "slim status"
        },
        hooks: {
            "pre-session": "slim update"
        }
    };
    const configPath = path.join(MCP_SLASH_ROOT, 'qwen.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return configPath;
}

/**
 * Generates configuration for Claude (Desktop/CLI)
 * Claude usually requires custom instructions or extensions to recognize new commands.
 */
export function generateClaudeConfig() {
    const mdContent = `
# MCP Slim - Claude Integration
Add this to your Claude Desktop config or custom instructions:

1. Always run "slim update" before starting a session (automated via mcp-slim pre-hook).
2. When you see compressed tool signatures like "tool_name(param1, param2)", refer to ~/.mcp-slim/skills/ for full context if needed.
`;
    const configPath = path.join(MCP_SLASH_ROOT, 'claude.md');
    fs.writeFileSync(configPath, mdContent);
    return configPath;
}
