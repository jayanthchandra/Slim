"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSchemas = fetchSchemas;
exports.saveSchemas = saveSchemas;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const paths_1 = require("../storage/paths");
/**
 * Fetches tool schemas for a given MCP server.
 * Tries cache first, then attempts a live fetch via stdio JSON-RPC.
 */
async function fetchSchemas(serverName, config) {
    const schemaPath = path_1.default.join(paths_1.SCHEMA_DIR, `${serverName}.json`);
    // 1. Try Cache
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
            // If cache is corrupt, proceed to fetch
        }
    }
    // 2. Live Fetch via Stdio (JSON-RPC)
    try {
        const tools = await listToolsFromMcpServer(config);
        if (tools && tools.length > 0) {
            saveSchemas(serverName, tools);
            return tools;
        }
    }
    catch (e) {
        console.warn(`  [${serverName}] Live fetch failed: ${e instanceof Error ? e.message : String(e)}`);
    }
    return [];
}
function saveSchemas(serverName, tools) {
    const schemaPath = path_1.default.join(paths_1.SCHEMA_DIR, `${serverName}.json`);
    fs_1.default.writeFileSync(schemaPath, JSON.stringify(tools, null, 2));
}
/**
 * Generic MCP Stdio Client
 * Spawns the server, performs handshake, and lists tools.
 */
async function listToolsFromMcpServer(config) {
    return new Promise((resolve, reject) => {
        // Many MCP servers use npx which might output non-JSON noise to stdout
        const child = (0, child_process_1.spawn)(config.command, config.args || [], {
            env: { ...process.env, ...config.env },
            stdio: ['pipe', 'pipe', 'pipe'] // Capture stderr to avoid polluting CLI
        });
        let tools = [];
        let initialized = false;
        let responseBuffer = '';
        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error('Timed out waiting for MCP server response (10s)'));
        }, 10000);
        const sendJsonRpc = (method, params, id) => {
            child.stdin.write(JSON.stringify({
                jsonrpc: "2.0",
                id,
                method,
                params
            }) + '\n');
        };
        child.stdout.on('data', (data) => {
            responseBuffer += data.toString();
            const lines = responseBuffer.split('\n');
            // Keep the last partial line in the buffer
            responseBuffer = lines.pop() || '';
            for (const line of lines) {
                if (!line.trim())
                    continue;
                try {
                    const msg = JSON.parse(line);
                    // 1. Handle Initialization Response
                    if (msg.id === 1 && !initialized) {
                        initialized = true;
                        // Protocol handshake successful, now ask for tools
                        sendJsonRpc("tools/list", {}, 2);
                    }
                    // 2. Handle tools/list Response
                    else if (msg.id === 2) {
                        tools = msg.result?.tools || [];
                        clearTimeout(timeout);
                        child.kill();
                        resolve(tools);
                    }
                }
                catch (e) {
                    // Ignore non-JSON lines (noise from npx, etc.)
                }
            }
        });
        // Some servers might log errors to stderr
        child.stderr.on('data', (data) => {
            // Silence stderr unless debugging
        });
        // Initiation: Step 1 - Send 'initialize'
        sendJsonRpc("initialize", {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: { name: "mcp-slim", version: "1.0.0" }
        }, 1);
        child.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
        child.on('exit', (code) => {
            if (!initialized || (tools.length === 0 && code !== 0)) {
                reject(new Error(`Server exited with code ${code} before providing tools`));
            }
        });
    });
}
