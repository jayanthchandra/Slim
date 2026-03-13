"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectCommand = inspectCommand;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const registry_1 = require("../core/registry");
const paths_1 = require("../storage/paths");
async function inspectCommand() {
    const registry = new registry_1.Registry();
    await registry.init();
    const servers = await registry.getServers();
    if (servers.length === 0) {
        console.log('No servers found.');
        await registry.close();
        return;
    }
    for (const server of servers) {
        const skillPath = path_1.default.join(paths_1.SKILL_DIR, `${server.id}.tools`);
        if (fs_1.default.existsSync(skillPath)) {
            console.log(fs_1.default.readFileSync(skillPath, 'utf-8'));
            console.log(); // extra newline for separation
        }
    }
    await registry.close();
}
