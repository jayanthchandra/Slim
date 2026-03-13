"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registry_1 = require("../core/registry");
const paths_1 = require("../storage/paths");
async function statusCommand() {
    const registry = new registry_1.Registry();
    await registry.init();
    const servers = await registry.getServers();
    const tools = await registry.getAllTools();
    let originalBytes = 0;
    let compressedBytes = 0;
    for (const server of servers) {
        const schemaPath = path_1.default.join(paths_1.SCHEMA_DIR, `${server.id}.json`);
        const skillPath = path_1.default.join(paths_1.SKILL_DIR, `${server.id}.tools`);
        if (fs_1.default.existsSync(schemaPath)) {
            originalBytes += fs_1.default.statSync(schemaPath).size;
        }
        if (fs_1.default.existsSync(skillPath)) {
            compressedBytes += fs_1.default.statSync(skillPath).size;
        }
    }
    const reduction = originalBytes > 0 ? ((1 - (compressedBytes / originalBytes)) * 100).toFixed(1) : '0.0';
    console.log('Status Report:');
    console.log(`Servers: ${servers.length}`);
    console.log(`Tools: ${tools.length}`);
    console.log(`Estimated Token Savings: ~${reduction}%`);
    await registry.close();
}
