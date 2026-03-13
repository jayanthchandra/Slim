"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSchemas = fetchSchemas;
exports.saveSchemas = saveSchemas;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../storage/paths");
async function fetchSchemas(serverName, config) {
    // For V1, we assume schemas might be provided externally or we simulate a fetch for known types.
    // In a real implementation, this would connect to the MCP server via stdio.
    const schemaPath = path_1.default.join(paths_1.SCHEMA_DIR, `${serverName}.json`);
    if (fs_1.default.existsSync(schemaPath)) {
        try {
            const content = fs_1.default.readFileSync(schemaPath, 'utf-8');
            const data = JSON.parse(content);
            if (Array.isArray(data))
                return data;
            if (data.tools)
                return data.tools;
        }
        catch (e) {
            console.error(`Failed to read schema for ${serverName}`, e);
        }
    }
    // Fallback/Mock for demonstration if 'github'
    if (serverName === 'github') {
        return [
            {
                name: "create_issue",
                description: "Create GitHub issue",
                inputSchema: {
                    properties: {
                        repo: { "type": "string" },
                        title: { "type": "string" },
                        body: { "type": "string" }
                    }
                }
            },
            {
                name: "list_issues",
                description: "List issues in a repository",
                inputSchema: {
                    properties: {
                        repo: { "type": "string" }
                    }
                }
            }
        ];
    }
    return [];
}
function saveSchemas(serverName, tools) {
    const schemaPath = path_1.default.join(paths_1.SCHEMA_DIR, `${serverName}.json`);
    fs_1.default.writeFileSync(schemaPath, JSON.stringify(tools, null, 2));
}
