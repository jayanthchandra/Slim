"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrubCommand = scrubCommand;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../storage/paths");
function scrubCommand() {
    if (fs_1.default.existsSync(paths_1.MCP_SLASH_ROOT)) {
        fs_1.default.rmSync(paths_1.MCP_SLASH_ROOT, { recursive: true, force: true });
        console.log(`Deleted ${paths_1.MCP_SLASH_ROOT}`);
    }
    else {
        console.log(`${paths_1.MCP_SLASH_ROOT} does not exist.`);
    }
}
