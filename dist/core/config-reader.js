"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../storage/paths");
function readConfig() {
    for (const loc of (0, paths_1.getConfigLocations)()) {
        if (fs_1.default.existsSync(loc)) {
            try {
                const content = fs_1.default.readFileSync(loc, 'utf-8');
                const json = JSON.parse(content);
                if (json.mcpServers) {
                    return { mcpServers: json.mcpServers };
                }
            }
            catch (e) {
                console.error(`Error reading config at ${loc}:`, e);
            }
        }
    }
    return null;
}
