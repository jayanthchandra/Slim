import fs from 'fs';
import path from 'path';
import os from 'os';
import { MCP_SLASH_ROOT } from '../storage/paths';

// Get the absolute path to the current executable's entry point
const BIN_PATH = path.resolve(process.argv[1]);

function getRunner(cliTarget: string): string {
    // If the tool is installed globally (e.g. npm i -g or via git clone), just use its execution path
    let runnerPath = BIN_PATH;

    // If installed specifically via an AI CLI extension system, replace the CLI folder name
    // Example BIN_PATH: /Users/name/.qwen/extensions/mcp-slim/dist/index.js
    if (BIN_PATH.includes('extensions/mcp-slim')) {
        runnerPath = path.join(os.homedir(), `.${cliTarget}`, 'extensions', 'mcp-slim', 'dist', 'index.js');
    }

    return runnerPath.endsWith('.js') ? `node ${runnerPath}` : runnerPath;
}

/**
 * Generates configuration for Gemini CLI
 */
export function generateGeminiConfig() {
    const RUNNER = getRunner('gemini');
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
    const RUNNER = getRunner('qwen');
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
    const RUNNER = getRunner('claude');
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
