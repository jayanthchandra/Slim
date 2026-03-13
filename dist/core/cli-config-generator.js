"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiConfig = generateGeminiConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../storage/paths");
function generateGeminiConfig() {
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
    const configPath = path_1.default.join(paths_1.MCP_SLASH_ROOT, 'gemini.toml');
    fs_1.default.writeFileSync(configPath, tomlContent);
    return configPath;
}
