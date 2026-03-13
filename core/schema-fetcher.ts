import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { MCPServerConfig, MCPTool } from '../types/mcp';
import { SCHEMA_DIR } from '../storage/paths';

/**
 * Fetches tool schemas for a given MCP server.
 * Tries cache first, then attempts a live fetch via stdio JSON-RPC.
 */
export async function fetchSchemas(serverName: string, config: MCPServerConfig): Promise<MCPTool[]> {
  const schemaPath = path.join(SCHEMA_DIR, `${serverName}.json`);
  
  // 1. Try Cache
  if (fs.existsSync(schemaPath)) {
    try {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data)) return data as MCPTool[];
      if (data.tools) return data.tools as MCPTool[];
    } catch (e) {
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
  } catch (e) {
    console.warn(`  [${serverName}] Live fetch failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  return [];
}

export function saveSchemas(serverName: string, tools: MCPTool[]) {
    const schemaPath = path.join(SCHEMA_DIR, `${serverName}.json`);
    fs.writeFileSync(schemaPath, JSON.stringify(tools, null, 2));
}

/**
 * Generic MCP Stdio Client
 * Spawns the server, performs handshake, and lists tools.
 */
async function listToolsFromMcpServer(config: MCPServerConfig): Promise<MCPTool[]> {
    return new Promise((resolve, reject) => {
        // Many MCP servers use npx which might output non-JSON noise to stdout
        const child = spawn(config.command, config.args || [], {
            env: { ...process.env, ...config.env },
            stdio: ['pipe', 'pipe', 'pipe'] // Capture stderr to avoid polluting CLI
        });

        let tools: MCPTool[] = [];
        let initialized = false;
        let responseBuffer = '';

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error('Timed out waiting for MCP server response (10s)'));
        }, 10000);

        const sendJsonRpc = (method: string, params: any, id: number) => {
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
                if (!line.trim()) continue;
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
                } catch (e) {
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
