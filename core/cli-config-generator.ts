import fs from 'fs';
import path from 'path';
import { MCP_SLASH_ROOT } from '../storage/paths';

// Get the absolute path to the current executable's entry point
const BIN_PATH = path.resolve(process.argv[1]);
const RUNNER = BIN_PATH.endsWith('.js') ? `node ${BIN_PATH}` : BIN_PATH;

/**
 * Generates configuration for Gemini CLI
 */
export function generateGeminiConfig() {
    const tomlContent = `
[commands]
# Gemini CLI native slash commands for mcp-slim
"/slim init" = "${RUNNER} init"
"/slim update" = "${RUNNER} update"
"/slim status" = "${RUNNER} status"
"/slim inspect" = "${RUNNER} inspect"
"/slim scrub" = "${RUNNER} scrub"

[hooks]
pre_session = "${RUNNER} update"
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
        commands: {
            "slim init": "${RUNNER} init",
            "slim update": "${RUNNER} update",
            "slim status": "${RUNNER} status",
            "slim inspect": "${RUNNER} inspect",
            "slim scrub": "${RUNNER} scrub"
        },
        hooks: {
            "pre_session": "${RUNNER} update"
        }
    };
    const configPath = path.join(MCP_SLASH_ROOT, 'qwen.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return configPath;
}

/**
 * Generates configuration for Claude (Desktop/CLI)
 */
export function generateClaudeConfig() {
    const mdContent = `
# MCP Slim - Claude Integration
Add this to your Claude Desktop config or custom instructions:

1. Always run "${RUNNER} update" before starting a session.
2. When you see compressed tool signatures, refer to ~/.mcp-slim/skills/ for full context.
`;
    const configPath = path.join(MCP_SLASH_ROOT, 'claude.md');
    fs.writeFileSync(configPath, mdContent);
    return configPath;
}
