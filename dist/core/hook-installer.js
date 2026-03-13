"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPrehook = installPrehook;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
function installPrehook() {
    const home = os_1.default.homedir();
    const shell = process.env.SHELL || '';
    let profile = '';
    if (shell.includes('zsh')) {
        profile = path_1.default.join(home, '.zshrc');
    }
    else if (shell.includes('bash')) {
        profile = fs_1.default.existsSync(path_1.default.join(home, '.bash_profile'))
            ? path_1.default.join(home, '.bash_profile')
            : path_1.default.join(home, '.bashrc');
    }
    if (!profile || !fs_1.default.existsSync(profile)) {
        return null;
    }
    // Add pre-hook and alias
    const hookCommand = `\n# mcp-slim prehook\nif command -v slim >/dev/null 2>&1; then\n  slim update > /dev/null 2>&1 &\n  alias /slim='slim'\nfi\n`;
    try {
        const content = fs_1.default.readFileSync(profile, 'utf-8');
        if (!content.includes('mcp-slim prehook')) {
            fs_1.default.appendFileSync(profile, hookCommand);
            return profile;
        }
        return 'already-installed';
    }
    catch (e) {
        console.error(`Failed to update shell profile ${profile}:`, e);
        return null;
    }
}
