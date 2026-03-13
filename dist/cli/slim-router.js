"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const init_1 = require("./init");
const update_1 = require("./update");
const scrub_1 = require("./scrub");
const status_1 = require("./status");
const inspect_1 = require("./inspect");
async function router(args) {
    // args might be ["/slim", "init"] or ["init"]
    if (args.length === 0) {
        console.log(`
mcp-slim - Compress MCP tool schemas into signatures

Usage: slim <command>

Available commands:
  init     Initialize and fetch MCP tools
  update   Sync changes and refresh signatures
  status   Show token reduction stats
  inspect  Visualize tool signatures
  scrub    Reset all local state
    `);
        return;
    }
    let command = args[0];
    if (command === '/slim' || command === '/slash') {
        command = args[1];
    }
    switch (command) {
        case 'init':
            await (0, init_1.initCommand)();
            break;
        case 'update':
            await (0, update_1.updateCommand)();
            break;
        case 'scrub':
            (0, scrub_1.scrubCommand)();
            break;
        case 'status':
            await (0, status_1.statusCommand)();
            break;
        case 'inspect':
            await (0, inspect_1.inspectCommand)();
            break;
        default:
            console.log('Unknown command. Available commands: init, update, scrub, status, inspect');
            break;
    }
}
