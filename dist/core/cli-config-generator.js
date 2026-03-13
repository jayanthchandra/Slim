"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiConfig = generateGeminiConfig;
exports.generateQwenConfig = generateQwenConfig;
exports.generateClaudeConfig = generateClaudeConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../storage/paths");
// Get the absolute path to the current executable's entry point
const BIN_PATH = path_1.default.resolve(process.argv[1]);
const RUNNER = BIN_PATH.endsWith('.js') ? `node ${BIN_PATH}` : BIN_PATH;
/**
 * Generates configuration for Gemini CLI
 */
function generateGeminiConfig() {
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
    const configPath = path_1.default.join(paths_1.MCP_SLASH_ROOT, 'gemini.toml');
    fs_1.default.writeFileSync(configPath, tomlContent);
    return configPath;
}
/**
 * Generates configuration for Qwen CLI
 */
function generateQwenConfig() {
    const config = {
        name: "mcp-slim",
        commands: {
            "init": "${RUNNER} init",
            "update": "${RUNNER} update",
            "status": "${RUNNER} status",
            "inspect": "${RUNNER} inspect",
            "scrub": "${RUNNER} scrub"
        },
        hooks: {
            "pre-session": "${RUNNER} update"
        }
    };
    const configPath = path_1.default.join(paths_1.MCP_SLASH_ROOT, 'qwen.json');
    fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return configPath;
}
/**
 * Generates configuration for Claude (Desktop/CLI)
 */
function generateClaudeConfig() {
    const mdContent = `
# MCP Slim - Claude Integration
Add this to your Claude Desktop config or custom instructions:

1. Always run "${RUNNER} update" before starting a session.
2. When you see compressed tool signatures, refer to ~/.mcp-slim/skills/ for full context.
`;
    const configPath = path_1.default.join(paths_1.MCP_SLASH_ROOT, 'claude.md');
    fs_1.default.writeFileSync(configPath, mdContent);
    return configPath;
}
