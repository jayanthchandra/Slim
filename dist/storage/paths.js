"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTRY_DB = exports.SKILL_DIR = exports.SCHEMA_DIR = exports.MCP_SLASH_ROOT = void 0;
exports.getActiveCLIName = getActiveCLIName;
exports.getConfigHashFile = getConfigHashFile;
exports.getConfigLocations = getConfigLocations;
exports.ensureDirs = ensureDirs;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const HOME_DIR = os_1.default.homedir();
exports.MCP_SLASH_ROOT = path_1.default.join(HOME_DIR, '.mcp-slim');
exports.SCHEMA_DIR = path_1.default.join(exports.MCP_SLASH_ROOT, 'schemas');
exports.SKILL_DIR = path_1.default.join(exports.MCP_SLASH_ROOT, 'skills');
exports.REGISTRY_DB = process.env.REGISTRY_DB || path_1.default.join(exports.MCP_SLASH_ROOT, 'registry.db');
function getActiveCLIName() {
    if (process.env.GEMINI_CLI)
        return 'gemini';
    if (process.env.CLAUDE_CODE || process.env.CLAUDECODE)
        return 'claude';
    if (process.env.QWEN_CLI || process.env.AUGMENT_AGENT)
        return 'qwen';
    if (process.env.CODEX_SANDBOX || process.env.OPENCODE)
        return 'codex';
    // Fallback to executable path sniffing
    // If installed as an extension: /Users/username/.qwen/extensions/...
    const binPath = process.argv[1] || '';
    if (binPath.includes('.gemini'))
        return 'gemini';
    if (binPath.includes('.claude'))
        return 'claude';
    if (binPath.includes('.qwen'))
        return 'qwen';
    if (binPath.includes('.codex'))
        return 'codex';
    return 'global';
}
function getConfigHashFile() {
    return path_1.default.join(exports.MCP_SLASH_ROOT, `config-${getActiveCLIName()}.hash`);
}
function getConfigLocations() {
    const locations = [];
    const home = os_1.default.homedir();
    // Always allow an explicit local override
    locations.push(path_1.default.join(process.cwd(), '.mcp.json'));
    const activeCLI = getActiveCLIName();
    if (activeCLI === 'gemini') {
        locations.push(path_1.default.join(home, '.gemini', 'settings.json'));
    }
    else if (activeCLI === 'claude') {
        locations.push(path_1.default.join(home, '.claude', 'settings.json'));
        locations.push(path_1.default.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
    }
    else if (activeCLI === 'qwen') {
        locations.push(path_1.default.join(home, '.qwen', 'settings.json'));
    }
    else if (activeCLI === 'codex') {
        locations.push(path_1.default.join(home, '.codex', 'settings.json'));
    }
    else {
        // Fallback: Check them all if run natively outside of a CLI
        locations.push(path_1.default.join(home, '.gemini', 'settings.json'), path_1.default.join(home, '.qwen', 'settings.json'), path_1.default.join(home, '.claude', 'settings.json'), path_1.default.join(home, '.codex', 'settings.json'), path_1.default.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
    }
    return locations;
}
function ensureDirs() {
    if (!fs_1.default.existsSync(exports.MCP_SLASH_ROOT))
        fs_1.default.mkdirSync(exports.MCP_SLASH_ROOT, { recursive: true });
    if (!fs_1.default.existsSync(exports.SCHEMA_DIR))
        fs_1.default.mkdirSync(exports.SCHEMA_DIR, { recursive: true });
    if (!fs_1.default.existsSync(exports.SKILL_DIR))
        fs_1.default.mkdirSync(exports.SKILL_DIR, { recursive: true });
}
