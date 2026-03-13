"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_LOCATIONS = exports.CONFIG_HASH_FILE = exports.REGISTRY_DB = exports.SKILL_DIR = exports.SCHEMA_DIR = exports.MCP_SLASH_ROOT = void 0;
exports.ensureDirs = ensureDirs;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const HOME_DIR = os_1.default.homedir();
exports.MCP_SLASH_ROOT = path_1.default.join(HOME_DIR, '.mcp-slim');
exports.SCHEMA_DIR = path_1.default.join(exports.MCP_SLASH_ROOT, 'schemas');
exports.SKILL_DIR = path_1.default.join(exports.MCP_SLASH_ROOT, 'skills');
exports.REGISTRY_DB = process.env.REGISTRY_DB || path_1.default.join(exports.MCP_SLASH_ROOT, 'registry.db');
exports.CONFIG_HASH_FILE = path_1.default.join(exports.MCP_SLASH_ROOT, 'config.hash');
// Config locations
exports.CONFIG_LOCATIONS = [
    path_1.default.join(process.cwd(), '.mcp.json'),
    path_1.default.join(HOME_DIR, '.claude', 'settings.json'),
    path_1.default.join(HOME_DIR, '.gemini', 'settings.json'),
    path_1.default.join(HOME_DIR, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json') // Added for macOS standard
];
function ensureDirs() {
    if (!fs_1.default.existsSync(exports.MCP_SLASH_ROOT))
        fs_1.default.mkdirSync(exports.MCP_SLASH_ROOT, { recursive: true });
    if (!fs_1.default.existsSync(exports.SCHEMA_DIR))
        fs_1.default.mkdirSync(exports.SCHEMA_DIR, { recursive: true });
    if (!fs_1.default.existsSync(exports.SKILL_DIR))
        fs_1.default.mkdirSync(exports.SKILL_DIR, { recursive: true });
}
